# Sylva Vault

A subscription-based golf platform combining Stableford score tracking, monthly prize draws,
and charitable giving. Built as a full-stack assignment for Digital Heroes.

---

## Live URL

https://sylva-vault.vercel.app

---

## Test Credentials

### Subscriber Account
- Email: `twin.peaks.s1.1990@gmail.com`
- Password: `abcdefgh`

### Admin Account
- Email: `4nshumankrsingh@gmail.com`
- Password: `abcdefgh`

---

## Role System

| Role       | Access                                                                 |
|------------|------------------------------------------------------------------------|
| PUBLIC     | Homepage, charities directory, draws history                           |
| SUBSCRIBER | Full player dashboard — scores, charity, draws, winnings               |
| ADMIN      | Admin control panel only — users, draws, charities, winners, reports   |

> **Note:** Admins manage the platform and do not participate as players.
> To access the player dashboard and enter draws, an admin must also hold
> an active subscriber account (separate account with SUBSCRIBER role).
> This is by design — admin and player roles are intentionally separated.

---

## Tech Stack

| Layer        | Technology                                      |
|--------------|-------------------------------------------------|
| Framework    | Next.js 16 (App Router) + TypeScript            |
| Database     | Supabase (PostgreSQL) + Prisma ORM              |
| Auth         | Supabase Auth (JWT, HTTPS enforced)             |
| Payments     | Stripe — GBP, Monthly £9.99 / Yearly £99.99    |
| Email        | Resend (test mode — see note below)             |
| Styling      | Tailwind CSS + shadcn/ui + Lucide React         |
| Deployment   | Vercel (new account, new Supabase project)      |

### Theme
Custom light/dark toggle — white-green-blue (light mode) and black-green-blue (dark mode).
Typography: Playfair Display (display) + DM Sans (body).
Logo icon: TreePine from Lucide React.

---

## Email Notifications

Email notifications are integrated via Resend and trigger on:
- Draw results published
- Winner verification status updates
- Payout marked as completed

> Resend is running in **test mode**. Free-tier Resend does not allow custom
> domain verification for publicly deployed apps. In production, a verified
> custom domain would replace the test sender address and enable full delivery.

---

## Features Delivered (PRD Coverage)

### Section 03 — User Roles
- PUBLIC: browse homepage, charities, draws
- SUBSCRIBER: dashboard, scores, charity, draw entries, winnings, proof upload
- ADMIN: full control panel — users, draws, charities, winners, reports
- Admins are platform managers and do not have access to the player dashboard

### Section 04 — Subscription & Payment
- Stripe Checkout for Monthly and Yearly plans (GBP)
- Stripe Customer Portal for self-serve billing management
- Webhook handling: activation, renewal, cancellation, lapsed states
- Real-time subscription status check on every authenticated request
- Role auto-updates: PUBLIC → SUBSCRIBER on activation, back on cancellation

### Section 05 — Score Management
- Rolling last-5 Stableford scores (1–45 range)
- New score auto-replaces oldest when at capacity
- Date recorded per score, displayed reverse chronologically
- Subscribers only — locked with clear upgrade prompt for non-subscribers

### Section 06 & 07 — Draw & Prize Pool
- Random draw and algorithmic draw (weighted by score frequency)
- Simulation mode before official publish
- Jackpot rollover if no 5-match winner
- Prize pool: 40% (5-match), 35% (4-match), 25% (3-match)
- Pool auto-calculated from active subscriber count
- Equal split among multiple winners in same tier

### Section 08 — Charity System
- Charity directory with active listings
- User selects charity at signup or from dashboard
- Minimum 10% contribution of subscription fee
- Adjustable contribution percentage
- Featured charities on homepage

### Section 09 — Winner Verification
- Winners upload proof screenshot (image file, max 5MB)
- Stored in Supabase Storage (winner-proofs bucket)
- Admin reviews and approves or rejects
- Payment states: Pending → Paid
- Email notifications at each step via Resend

### Section 10 — User Dashboard
- Subscription status with renewal date
- Score entry and management interface
- Selected charity and contribution percentage
- Draw participation summary with numbers
- Winnings history with proof upload and status

### Section 11 — Admin Dashboard
- User management: view, edit profiles and scores
- Draw management: configure, simulate, publish
- Charity management: full CRUD with media
- Winners management: verification and payout tracking
- Reports and analytics: stats cards, draw history, top charities

### Section 12 — UI/UX
- Emotion-driven design — leads with charity and purpose
- No golf clichés — clean modern aesthetic
- Subtle animations and micro-interactions throughout
- Prominent subscribe CTA on homepage and dashboard
- Mobile-first, fully responsive

