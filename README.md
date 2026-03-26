# Sylva Vault

A subscription-based golf platform combining Stableford score tracking, monthly prize draws,
and charitable giving. Built as a full-stack assignment for Digital Heroes.

---

## Live URL

https://sylva-vault.vercel.app

---

## Test Credentials

### Subscriber Account
- Email: `xxxxxsincexx04xx@gmail.com`
- Password: `rsbbxx0x!`

### Admin Account
- Email: `xxxxxsingh_ixx@xxxs.edu`
- Password: `rsbbxx0x`

---

## Tech Stack

| Layer        | Technology                                      |
|--------------|-------------------------------------------------|
| Framework    | Next.js 16 (App Router) + TypeScript            |
| Database     | Supabase (PostgreSQL) + Prisma ORM              |
| Auth         | Supabase Auth (JWT, HTTPS enforced)             |
| Payments     | Stripe — GBP, Monthly £9.99 / Yearly £99.99    |
| Email        | Resend                                          |
| Styling      | Tailwind CSS + shadcn/ui + Lucide React         |
| Deployment   | Vercel (new account, new Supabase project)      |

### Theme
Custom light/dark toggle — white-green-blue (light mode) and black-green-blue (dark mode).
Typography: Playfair Display (display) + DM Sans (body).
Logo icon: TreePine from Lucide React.

---

## Features Delivered (PRD Coverage)

### Section 03 — User Roles
- PUBLIC: browse homepage, charities, draws
- SUBSCRIBER: dashboard, scores, charity, draw entries, winnings, proof upload
- ADMIN: full control panel — users, draws, charities, winners, reports

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
- Subscribers only — locked for non-subscribers

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

> Email notifications are integrated via Resend and configured in test mode.
> In production, a custom verified domain would replace the test sender address.

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
- Email notifications: welcome, draw results, verification, payment
- Security headers via next.config.mjs
- Optimised images via Next.js Image component

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
git clone https://github.com/YOUR_USERNAME/sylva-vault.git
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
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   └── providers.tsx                     # ThemeProvider wrapper
├── lib/
│   ├── actions/
│   │   ├── admin/
│   │   │   ├── users.ts                  # Admin user actions
│   │   │   ├── draws.ts                  # Admin draw actions
│   │   │   ├── charities.ts              # Admin charity actions
│   │   │   └── winners.ts                # Admin winner verify + pay
│   │   ├── notifications.ts              # Resend email actions
│   │   ├── winners.ts                    # User proof upload action
│   │   ├── scores.ts                     # Score CRUD actions
│   │   └── charity.ts                    # Charity selection actions
│   ├── email/
│   │   └── templates.ts                  # HTML email templates
│   ├── drawEngine.ts                     # Draw logic + prize pool
│   ├── prisma.ts                         # Prisma client singleton
│   ├── resend.ts                         # Resend client
│   ├── stripe.ts                         # Stripe client
│   ├── supabase.ts                       # Supabase browser client
│   ├── supabase-server.ts                # Supabase server + service clients
│   └── utils.ts
├── prisma/
│   └── schema.prisma                     # Full database schema
├── types/
│   └── index.ts
├── .env.local                            # Never committed
├── components.json                       # shadcn config
├── middleware.ts                         # Route protection
├── next.config.mjs                       # Security headers + image domains
├── package.json
├── prisma.config.ts
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## PRD Testing Checklist

- User signup and login
- Subscription flow — monthly and yearly
- Score entry with 5-score rolling logic
- Draw system simulation and official publish
- Charity selection and contribution percentage
- Winner verification flow and proof upload
- Payout tracking — Pending to Paid
- User dashboard — all modules functional
- Admin panel — full control and usability
- Data accuracy across all modules
- Responsive design on mobile and desktop
- Error handling and edge cases