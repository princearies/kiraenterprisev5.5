# KiraEnterprise v5.5

**Multi-tenant Cloud Accounting & Invoicing for Malaysian Small Enterprises**

KiraEnterprise v5.5 is a production-ready MVP accounting and invoicing web application designed for Malaysian small enterprises and local accountants in Sabah, Malaysia. Accountants use the system to manage multiple client companies, record transactions, prepare year-end accounts, issue invoices, prepare e-Invoice data, and generate printable reports.

## ⚠️ Important Disclaimer

This system is a **tax-ready accounting aid**. It does **not** automatically guarantee Malaysian tax compliance. All tax rates, e-Invoice rules, LHDN requirements, zakat calculations, account classifications, and reporting formats are **configurable** and must be verified with LHDN, a qualified accountant, or a registered tax agent before submission.

## Features

### Core Accounting
- ✅ Double-entry bookkeeping with debit/credit validation
- ✅ Chart of accounts with hierarchical structure
- ✅ Journal entries with draft/posted/reversed states
- ✅ General ledger with account movements
- ✅ Trial balance with balance verification
- ✅ Accounting periods with lock/unlock controls
- ✅ Opening balances and bank reconciliation fields
- ✅ Integer cents storage (no floating-point for money)

### Invoicing & Contacts
- ✅ Customer and supplier management
- ✅ Products and services with classification codes
- ✅ Invoices, quotations, receipts, credit/debit notes
- ✅ Payment allocation and overdue tracking
- ✅ Sequential invoice numbering (no reuse)
- ✅ Printable A4 invoice layout

### Malaysian e-Invoice
- ✅ e-Invoice data preparation module
- ✅ Buyer TIN, BRN, classification code support
- ✅ Mock adapter for development
- ✅ MyInvois sandbox/production adapter placeholders
- ✅ Status tracking (not_ready → draft → submitted → valid/invalid)
- ✅ QR code / validation link support
- ⚠️ Real submission requires LHDN credentials (Cloudflare Secrets)

### Zakat Module
- ✅ Configurable nisab, rate, and calculation method
- ✅ Eligible amount, deductions, manual adjustments
- ✅ Approval and payment status tracking
- ✅ Printable zakat summary
- ⚠️ Accounting aid only - verify with state zakat authority

### Year-End Workflow
- ✅ Pre-closing checks (unbalanced journals, missing mappings, etc.)
- ✅ Trial balance, P&L, and balance sheet generation
- ✅ Year-end adjustment entries
- ✅ Period locking and financial year lock
- ✅ Immutable published snapshots
- ✅ Export package with all reports

### Reports
- ✅ General Journal
- ✅ General Ledger
- ✅ Trial Balance
- ✅ Profit and Loss Statement
- ✅ Statement of Financial Position (Balance Sheet)
- ✅ All reports with print, CSV export, signature spaces

### Multi-Tenant Security
- ✅ Company-level data isolation
- ✅ Role-based access (6 roles)
- ✅ Server-side authorization checks
- ✅ Audit log for all sensitive actions
- ✅ Soft delete for invoices
- ✅ No hard deletion of posted transactions

### Subscription & Billing
- ✅ Plan management (Starter, Business, Enterprise)
- ✅ Monthly/yearly billing cycles
- ✅ Trial period support
- ✅ Mock payment adapter
- ⚠️ Real payment provider requires configuration

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Tailwind CSS 4 |
| Build | Vite 6 |
| Backend | Cloudflare Workers (TypeScript) |
| Database | Cloudflare D1 (SQLite) |
| Storage | Cloudflare R2 (receipts/documents) |
| Auth | Cloudflare-compatible authentication |
| Deployment | Cloudflare Pages + Workers |

## Project Structure

```
kiraenterprise/
├── src/                    # Frontend React application
│   ├── App.tsx             # Main app with routing
│   ├── components/         # Reusable components
│   ├── context/            # React context providers
│   ├── pages/              # Page components
│   ├── store/              # Mock data store
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── migrations/             # D1 SQL migrations
│   ├── 001_core_platform.sql
│   ├── 002_accounting.sql
│   ├── 003_invoicing.sql
│   ├── 004_einvoice_zakat_yearend.sql
│   └── 005_seed_data.sql
├── workers/                # Cloudflare Workers (API)
├── docs/                   # Documentation
├── wrangler.toml           # Cloudflare configuration
├── .env.example            # Environment variables template
├── .dev.vars.example       # Worker secrets template
└── README.md               # This file
```

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm 9+
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account (for D1 and deployment)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd kiraenterprise

