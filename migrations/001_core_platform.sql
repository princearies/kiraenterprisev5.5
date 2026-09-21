-- KiraEnterprise v5.5 - Migration 001: Core Platform Tables
-- Platform owner UUID: 134deb69-2609-4b84-8e5c-079aa8d9ba3a

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('platform_admin', 'accountant_owner', 'accountant_staff', 'client_owner', 'client_staff', 'viewer')),
  platform_id TEXT NOT NULL DEFAULT '134deb69-2609-4b84-8e5c-079aa8d9ba3a',
  is_active INTEGER NOT NULL DEFAULT 1,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Roles and permissions
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  role_id TEXT NOT NULL REFERENCES roles(id),
  resource TEXT NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('create', 'read', 'update', 'delete', 'export', 'print', 'approve', 'post', 'lock')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(role_id, resource, action)
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  company_id TEXT PRIMARY KEY,
  company_code TEXT UNIQUE NOT NULL,
  legal_name TEXT NOT NULL,
  trading_name TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK(entity_type IN ('sole_proprietor', 'partnership', 'private_limited', 'public_limited', 'llp', 'cooperative')),
  ssm_number TEXT,
  tin TEXT,
  sst_number TEXT,
  business_address TEXT,
  state TEXT,
  district TEXT,
  postcode TEXT,
  phone TEXT,
  email TEXT,
  financial_year_end TEXT NOT NULL,
  base_currency TEXT NOT NULL DEFAULT 'MYR',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kuala_Lumpur',
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
  platform_id TEXT NOT NULL DEFAULT '134deb69-2609-4b84-8e5c-079aa8d9ba3a',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- User-Company access (multi-tenant)
CREATE TABLE IF NOT EXISTS user_company_access (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  company_id TEXT NOT NULL REFERENCES companies(company_id),
  role TEXT NOT NULL,
  granted_by TEXT REFERENCES users(id),
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, company_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_platform ON users(platform_id);
CREATE INDEX IF NOT EXISTS idx_companies_platform ON companies(platform_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_user_company_user ON user_company_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_company_company ON user_company_access(company_id);
