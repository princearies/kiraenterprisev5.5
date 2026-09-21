-- KiraEnterprise v5.5 - Seed Data for Demo
-- Run this after all migrations are applied

-- Insert demo users
INSERT INTO users (id, email, name, password_hash, role, is_active) VALUES
('user-001', 'admin@kiraenterprise.my', 'Ahmad bin Ismail', 'demo-password-hash', 'accountant_owner', 1),
('user-002', 'client1@sabahtrading.my', 'Fatimah binti Ali', 'demo-password-hash', 'client_owner', 1),
('user-003', 'staff@kkservices.my', 'Muhammad bin Hassan', 'demo-password-hash', 'client_staff', 1);

-- Insert demo companies
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

-- Grant users access to companies
INSERT INTO user_company_access (id, user_id, company_id, role) VALUES
('access-001', 'user-001', 'company-001', 'accountant_owner'),
('access-002', 'user-001', 'company-002', 'accountant_owner'),
('access-003', 'user-002', 'company-001', 'client_owner'),
('access-004', 'user-003', 'company-002', 'client_staff');

-- Insert Chart of Accounts for company-001
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

-- Insert sample customers
INSERT INTO customers (id, company_id, name, tin, brn, address, state, postcode, country, phone, email, classification_code, is_active) VALUES
('cust-001', 'company-001', 'ABC Enterprise Sdn Bhd', 'C1111111111', '202001001111', 'Lot 1, Jalan Tuaran', 'Sabah', '88100', 'MY', '+6088-111111', 'abc@example.my', '001', 1),
('cust-002', 'company-001', 'XYZ Trading', 'C2222222222', '202101002222', 'No. 22, Mile 5', 'Sabah', '88200', 'MY', '+6088-222222', 'xyz@example.my', '002', 1),
('cust-003', 'company-001', 'Government of Sabah', 'C3333333333', '', 'Wisma Sabah', 'Sabah', '88604', 'MY', '+6088-333333', 'gov@sabah.gov.my', '003', 1);

-- Insert sample suppliers
INSERT INTO suppliers (id, company_id, name, tin, brn, address, state, postcode, country, phone, email, is_active) VALUES
('sup-001', 'company-001', 'Office Supplies Sdn Bhd', 'C4444444444', '201901003333', 'Lot 5, Jalan Lintas', 'Sabah', '88300', 'MY', '+6088-444444', 'supply@example.my', 1),
('sup-002', 'company-001', 'Tech Solutions MY', 'C5555555555', '202001004444', 'Block A, IT Park', 'Sabah', '88400', 'MY', '+6088-555555', 'tech@example.my', 1);

-- Insert sample items
INSERT INTO items (id, company_id, code, name, description, type, unit_price, cost_price, tax_code, classification_code, is_active) VALUES
('item-001', 'company-001', 'SVC-001', 'Consulting Services', 'Business consulting per hour', 'service', 25000, 0, 'SR', '010', 1),
('item-002', 'company-001', 'PRD-001', 'Office Stationery Pack', 'Standard office supply pack', 'product', 15000, 8000, 'SR', '020', 1),
('item-003', 'company-001', 'SVC-002', 'IT Support', 'IT maintenance per visit', 'service', 35000, 0, 'SR', '010', 1);

-- Insert accounting periods
INSERT INTO accounting_periods (id, company_id, year, month, start_date, end_date, status) VALUES
('period-01', 'company-001', 2024, 1, '2024-01-01', '2024-01-31', 'locked'),
('period-02', 'company-001', 2024, 2, '2024-02-01', '2024-02-29', 'locked'),
('period-03', 'company-001', 2024, 3, '2024-03-01', '2024-03-31', 'locked'),
('period-04', 'company-001', 2024, 4, '2024-04-01', '2024-04-30', 'locked'),
('period-05', 'company-001', 2024, 5, '2024-05-01', '2024-05-31', 'open'),
('period-06', 'company-001', 2024, 6, '2024-06-01', '2024-06-30', 'open');

