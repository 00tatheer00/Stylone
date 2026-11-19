# STYLONE — Luxury Cosmetics & Beauty E-Commerce

[![STYLONE CI/CD Pipeline](https://github.com/00tatheer00/Stylone/actions/workflows/ci.yml/badge.svg)](https://github.com/00tatheer00/Stylone/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)](https://supabase.com/)

**STYLONE** is an ultra-premium, full-featured cosmetics and beauty e-commerce platform purpose-built for the Pakistani luxury market with prices in PKR (Rs.), dedicated nationwide courier logistics (TCS, Leopards, Call Courier, Trax), Cash on Delivery (COD) and manual bank transfer settlement, row-level locking for inventory concurrency, and an executive administration console.

---

## 💎 Features

- **Storefront & Design System**: High-end editorial beauty aesthetics, responsive mobile-first navigation, fluid micro-interactions, category discovery, and dynamic product filtering.
- **Product Discovery & Catalogue**: Skincare, makeup, haircare, personal care, and luxury accessories with multi-shade variants, rich ingredient breakdowns, benefits, and stock status.
- **Transactional Checkout Engine**:
  - Zero-trust server-side authoritative pricing (tampered client prices discarded).
  - Validation & canonical normalization of Pakistani mobile numbers (`03XXXXXXXXX`).
  - Cash on Delivery (COD) and Manual Bank Transfer (Meezan Bank verification).
  - Nationwide shipping fee tiers (Standard Rs. 250, Free shipping above Rs. 3,500).
- **Atomic Concurrency Protection**: PostgreSQL `FOR UPDATE` row locking during order placement preventing overselling and race conditions.
- **Idempotency**: UUID-backed checkout submission deduplication preventing double-orders.
- **Guest Access Tokens**: Cryptographic token authorization preventing order enumeration (IDOR).
- **Consignment Tracking**: Direct dispatch integration with domestic couriers (TCS Express, Leopards Courier, Trax, Call Courier).
- **Executive Admin Suite**: Full business management covering order lifecycles, COD collection recording, bank verification, stock movement tracking, and consignment booking.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Partial Prerendering)
- **Library**: React 19
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 & Custom Design Tokens
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) & transactional PL/pgSQL RPCs
- **Icons**: Lucide React
- **Validation**: Zod
- **CI/CD**: GitHub Actions

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 20+ or 22+
- npm or yarn

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/00tatheer00/Stylone.git
cd Stylone

# Install dependencies
npm install
```

### 3. Environment Setup

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. Running the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 🧪 Automated Testing & Code Quality

The repository features comprehensive quality gates:

```bash
# Run TypeScript compilation check (0 errors)
npx tsc --noEmit

# Run ESLint quality check (0 warnings, 0 errors)
npm run lint

# Run the Order Engine Automated Test Suite (67 test assertions)
npx tsx scripts/test-order-engine.ts

# Production build test
npm run build
```

---

## 🚢 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs automatically on every `push` and `pull_request` to `main` and `master`:
1. **Lint & Code Quality**: Executes ESLint across all TypeScript components and actions.
2. **Type Safety**: Runs `tsc --noEmit` in strict mode.
3. **Automated Order Engine Suite**: Asserts price calculations, phone number normalization, order state machines, concurrency locks, and IDOR token defenses.
4. **Turbopack Production Build**: Verifies successful compilation and static optimization of all 67 routes.

---

## 📄 License

Proprietary. All rights reserved by STYLONE.
