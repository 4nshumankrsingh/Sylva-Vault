import { prisma } from "@/lib/prisma";

// ── Types ──────────────────────────────────────────────────────────────────

export interface DrawResult {
  drawnNumbers:  number[];
  entries:       EntryResult[];
  winners:       WinnerResult[];
  prizePool:     PoolBreakdown;
  jackpotRolled: boolean;
}

export interface EntryResult {
  userId:     string;
  numbers:    number[];
  matchCount: number;
}

export interface WinnerResult {
  userId:      string;
  matchCount:  number;
  prizeAmount: number;
}

export interface PoolBreakdown {
  total:           number;
  fiveMatch:       number;
  fourMatch:       number;
  threeMatch:      number;
  jackpotRollover: number;
}

// ── Constants ──────────────────────────────────────────────────────────────

const MONTHLY_PRICE   = 9.99;
const YEARLY_MONTHLY  = 99.99 / 12;
const POOL_PERCENTAGE = 0.5; // 50% of subscriptions → prize pool

// ── Prize pool calculation ─────────────────────────────────────────────────

export async function calculatePrizePool(
  previousRollover = 0
): Promise<PoolBreakdown> {
  const monthlyCount = await prisma.subscription.count({
    where: { status: "ACTIVE", plan: "MONTHLY" },
  });
  const yearlyCount = await prisma.subscription.count({
    where: { status: "ACTIVE", plan: "YEARLY" },
  });

  const total =
    monthlyCount * MONTHLY_PRICE  * POOL_PERCENTAGE +
    yearlyCount  * YEARLY_MONTHLY * POOL_PERCENTAGE +
    previousRollover;

  return {
    total:           parseFloat(total.toFixed(2)),
    fiveMatch:       parseFloat((total * 0.40).toFixed(2)),
    fourMatch:       parseFloat((total * 0.35).toFixed(2)),
    threeMatch:      parseFloat((total * 0.25).toFixed(2)),
    jackpotRollover: previousRollover,
  };
}

// ── Draw number generation ─────────────────────────────────────────────────

export function generateRandomNumbers(): number[] {
  const nums = new Set<number>();
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(nums).sort((a, b) => a - b);
}

export async function generateAlgorithmicNumbers(): Promise<number[]> {
  const scores = await prisma.score.findMany({ select: { value: true } });

  const frequency: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) frequency[i] = 0;
  scores.forEach(s => { frequency[s.value] = (frequency[s.value] || 0) + 1; });

  // Rarer scores get higher weight
  const maxFreq     = Math.max(...Object.values(frequency)) + 1;
  const weights     = Object.entries(frequency).map(([num, freq]) => ({
    num:    parseInt(num),
    weight: maxFreq - freq,
  }));
  const totalWeight = weights.reduce((acc, w) => acc + w.weight, 0);

  const chosen = new Set<number>();
  while (chosen.size < 5) {
    let rand = Math.random() * totalWeight;
    for (const { num, weight } of weights) {
      rand -= weight;
      if (rand <= 0 && !chosen.has(num)) {
        chosen.add(num);
        break;
      }
    }
  }
  return Array.from(chosen).sort((a, b) => a - b);
}

// ── Match counting ─────────────────────────────────────────────────────────

export function countMatches(entry: number[], drawn: number[]): number {
  const drawnSet = new Set(drawn);
  return entry.filter(n => drawnSet.has(n)).length;
}

// ── Prize distribution ─────────────────────────────────────────────────────

export function distributePrizes(
  entries: EntryResult[],
  pool:    PoolBreakdown,
): { winners: WinnerResult[]; jackpotRolled: boolean } {
  const fiveMatch  = entries.filter(e => e.matchCount === 5);
  const fourMatch  = entries.filter(e => e.matchCount === 4);
  const threeMatch = entries.filter(e => e.matchCount === 3);

  const winners: WinnerResult[] = [];
  let jackpotRolled = false;

  if (fiveMatch.length === 0) {
    jackpotRolled = true;
  } else {
    const share = parseFloat((pool.fiveMatch / fiveMatch.length).toFixed(2));
    fiveMatch.forEach(e => winners.push({ userId: e.userId, matchCount: 5, prizeAmount: share }));
  }

  if (fourMatch.length > 0) {
    const share = parseFloat((pool.fourMatch / fourMatch.length).toFixed(2));
    fourMatch.forEach(e => winners.push({ userId: e.userId, matchCount: 4, prizeAmount: share }));
  }

  if (threeMatch.length > 0) {
    const share = parseFloat((pool.threeMatch / threeMatch.length).toFixed(2));
    threeMatch.forEach(e => winners.push({ userId: e.userId, matchCount: 3, prizeAmount: share }));
  }

  return { winners, jackpotRolled };
}