# Install dependencies
npm install

# Copy environment files
cp .env.example .env
cp .dev.vars.example .dev.vars

# Start local development server
npm run dev
```

### Database Setup (Cloudflare D1)

```bash
# Create D1 database
wrangler d1 create kiraenterprise-db

# Update wrangler.toml with your database_id

# Apply migrations locally
wrangler d1 execute kiraenterprise-db --local --file=migrations/001_core_platform.sql
wrangler d1 execute kiraenterprise-db --local --file=migrations/002_accounting.sql
wrangler d1 execute kiraenterprise-db --local --file=migrations/003_invoicing.sql
wrangler d1 execute kiraenterprise-db --local --file=migrations/004_einvoice_zakat_yearend.sql
wrangler d1 execute kiraenterprise-db --local --file=migrations/005_seed_data.sql

# Apply migrations to staging
wrangler d1 execute kiraenterprise-db --remote --env=staging --file=migrations/001_core_platform.sql
# ... repeat for each migration

# Apply migrations to production
wrangler d1 execute kiraenterprise-db --remote --env=production --file=migrations/001_core_platform.sql
# ... repeat for each migration
```

### Build

```bash
npm run build
```

### Testing

```bash
npm run test
npm run typecheck
```

## Deployment

### Staging
```bash
npm run build
wrangler pages deploy dist --env=staging
wrangler deploy --env=staging
```

### Production
```bash
npm run build
wrangler pages deploy dist --env=production
wrangler deploy --env=production
```

## Configuration

### Environment Variables (.env)
```
VITE_API_URL=http://localhost:8787
VITE_APP_NAME=KiraEnterprise
VITE_APP_VERSION=5.5.0
```

### Worker Secrets (.dev.vars)
```
DATABASE_URL=
R2_BUCKET=kiraenterprise-documents
AUTH_SECRET=your-secret-key
MYINVOIS_CLIENT_ID=
MYINVOIS_CLIENT_SECRET=
MYINVOIS_API_URL=
PAYMENT_PROVIDER_KEY=
```

## What is Mocked

| Feature | Status | Notes |
|---------|--------|-------|
| Frontend UI | ✅ Working | Full React SPA with mock data |
| Authentication | ⚠️ Mock | Uses in-memory auth for demo |
| D1 Database | ⚠️ Schema ready | Migrations defined, needs Cloudflare |
| e-Invoice submission | ⚠️ Mock adapter | Requires LHDN credentials |
| Payment processing | ⚠️ Mock adapter | Requires payment provider |
| R2 Storage | ⚠️ Not connected | Schema ready |
| PDF generation | ⚠️ Print-based | Uses browser print to PDF |

## What Requires Credentials

- Cloudflare account (for D1, R2, Workers, Pages)
- LHDN MyInvois credentials (for real e-Invoice submission)
- Payment provider API keys (for real billing)
- Email service credentials (for notifications)

## Demo Credentials

| Email | Role | Notes |
|-------|------|-------|
| admin@kiraenterprise.my | accountant_owner | Full access |
| client1@sabahtrading.my | client_owner | Company-level access |
| staff@kkservices.my | client_staff | Limited access |

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [ACCOUNTING_RULES.md](./ACCOUNTING_RULES.md) - Accounting rules and validation
- [EINVOICE.md](./EINVOICE.md) - e-Invoice module documentation
- [SECURITY.md](./SECURITY.md) - Security model
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [DATABASE.md](./DATABASE.md) - Database schema documentation
- [CHANGELOG.md](./CHANGELOG.md) - Version history

## Platform Owner

Initial platform installation identifier:
```
134deb69-2609-4b84-8e5c-079aa8d9ba3a
```

This is NOT an SSM number, TIN, or government registration number.

## License

Proprietary - All rights reserved.

## Support

For issues and questions, contact the development team.

---

**Built for Malaysian accountants and small enterprises in Sabah, Malaysia.**