-- Insert sample journal entries
INSERT INTO journal_entries (id, company_id, entry_number, entry_date, description, status, source_document, reference, total_debit, total_credit, period_id, created_by, posted_by, posted_at) VALUES
('je-001', 'company-001', 'JE-001', '2024-01-01', 'Opening balance - Cash', 'posted', 'OB-001', 'Opening', 1550000, 1550000, 'period-01', 'user-001', 'user-001', '2024-01-01'),
('je-002', 'company-001', 'JE-002', '2024-03-15', 'Invoice INV-2024-001', 'posted', 'INV-2024-001', 'Sales', 265000, 265000, 'period-03', 'user-001', 'user-001', '2024-03-15'),
('je-003', 'company-001', 'JE-003', '2024-04-01', 'Rent payment April', 'posted', 'RCPT-001', 'Payment', 300000, 300000, 'period-04', 'user-001', 'user-001', '2024-04-01'),
('je-004', 'company-001', 'JE-004', '2024-05-15', 'Salary payment May', 'posted', 'PAY-005', 'Payroll', 850000, 850000, 'period-05', 'user-001', 'user-001', '2024-05-15'),
('je-005', 'company-001', 'JE-005', '2024-06-10', 'Purchase office supplies', 'draft', '', '', 45000, 45000, 'period-06', 'user-001', NULL, NULL);

-- Insert journal lines
INSERT INTO journal_lines (id, journal_id, account_id, description, debit, credit, currency, exchange_rate) VALUES
('jl-001', 'je-001', 'acc-002', 'Cash on Hand', 50000, 0, 'MYR', 1),
('jl-002', 'je-001', 'acc-003', 'Maybank Account', 1500000, 0, 'MYR', 1),
('jl-003', 'je-001', 'acc-009', 'Share Capital', 0, 1550000, 'MYR', 1),
('jl-004', 'je-002', 'acc-004', 'Accounts Receivable', 265000, 0, 'MYR', 1),
('jl-005', 'je-002', 'acc-012', 'Sales Revenue', 0, 250000, 'MYR', 1),
('jl-006', 'je-002', 'acc-007', 'SST Payable', 0, 15000, 'MYR', 1),
('jl-007', 'je-003', 'acc-016', 'Rent Expense', 300000, 0, 'MYR', 1),
('jl-008', 'je-003', 'acc-003', 'Maybank Account', 0, 300000, 'MYR', 1),
('jl-009', 'je-004', 'acc-018', 'Salary Expense', 850000, 0, 'MYR', 1),
('jl-010', 'je-004', 'acc-003', 'Maybank Account', 0, 850000, 'MYR', 1),
('jl-011', 'je-005', 'acc-017', 'Utilities', 45000, 0, 'MYR', 1),
('jl-012', 'je-005', 'acc-003', 'Maybank Account', 0, 45000, 'MYR', 1);

-- Insert sample invoices
INSERT INTO invoices (id, company_id, type, invoice_number, date, due_date, customer_id, status, subtotal, tax_amount, discount, total, currency, notes, created_by) VALUES
('inv-001', 'company-001', 'invoice', 'INV-2024-001', '2024-03-15', '2024-04-15', 'cust-001', 'issued', 250000, 15000, 0, 265000, 'MYR', 'Consulting services March', 'user-001'),
('inv-002', 'company-001', 'invoice', 'INV-2024-002', '2024-04-01', '2024-05-01', 'cust-002', 'partially_paid', 500000, 30000, 0, 530000, 'MYR', 'IT support contract', 'user-001'),
('inv-003', 'company-001', 'invoice', 'INV-2024-003', '2024-05-10', '2024-06-10', 'cust-003', 'overdue', 120000, 7200, 0, 127200, 'MYR', 'Government project phase 1', 'user-001'),
('inv-004', 'company-001', 'invoice', 'INV-2024-004', '2024-06-01', '2024-07-01', 'cust-001', 'paid', 75000, 4500, 0, 79500, 'MYR', 'Stationery supplies', 'user-001');

