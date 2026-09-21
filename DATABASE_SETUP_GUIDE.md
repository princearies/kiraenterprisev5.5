# 📊 How to Add Data to Your D1 Database

Your database is at: https://dash.cloudflare.com/2c48feaf73f0023e94ead812fcb5f01e/workers/d1/databases/134deb69-2609-4b84-8e5c-079aa8d9ba3a/metrics

## Method 1: Using Wrangler CLI (Recommended)

### Step 1: Install Wrangler (if not already installed)
```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare
```bash
wrangler login
```

### Step 3: Run the Seed Script
```bash
wrangler d1 execute name --file=scripts/seed-dummy-data.sql --remote
```

This will add all demo data in one command.

### Step 4: Verify Data
```bash
wrangler d1 execute name --command="SELECT email, name, role FROM users" --remote
```

---

## Method 2: Using Cloudflare Dashboard (Web UI)

### Step 1: Open D1 Console
1. Go to your database: https://dash.cloudflare.com/2c48feaf73f0023e94ead812fcb5f01e/workers/d1/databases/134deb69-2609-4b84-8e5c-079aa8d9ba3a

2. Click on **"Console"** tab

### Step 2: Run SQL Commands

Copy and paste these SQL commands one by one:

#### Create Users
```sql
INSERT INTO users (id, email, name, password_hash, role, is_active) VALUES
('user-001', 'admin@kiraenterprise.my', 'Ahmad bin Ismail', 'demo-password-hash', 'accountant_owner', 1),
('user-002', 'client1@sabahtrading.my', 'Fatimah binti Ali', 'demo-password-hash', 'client_owner', 1),
('user-003', 'staff@kkservices.my', 'Muhammad bin Hassan', 'demo-password-hash', 'client_staff', 1);
```

#### Create Companies
```sql
INSERT INTO companies (
  company_id, company_code, legal_name, trading_name, entity_type,
  ssm_number, tin, sst_number, business_address, state, district, postcode,
  phone, email, financial_year_end, base_currency, status
) VALUES
(
  'company-001', 'SB001', 'Sabah Trading Sdn Bhd', 'Sabah Trading', 'private_limited',
  '202301001234', 'C1234567890', 'W10-1901-32000001',
  'Lot 12, Jalan Gaya', 'Sabah', 'Kota Kinabalu', '88000',
  '+6088-123456', 'info@sabahtrading.my', '2024-12-31', 'MYR', 'active'
),
(
  'company-002', 'SB002', 'KK Services Enterprise', 'KK Services', 'sole_proprietor',
  '202301005678', 'C9876543210', '',
  'No. 5, Bandar Baru', 'Sabah', 'Sandakan', '90000',
  '+6089-654321', 'admin@kkservices.my', '2024-06-30', 'MYR', 'active'
);
```

#### Grant User Access
```sql
INSERT INTO user_company_access (id, user_id, company_id, role) VALUES
('access-001', 'user-001', 'company-001', 'accountant_owner'),
('access-002', 'user-001', 'company-002', 'accountant_owner'),
('access-003', 'user-002', 'company-001', 'client_owner'),
('access-004', 'user-003', 'company-002', 'client_staff');
```

#### Create Chart of Accounts
```sql
INSERT INTO chart_of_accounts (id, company_id, code, name, type, parent_id, description, opening_balance, currency, is_active, is_bank) VALUES
('acc-001', 'company-001', '1000', 'Current Assets', 'asset', NULL, 'All current assets', 0, 'MYR', 1, 0),
('acc-002', 'company-001', '1010', 'Cash on Hand', 'asset', 'acc-001', 'Petty cash', 50000, 'MYR', 1, 0),
('acc-003', 'company-001', '1020', 'Bank - Maybank', 'asset', 'acc-001', 'Maybank current account', 1500000, 'MYR', 1, 1),
('acc-004', 'company-001', '1100', 'Accounts Receivable', 'asset', 'acc-001', 'Trade receivables', 2500000, 'MYR', 1, 0),
('acc-005', 'company-001', '2000', 'Current Liabilities', 'liability', NULL, 'All current liabilities', 0, 'MYR', 1, 0),
('acc-006', 'company-001', '2010', 'Accounts Payable', 'liability', 'acc-005', 'Trade payables', 1800000, 'MYR', 1, 0),
('acc-007', 'company-001', '2020', 'SST Payable', 'liability', 'acc-005', 'Sales tax payable', 0, 'MYR', 1, 0),
('acc-008', 'company-001', '3000', 'Equity', 'equity', NULL, 'Owner equity', 0, 'MYR', 1, 0),
('acc-009', 'company-001', '3010', 'Share Capital', 'equity', 'acc-008', 'Paid-up capital', 5000000, 'MYR', 1, 0),
('acc-010', 'company-001', '3020', 'Retained Earnings', 'equity', 'acc-008', 'Accumulated profits', 2000000, 'MYR', 1, 0),
('acc-011', 'company-001', '4000', 'Revenue', 'revenue', NULL, 'All revenue', 0, 'MYR', 1, 0),
('acc-012', 'company-001', '4010', 'Sales Revenue', 'revenue', 'acc-011', 'Sales income', 0, 'MYR', 1, 0),
('acc-013', 'company-001', '4020', 'Service Revenue', 'revenue', 'acc-011', 'Service income', 0, 'MYR', 1, 0),
('acc-014', 'company-001', '5000', 'Expenses', 'expense', NULL, 'All expenses', 0, 'MYR', 1, 0),
('acc-015', 'company-001', '5010', 'Cost of Goods Sold', 'expense', 'acc-014', 'Direct costs', 0, 'MYR', 1, 0),
('acc-016', 'company-001', '5020', 'Rent Expense', 'expense', 'acc-014', 'Office rent', 0, 'MYR', 1, 0),
('acc-017', 'company-001', '5030', 'Utilities', 'expense', 'acc-014', 'Electricity, water, internet', 0, 'MYR', 1, 0),
('acc-018', 'company-001', '5040', 'Salary Expense', 'expense', 'acc-014', 'Staff salaries', 0, 'MYR', 1, 0);
```

### Step 3: Verify
Run this query in the console:
```sql
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_companies FROM companies;
SELECT COUNT(*) as total_accounts FROM chart_of_accounts;
```

---

## Method 3: Using Cloudflare API

If you prefer using curl:

```bash
# Set your API token
export CF_API_TOKEN="your-api-token-here"
export ACCOUNT_ID="2c48feaf73f0023e94ead812fcb5f01e"
export DATABASE_ID="134deb69-2609-4b84-8e5c-079aa8d9ba3a"