### Section 13 — Technical
- Mobile-first responsive design
- Supabase Auth with middleware-level route protection
- Role-based access control via JWT metadata
- Email notifications: draw results, verification, payment
- Security headers via next.config.mjs
- Optimised images via Next.js Image component
- Prisma + PgBouncer connection pooling configured for Vercel serverless

### Section 15 — Mandatory Deliverables
- Live deployed URL on new Vercel account
- New Supabase project (sylva-vault-prod)
- Test subscriber and admin credentials above
- Environment variables configured in Vercel dashboard
- Clean, structured, commented codebase

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/4nshumankrsingh/Sylva-Vault.git
cd sylva-vault

# 2. Install
npm install

# 3. Environment
cp .env.local.example .env.local
# Fill in all values

# 4. Database
npx prisma db push

# 5. Run
npm run dev
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_APP_URL=
```

---

## Folder Structure

```
sylva-vault/
├── app/
│   ├── (admin)/
│   │   ├── layout.tsx                    # Admin layout with role guard
│   │   └── admin/
│   │       ├── page.tsx                  # Reports and analytics
│   │       ├── users/
│   │       │   └── page.tsx              # User management
│   │       ├── draws/
│   │       │   └── page.tsx              # Draw management
│   │       ├── charities/
│   │       │   └── page.tsx              # Charity management
│   │       └── winners/
│   │           └── page.tsx              # Winners management
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (user)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # User dashboard
│   │   └── subscribe/
│   │       └── page.tsx                  # Subscription plans
│   ├── api/
│   │   ├── draws/
│   │   │   ├── simulate/
│   │   │   │   └── route.ts              # Draw simulation endpoint
│   │   │   └── run/
│   │   │       └── route.ts              # Official draw endpoint
│   │   ├── stripe/
│   │   │   ├── create-checkout/
│   │   │   │   └── route.ts              # Stripe checkout session
│   │   │   ├── create-portal/
│   │   │   │   └── route.ts              # Stripe billing portal
│   │   │   └── webhook/
│   │   │       └── route.ts              # Stripe webhook handler
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts              # Supabase auth callback
│   ├── charities/
│   │   └── page.tsx                      # Public charity directory
│   ├── draws/
│   │   └── page.tsx                      # Public draws history
│   ├── error.tsx                         # Global error boundary
│   ├── loading.tsx                       # Global loading state
│   ├── not-found.tsx                     # 404 page
│   ├── globals.css                       # Tailwind + CSS variables
│   ├── layout.tsx                        # Root layout
│   └── page.tsx                          # Homepage
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── StatsCards.tsx
│   │   ├── RecentDraws.tsx
│   │   ├── TopCharities.tsx
│   │   ├── UserTable.tsx
│   │   ├── EditUserModal.tsx
│   │   ├── ViewScoresModal.tsx
│   │   ├── DrawConfig.tsx
│   │   ├── DrawHistory.tsx
│   │   ├── CharityList.tsx
│   │   ├── CreateCharityButton.tsx
│   │   ├── EditCharityModal.tsx
│   │   ├── WinnersTable.tsx
│   │   └── ViewProofModal.tsx
│   ├── dashboard/
│   │   └── WinningsSection.tsx           # Winnings with proof upload
│   ├── forms/
│   │   ├── ScoreEntryForm.tsx            # Rolling score entry
│   │   └── CharitySelector.tsx           # Charity + contribution picker
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── ThemeToggle.tsx
│   ├── ui/                               # shadcn/ui components
│   └── providers.tsx                     # ThemeProvider wrapper
├── lib/
│   ├── actions/
│   │   ├── admin/
│   │   │   ├── users.ts
│   │   │   ├── draws.ts
│   │   │   ├── charities.ts
│   │   │   └── winners.ts
│   │   ├── notifications.ts
│   │   ├── winners.ts
│   │   ├── scores.ts
│   │   └── charity.ts
│   ├── email/
│   │   └── templates.ts
│   ├── drawEngine.ts
│   ├── prisma.ts
│   ├── resend.ts
│   ├── stripe.ts
│   ├── supabase.ts
│   ├── supabase-server.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── types/
│   └── index.ts
├── middleware.ts
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## PRD Testing Checklist

- [x] User signup and login
- [x] Subscription flow — monthly and yearly
- [x] Score entry with 5-score rolling logic
- [x] Draw system simulation and official publish
- [x] Charity selection and contribution percentage
- [x] Winner verification flow and proof upload
- [x] Payout tracking — Pending to Paid
- [x] User dashboard — all modules functional
- [x] Admin panel — full control and usability
- [x] Data accuracy across all modules
- [x] Responsive design on mobile and desktop
- [x] Error handling and edge cases