-- Insert invoice lines
INSERT INTO invoice_lines (id, invoice_id, item_id, description, quantity, unit_price, discount, tax_code, tax_amount, line_total, classification_code) VALUES
('il-001', 'inv-001', 'item-001', 'Consulting Services - 10 hours', 10, 25000, 0, 'SR', 15000, 265000, '010'),
('il-002', 'inv-002', 'item-003', 'IT Support - Monthly', 1, 500000, 0, 'SR', 30000, 530000, '010'),
('il-003', 'inv-003', 'item-001', 'Consulting - Phase 1', 5, 24000, 0, 'SR', 7200, 127200, '010'),
('il-004', 'inv-004', 'item-002', 'Office Stationery Pack', 5, 15000, 0, 'SR', 4500, 79500, '020');

-- Insert sample e-invoices
INSERT INTO e_invoices (id, company_id, invoice_id, status, supplier_tin, buyer_tin, buyer_name, buyer_brn, buyer_address, buyer_state, buyer_country, invoice_number, invoice_date, total_amount, tax_amount, tax_type, tax_rate, currency, payment_mode, classification_code) VALUES
('ei-001', 'company-001', 'inv-001', 'valid', 'C1234567890', 'C1111111111', 'ABC Enterprise Sdn Bhd', '202001001111', 'Lot 1, Jalan Tuaran, Sabah', '01', 'MY', 'INV-2024-001', '2024-03-15', 265000, 15000, 'SST', 6, 'MYR', 'bank_transfer', '010'),
('ei-002', 'company-001', 'inv-002', 'submitted', 'C1234567890', 'C2222222222', 'XYZ Trading', '202101002222', 'No. 22, Mile 5, Sabah', '01', 'MY', 'INV-2024-002', '2024-04-01', 530000, 30000, 'SST', 6, 'MYR', 'bank_transfer', '010'),
('ei-003', 'company-001', 'inv-003', 'rejected', 'C1234567890', 'C3333333333', 'Government of Sabah', '', 'Wisma Sabah', '01', 'MY', 'INV-2024-003', '2024-05-10', 127200, 7200, 'SST', 6, 'MYR', 'bank_transfer', '010');

-- Insert sample audit logs
INSERT INTO audit_logs (id, company_id, user_id, action, entity_type, entity_id, details, ip_address) VALUES
('al-001', 'company-001', 'user-001', 'login', 'user', 'user-001', 'User logged in', '192.168.1.1'),
('al-002', 'company-001', 'user-001', 'create', 'invoice', 'inv-001', 'Created invoice INV-2024-001', '192.168.1.1'),
('al-003', 'company-001', 'user-001', 'post', 'journal', 'je-002', 'Posted journal JE-002', '192.168.1.1'),
('al-004', 'company-001', 'user-001', 'export', 'report', 'trial-balance', 'Exported trial balance', '192.168.1.1'),
('al-005', 'company-001', 'user-001', 'lock', 'period', 'period-03', 'Locked period March 2024', '192.168.1.1');

-- Insert subscription
INSERT INTO subscriptions (id, company_id, plan_id, status, start_date, renewal_date, billing_cycle, payment_reference) VALUES
('sub-001', 'company-001', 'plan-business', 'active', '2024-01-01', '2025-01-01', 'yearly', 'PAY-REF-DEMO-001');

-- Insert plans
INSERT INTO plans (id, name, description, monthly_price, yearly_price, max_companies, max_users, features, is_active) VALUES
('plan-starter', 'Starter', 'For single companies', 4900, 49000, 1, 3, '["Basic Accounting","Invoicing","Reports"]', 1),
('plan-business', 'Business', 'For growing businesses', 9900, 99000, 5, 10, '["Full Accounting","e-Invoice","Multi-company","Year-End"]', 1),
('plan-enterprise', 'Enterprise', 'For accounting firms', 19900, 199000, 50, 50, '["All Features","Unlimited Companies","Priority Support","API Access"]', 1);
