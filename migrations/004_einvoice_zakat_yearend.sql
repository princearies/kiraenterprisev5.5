-- KiraEnterprise v5.5 - Migration 004: e-Invoice, Zakat, Year-End, Audit, Subscriptions

-- e-Invoices
CREATE TABLE IF NOT EXISTS e_invoices (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(company_id),
  invoice_id TEXT REFERENCES invoices(id),
  status TEXT NOT NULL DEFAULT 'not_ready' CHECK(status IN ('not_ready', 'draft', 'queued', 'submitted', 'valid', 'invalid', 'cancelled', 'rejected')),
  supplier_tin TEXT,
  buyer_tin TEXT,
  buyer_name TEXT,
  buyer_brn TEXT,
  buyer_address TEXT,
  buyer_state TEXT,
  buyer_country TEXT DEFAULT 'MY',
  invoice_number TEXT,
  invoice_date TEXT,
  total_amount INTEGER NOT NULL DEFAULT 0,
  tax_amount INTEGER NOT NULL DEFAULT 0,
  tax_type TEXT,
  tax_rate REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'MYR',
  payment_mode TEXT,
  classification_code TEXT,
  original_invoice_ref TEXT,
  submission_response TEXT,
  validation_id TEXT,
  uuid TEXT,
  cancellation_status TEXT,
  rejection_reason TEXT,
  qr_code TEXT,
  submitted_at TEXT,
  validated_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- e-Invoice events log
CREATE TABLE IF NOT EXISTS e_invoice_events (
  id TEXT PRIMARY KEY,
  e_invoice_id TEXT NOT NULL REFERENCES e_invoices(id),
  event_type TEXT NOT NULL,
  status_before TEXT,
  status_after TEXT,
  details TEXT,
  response_body TEXT,
  created_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Zakat profiles
CREATE TABLE IF NOT EXISTS zakat_profiles (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(company_id),
  name TEXT NOT NULL,
  zakat_year INTEGER NOT NULL,
  calculation_method TEXT NOT NULL,
  nisab INTEGER NOT NULL DEFAULT 0,
  rate REAL NOT NULL DEFAULT 2.5,
  eligible_amount INTEGER NOT NULL DEFAULT 0,
  deductions INTEGER NOT NULL DEFAULT 0,
  manual_adjustments INTEGER NOT NULL DEFAULT 0,
  calculated_amount INTEGER NOT NULL DEFAULT 0,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK(approval_status IN ('pending', 'approved', 'rejected')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid', 'paid', 'partial')),
  receipt_number TEXT,
  notes TEXT,
  created_by TEXT REFERENCES users(id),
  approved_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Zakat calculations (history)
CREATE TABLE IF NOT EXISTS zakat_calculations (
  id TEXT PRIMARY KEY,
  zakat_profile_id TEXT NOT NULL REFERENCES zakat_profiles(id),
  calculation_date TEXT NOT NULL,
  eligible_amount INTEGER NOT NULL,
  deductions INTEGER NOT NULL,
  adjustments INTEGER NOT NULL,
  calculated_amount INTEGER NOT NULL,
  notes TEXT,
  created_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Year-end packages
CREATE TABLE IF NOT EXISTS year_end_packages (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(company_id),
  financial_year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'reviewed', 'published', 'superseded', 'corrected')),
  checks_completed INTEGER NOT NULL DEFAULT 0,
  trial_balance_generated INTEGER NOT NULL DEFAULT 0,
  pnl_generated INTEGER NOT NULL DEFAULT 0,
  balance_sheet_generated INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  published_by TEXT REFERENCES users(id),
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(company_id, financial_year, version)
);

-- Published snapshots (immutable)
CREATE TABLE IF NOT EXISTS published_snapshots (
  id TEXT PRIMARY KEY,
  year_end_package_id TEXT NOT NULL REFERENCES year_end_packages(id),
  snapshot_type TEXT NOT NULL,
  snapshot_data TEXT NOT NULL, -- JSON blob
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(company_id),
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'trial' CHECK(status IN ('trial', 'active', 'past_due', 'cancelled', 'expired')),
  start_date TEXT NOT NULL,
  renewal_date TEXT,
  cancellation_date TEXT,
  trial_end TEXT,
  payment_reference TEXT,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK(billing_cycle IN ('monthly', 'yearly')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Plans
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  monthly_price INTEGER NOT NULL DEFAULT 0,
  yearly_price INTEGER NOT NULL DEFAULT 0,
  max_companies INTEGER NOT NULL DEFAULT 1,
  max_users INTEGER NOT NULL DEFAULT 1,
  features TEXT, -- JSON array
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Billing events
CREATE TABLE IF NOT EXISTS billing_events (
  id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL REFERENCES subscriptions(id),
  event_type TEXT NOT NULL,
  amount INTEGER,
  currency TEXT DEFAULT 'MYR',
  payment_reference TEXT,
  status TEXT,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Attachments
CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(company_id),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  storage_key TEXT NOT NULL, -- R2 key
  uploaded_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES companies(company_id),
  user_id TEXT NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_einvoices_company ON e_invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_einvoices_status ON e_invoices(status);
CREATE INDEX IF NOT EXISTS idx_einvoices_invoice ON e_invoices(invoice_id);
CREATE INDEX IF NOT EXISTS idx_einvoice_events_einvoice ON e_invoice_events(e_invoice_id);
CREATE INDEX IF NOT EXISTS idx_zakat_company ON zakat_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_yearend_company ON year_end_packages(company_id);
CREATE INDEX IF NOT EXISTS idx_yearend_status ON year_end_packages(status);
CREATE INDEX IF NOT EXISTS idx_snapshots_package ON published_snapshots(year_end_package_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_company ON subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_billing_sub ON billing_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_attachments_company ON attachments(company_id);
CREATE INDEX IF NOT EXISTS idx_attachments_entity ON attachments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_company ON audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
