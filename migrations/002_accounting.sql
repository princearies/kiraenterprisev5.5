-- KiraEnterprise v5.5 - Migration 002: Accounting Tables

-- Accounting periods
CREATE TABLE IF NOT EXISTS accounting_periods (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(company_id),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'locked', 'closed')),
  locked_by TEXT REFERENCES users(id),
  locked_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(company_id, year, month)
);

-- Chart of accounts
CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(company_id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  parent_id TEXT REFERENCES chart_of_accounts(id),
  description TEXT,
  opening_balance INTEGER NOT NULL DEFAULT 0, -- stored in cents
  currency TEXT NOT NULL DEFAULT 'MYR',
  is_active INTEGER NOT NULL DEFAULT 1,
  is_bank INTEGER NOT NULL DEFAULT 0,
  is_system INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(company_id, code)
);

-- Journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(company_id),
  entry_number TEXT NOT NULL,
  entry_date TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'posted', 'reversed', 'voided')),
  source_document TEXT,
  reference TEXT,
  total_debit INTEGER NOT NULL DEFAULT 0,
  total_credit INTEGER NOT NULL DEFAULT 0,
  period_id TEXT REFERENCES accounting_periods(id),
  reversal_of TEXT REFERENCES journal_entries(id),
  created_by TEXT NOT NULL REFERENCES users(id),
  posted_by TEXT REFERENCES users(id),
  posted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(company_id, entry_number)
);

-- Journal lines
CREATE TABLE IF NOT EXISTS journal_lines (
  id TEXT PRIMARY KEY,
  journal_id TEXT NOT NULL REFERENCES journal_entries(id),
  account_id TEXT NOT NULL REFERENCES chart_of_accounts(id),
  description TEXT,
  debit INTEGER NOT NULL DEFAULT 0,
  credit INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'MYR',
  exchange_rate REAL NOT NULL DEFAULT 1.0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_periods_company ON accounting_periods(company_id);
CREATE INDEX IF NOT EXISTS idx_periods_status ON accounting_periods(status);
CREATE INDEX IF NOT EXISTS idx_accounts_company ON chart_of_accounts(company_id);
CREATE INDEX IF NOT EXISTS idx_accounts_type ON chart_of_accounts(type);
CREATE INDEX IF NOT EXISTS idx_accounts_parent ON chart_of_accounts(parent_id);
CREATE INDEX IF NOT EXISTS idx_journal_company ON journal_entries(company_id);
CREATE INDEX IF NOT EXISTS idx_journal_status ON journal_entries(status);
CREATE INDEX IF NOT EXISTS idx_journal_date ON journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_journal_period ON journal_entries(period_id);
CREATE INDEX IF NOT EXISTS idx_journal_lines_journal ON journal_lines(journal_id);
CREATE INDEX IF NOT EXISTS idx_journal_lines_account ON journal_lines(account_id);
