// Email HTML templates for Sylva Vault notifications

export function drawResultsTemplate({
  userName,
  month,
  year,
  drawnNumbers,
  matchCount,
  prizeAmount,
  isWinner,
}: {
  userName: string;
  month: number;
  year: number;
  drawnNumbers: number[];
  matchCount?: number;
  prizeAmount?: number;
  isWinner: boolean;
}): string {
  const monthName = new Date(year, month - 1, 1).toLocaleString("en-GB", {
    month: "long",
  });

  const winnerSection = isWinner
    ? `
    <div style="background:#f0f9f4;border:1px solid #cce4d8;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
      <p style="color:#065d38;font-size:13px;font-weight:600;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.05em;">Congratulations!</p>
      <p style="color:#0a1a12;font-size:24px;font-weight:700;margin:0 0 8px 0;">You matched ${matchCount} numbers</p>
      <p style="color:#0a7c4d;font-size:28px;font-weight:700;margin:0;">£${prizeAmount?.toFixed(2)}</p>
      <p style="color:#527a65;font-size:13px;margin:8px 0 0 0;">Prize pending verification</p>
    </div>
    <p style="color:#0a1a12;font-size:15px;line-height:1.6;margin:0 0 16px 0;">
      To claim your prize, please log in to your dashboard and upload a screenshot of your scores from your golf platform as proof. Your prize will be reviewed and paid out within 5 business days of approval.
    </p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background:#0a7c4d;color:#ffffff;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">Upload Proof &amp; Claim Prize</a>
    </div>
    `
    : `
    <p style="color:#527a65;font-size:15px;line-height:1.6;margin:0 0 16px 0;">
      Unfortunately you did not match enough numbers this month. Keep entering your scores — the jackpot rolls over and your next chance is just around the corner.
    </p>
    `;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Draw Results — Sylva Vault</title></head>
  <body style="margin:0;padding:0;background:#f4f8f6;font-family:'DM Sans',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8f6;padding:32px 16px;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #cce4d8;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a7c4d,#00b4d8);padding:32px;text-align:center;">
              <p style="color:#ffffff;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px 0;">Sylva Vault</p>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;">${monthName} ${year} Draw Results</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="color:#527a65;font-size:14px;margin:0 0 16px 0;">Hi ${userName},</p>
              <p style="color:#0a1a12;font-size:15px;line-height:1.6;margin:0 0 24px 0;">The ${monthName} ${year} draw has been completed. Here are the winning numbers:</p>
              <!-- Drawn numbers -->
              <div style="background:#f4f8f6;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px 0;">
                <p style="color:#527a65;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px 0;">Drawn Numbers</p>
                <div style="display:inline-flex;gap:10px;">
                  ${drawnNumbers
                    .map(
                      (n) =>
                        `<span style="display:inline-block;width:40px;height:40px;border-radius:50%;background:#0a7c4d;color:#ffffff;font-size:16px;font-weight:700;line-height:40px;text-align:center;">${n}</span>`
                    )
                    .join("")}
                </div>
              </div>
              ${winnerSection}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f4f8f6;padding:20px 32px;border-top:1px solid #cce4d8;text-align:center;">
              <p style="color:#527a65;font-size:12px;margin:0;">© ${new Date().getFullYear()} Sylva Vault · Golf meets generosity</p>
              <p style="color:#527a65;font-size:12px;margin:4px 0 0 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color:#0a7c4d;text-decoration:none;">Dashboard</a> &nbsp;·&nbsp;
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/draws" style="color:#0a7c4d;text-decoration:none;">Draw History</a>
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>
  `;
}

export function winnerVerifiedTemplate({
  userName,
  matchCount,
  prizeAmount,
  status,
}: {
  userName: string;
  matchCount: number;
  prizeAmount: number;
  status: "APPROVED" | "REJECTED";
}): string {
  const isApproved = status === "APPROVED";

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Winner Verification — Sylva Vault</title></head>
  <body style="margin:0;padding:0;background:#f4f8f6;font-family:'DM Sans',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8f6;padding:32px 16px;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #cce4d8;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,${isApproved ? "#0a7c4d,#00b4d8" : "#ef4444,#f97316"});padding:32px;text-align:center;">
              <p style="color:#ffffff;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px 0;">Sylva Vault</p>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;">Verification ${isApproved ? "Approved" : "Rejected"}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="color:#527a65;font-size:14px;margin:0 0 16px 0;">Hi ${userName},</p>
              ${
                isApproved
                  ? `
                <p style="color:#0a1a12;font-size:15px;line-height:1.6;margin:0 0 24px 0;">Your prize claim has been <strong style="color:#0a7c4d;">approved</strong>. Your payment is being processed and will arrive within 5 business days.</p>
                <div style="background:#f0f9f4;border:1px solid #cce4d8;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px 0;">
                  <p style="color:#527a65;font-size:13px;margin:0 0 8px 0;">${matchCount}-Number Match Prize</p>
                  <p style="color:#0a7c4d;font-size:32px;font-weight:700;margin:0;">£${prizeAmount.toFixed(2)}</p>
                </div>
                <div style="text-align:center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background:#0a7c4d;color:#ffffff;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">View Dashboard</a>
                </div>
                `
                  : `
                <p style="color:#0a1a12;font-size:15px;line-height:1.6;margin:0 0 24px 0;">Unfortunately your prize proof submission could not be verified. This may be because the screenshot was unclear, did not match the required scores, or was from an ineligible round.</p>
                <p style="color:#0a1a12;font-size:15px;line-height:1.6;margin:0 0 24px 0;">If you believe this is an error, please contact our support team with your original proof.</p>
                <div style="text-align:center;">
                  <a href="mailto:support@sylvavault.com" style="background:#0a1a12;color:#ffffff;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">Contact Support</a>
                </div>
                `
              }
            </td>
          </tr>
          <tr>
            <td style="background:#f4f8f6;padding:20px 32px;border-top:1px solid #cce4d8;text-align:center;">
              <p style="color:#527a65;font-size:12px;margin:0;">© ${new Date().getFullYear()} Sylva Vault · Golf meets generosity</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>
  `;
}

