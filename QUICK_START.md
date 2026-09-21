# 🚀 Quick Database Setup

The frontend is working! Now let's add demo data to the database.

## Run This Command

Copy and paste this entire command into your terminal:

```bash
wrangler d1 execute name --file=scripts/seed-dummy-data.sql --remote
```

This will add:
- ✅ 3 demo users (admin, client, staff)
- ✅ 2 companies (Sabah Trading, KK Services)
- ✅ Chart of accounts (18 accounts)
- ✅ Sample transactions (journal entries, invoices)
- ✅ Customers and suppliers
- ✅ E-invoice records

## After Running

1. Go to https://kiraenterprisev5-5.mykira.workers.dev/
2. Login with:
   - **Email:** `admin@kiraenterprise.my`
   - **Password:** `demo` (or any password)
3. You should see the dashboard with real data!

## Verify Data Was Added

Run this to check if users exist:

```bash
wrangler d1 execute name --command="SELECT email, name FROM users" --remote
```

You should see:
```
┌──────────────────────────┬────────────────────┐
│ email                    │ name               │
├──────────────────────────┼────────────────────┤
│ admin@kiraenterprise.my  │ Ahmad bin Ismail   │
│ client1@sabahtrading.my  │ Fatimah binti Ali  │
│ staff@kkservices.my      │ Muhammad bin Hassan│
└──────────────────────────┴────────────────────┘
```

## Troubleshooting

**If you get "database not found":**
```bash
wrangler d1 create name
wrangler d1 execute name --file=migrations/001_core_platform.sql --remote
wrangler d1 execute name --file=migrations/002_accounting.sql --remote
wrangler d1 execute name --file=migrations/003_invoicing.sql --remote
wrangler d1 execute name --file=migrations/004_einvoice_zakat_yearend.sql --remote
wrangler d1 execute name --file=scripts/seed-dummy-data.sql --remote
```

**If you get "table already exists":**
The migrations have already run. Just run the seed script:
```bash
wrangler d1 execute name --file=scripts/seed-dummy-data.sql --remote
```

## What You'll See After Login

- 📊 Dashboard with real statistics
- 🏢 2 companies to switch between
- 📈 Chart of accounts with balances
- 📝 Journal entries (posted and draft)
- 🧾 Sample invoices
- 📋 Trial balance report
- And more!

---

**Status:**
- ✅ Frontend deployed and working
- ✅ API deployed and working
- ⏳ Database needs demo data (run the command above)