// ── Full draw simulation (no DB writes) ───────────────────────────────────

export async function simulateDraw(
  month:    number,
  year:     number,
  type:     "RANDOM" | "ALGORITHMIC",
  rollover: number
): Promise<DrawResult> {
  const drawnNumbers = type === "ALGORITHMIC"
    ? await generateAlgorithmicNumbers()
    : generateRandomNumbers();

  const subscribers = await prisma.user.findMany({
    where:   { subscription: { status: "ACTIVE" } },
    include: { scores: { orderBy: { datePlayed: "desc" }, take: 5 } },
  });

  const entries: EntryResult[] = subscribers
    .filter(u => u.scores.length >= 3)
    .map(u => ({
      userId:     u.id,
      numbers:    u.scores.map(s => s.value),
      matchCount: countMatches(u.scores.map(s => s.value), drawnNumbers),
    }));

  const pool = await calculatePrizePool(rollover);
  const { winners, jackpotRolled } = distributePrizes(entries, pool);

  return { drawnNumbers, entries, winners, prizePool: pool, jackpotRolled };
}

// ── Official draw (writes to DB) ──────────────────────────────────────────

export async function runOfficialDraw(
  month: number,
  year:  number,
  type:  "RANDOM" | "ALGORITHMIC"
): Promise<DrawResult> {
  // Get rollover from last published draw
  const prevDraw = await prisma.draw.findFirst({
    where:   { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { prizePool: true },
  });
  const rollover = prevDraw?.prizePool?.jackpotRollover ?? 0;

  const result = await simulateDraw(month, year, type, rollover);

  await prisma.$transaction(async (tx) => {
    const draw = await tx.draw.upsert({
      where:  { month_year: { month, year } },
      create: {
        month,
        year,
        type,
        status:       "PUBLISHED",
        drawnNumbers: result.drawnNumbers,
        publishedAt:  new Date(),
      },
      update: {
        type,
        status:       "PUBLISHED",
        drawnNumbers: result.drawnNumbers,
        publishedAt:  new Date(),
      },
    });

    await tx.prizePool.upsert({
      where:  { drawId: draw.id },
      create: {
        drawId:           draw.id,
        totalAmount:      result.prizePool.total,
        fiveMatchAmount:  result.prizePool.fiveMatch,
        fourMatchAmount:  result.prizePool.fourMatch,
        threeMatchAmount: result.prizePool.threeMatch,
        jackpotRollover:  result.jackpotRolled ? result.prizePool.fiveMatch : 0,
      },
      update: {
        totalAmount:      result.prizePool.total,
        fiveMatchAmount:  result.prizePool.fiveMatch,
        fourMatchAmount:  result.prizePool.fourMatch,
        threeMatchAmount: result.prizePool.threeMatch,
        jackpotRollover:  result.jackpotRolled ? result.prizePool.fiveMatch : 0,
      },
    });

    for (const entry of result.entries) {
      await tx.drawEntry.upsert({
        where:  { drawId_userId: { drawId: draw.id, userId: entry.userId } },
        create: { drawId: draw.id, userId: entry.userId, numbers: entry.numbers },
        update: { numbers: entry.numbers },
      });
    }

    for (const winner of result.winners) {
      await tx.winner.create({
        data: {
          drawId:             draw.id,
          userId:             winner.userId,
          matchCount:         winner.matchCount,
          prizeAmount:        winner.prizeAmount,
          paymentStatus:      "PENDING",
          verificationStatus: "PENDING",
        },
      });
    }
  });

  return result;
}