export function paymentSentTemplate({
  userName,
  prizeAmount,
  matchCount,
}: {
  userName: string;
  prizeAmount: number;
  matchCount: number;
}): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Prize Paid — Sylva Vault</title></head>
  <body style="margin:0;padding:0;background:#f4f8f6;font-family:'DM Sans',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8f6;padding:32px 16px;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #cce4d8;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#0a7c4d,#00b4d8);padding:32px;text-align:center;">
              <p style="color:#ffffff;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px 0;">Sylva Vault</p>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;">Your Prize Has Been Paid</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="color:#527a65;font-size:14px;margin:0 0 16px 0;">Hi ${userName},</p>
              <p style="color:#0a1a12;font-size:15px;line-height:1.6;margin:0 0 24px 0;">Great news — your prize payment has been processed and sent. Please allow 1–3 business days for it to appear in your account.</p>
              <div style="background:#f0f9f4;border:1px solid #cce4d8;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px 0;">
                <p style="color:#527a65;font-size:13px;margin:0 0 8px 0;">${matchCount}-Number Match Prize</p>
                <p style="color:#0a7c4d;font-size:32px;font-weight:700;margin:0 0 4px 0;">£${prizeAmount.toFixed(2)}</p>
                <p style="color:#527a65;font-size:12px;margin:0;">Status: Paid</p>
              </div>
              <div style="text-align:center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background:#0a7c4d;color:#ffffff;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">View Dashboard</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f4f8f6;padding:20px 32px;border-top:1px solid #cce4d8;text-align:center;">
              <p style="color:#527a65;font-size:12px;margin:0;">© ${new Date().getFullYear()} Sylva Vault · Golf meets generosity</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>
  `;
}

export function welcomeEmailTemplate({
  userName,
  plan,
}: {
  userName: string;
  plan: "MONTHLY" | "YEARLY";
}): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Welcome to Sylva Vault</title></head>
  <body style="margin:0;padding:0;background:#f4f8f6;font-family:'DM Sans',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8f6;padding:32px 16px;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #cce4d8;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#0a7c4d,#00b4d8);padding:32px;text-align:center;">
              <p style="color:#ffffff;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px 0;">Sylva Vault</p>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;">Welcome to Sylva Vault</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="color:#527a65;font-size:14px;margin:0 0 16px 0;">Hi ${userName},</p>
              <p style="color:#0a1a12;font-size:15px;line-height:1.6;margin:0 0 24px 0;">Your <strong>${plan === "MONTHLY" ? "Monthly" : "Yearly"}</strong> subscription is now active. You are ready to start entering your Stableford scores and competing in the monthly prize draws.</p>
              <div style="background:#f4f8f6;border-radius:12px;padding:20px;margin:0 0 24px 0;">
                <p style="color:#0a7c4d;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px 0;">What to do next</p>
                <p style="color:#0a1a12;font-size:14px;margin:0 0 8px 0;">1. Enter your last 5 Stableford scores on your dashboard</p>
                <p style="color:#0a1a12;font-size:14px;margin:0 0 8px 0;">2. Select a charity to receive your contribution</p>
                <p style="color:#0a1a12;font-size:14px;margin:0;">3. You are automatically entered in the next monthly draw</p>
              </div>
              <div style="text-align:center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background:#0a7c4d;color:#ffffff;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">Go to Dashboard</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f4f8f6;padding:20px 32px;border-top:1px solid #cce4d8;text-align:center;">
              <p style="color:#527a65;font-size:12px;margin:0;">© ${new Date().getFullYear()} Sylva Vault · No hidden fees · Cancel anytime · 10% minimum to charity</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>
  `;
}