# Execute SQL
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/d1/database/$DATABASE_ID/query" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"sql": "INSERT INTO users (id, email, name, password_hash, role, is_active) VALUES ('"'"'user-001'"'"', '"'"'admin@kiraenterprise.my'"'"', '"'"'Ahmad bin Ismail'"'"', '"'"'demo'"'"', '"'"'accountant_owner'"'"', 1)"}'
```

---

## ✅ Verify Everything Works

After adding data, test the login:

1. Visit: https://kiraenterprisev5-5.mykira.workers.dev/
2. Login with:
   - Email: `admin@kiraenterprise.my`
   - Password: `demo`

3. You should see the dashboard!

---

## 🔍 Quick Check Commands

```bash
# Check if users exist
wrangler d1 execute name --command="SELECT email FROM users" --remote

# Check if companies exist
wrangler d1 execute name --command="SELECT company_code, trading_name FROM companies" --remote

# Check chart of accounts
wrangler d1 execute name --command="SELECT code, name, type FROM chart_of_accounts LIMIT 5" --remote

# Check journal entries
wrangler d1 execute name --command="SELECT entry_number, description, status FROM journal_entries" --remote
```

---

## 🎯 What Data Will Be Added

After running the seed script, you'll have:

### Users (3)
- admin@kiraenterprise.my (Accountant Owner)
- client1@sabahtrading.my (Client Owner)
- staff@kkservices.my (Client Staff)

### Companies (2)
- Sabah Trading Sdn Bhd (SB001)
- KK Services Enterprise (SB002)

### Chart of Accounts (18)
- Assets: Cash, Bank, Accounts Receivable
- Liabilities: Accounts Payable, SST Payable
- Equity: Share Capital, Retained Earnings
- Revenue: Sales, Service Revenue
- Expenses: COGS, Rent, Utilities, Salary

### Transactions
- 5 journal entries (4 posted, 1 draft)
- 4 invoices (various statuses)
- 3 e-invoices (valid, submitted, rejected)

### Other
- 3 customers
- 2 suppliers
- 3 products/services
- 6 accounting periods
- Audit logs
- Subscription data

---

## 🚀 Fast Track (One Command)

If you have wrangler installed and logged in:

```bash
wrangler d1 execute name --file=scripts/seed-dummy-data.sql --remote
```

That's it! You're done. Now login and start using the app.
