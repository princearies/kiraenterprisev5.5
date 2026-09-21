-- KiraEnterprise v5.5 - Migration 005: Seed Data
-- Demo data for development and testing

-- Seed plans
INSERT INTO plans (id, name, description, monthly_price, yearly_price, max_companies, max_users, features, is_active) VALUES
('plan-starter', 'Starter', 'For single companies', 4900, 49000, 1, 3, '["Basic Accounting","Invoicing","Reports"]', 1),
('plan-business', 'Business', 'For growing businesses', 9900, 99000, 5, 10, '["Full Accounting","e-Invoice","Multi-company","Year-End"]', 1),
('plan-enterprise', 'Enterprise', 'For accounting firms', 19900, 199000, 50, 50, '["All Features","Unlimited Companies","Priority Support","API Access"]', 1);

-- Seed users (password hashes are placeholders - use real bcrypt in production)
INSERT INTO users (id, email, name, password_hash, role) VALUES
('user-001', 'admin@kiraenterprise.my', 'Ahmad bin Ismail', '$2b$12$placeholder_hash_admin', 'accountant_owner'),
('user-002', 'client1@sabahtrading.my', 'Fatimah binti Ali', '$2b$12$placeholder_hash_client1', 'client_owner'),
('user-003', 'staff@kkservices.my', 'Muhammad bin Hassan', '$2b$12$placeholder_hash_staff', 'client_staff');

-- Seed companies
INSERT INTO companies (company_id, company_code, legal_name, trading_name, entity_type, ssm_number, tin, sst_number, business_address, state, district, postcode, phone, email, financial_year_end) VALUES
('company-sabah-trading', 'SB001', 'Sabah Trading Sdn Bhd', 'Sabah Trading', 'private_limited', '202301001234', 'C1234567890', 'W10-1901-32000001', 'Lot 12, Jalan Gaya', 'Sabah', 'Kota Kinabalu', '88000', '+6088-123456', 'info@sabahtrading.my', '2024-12-31'),
('company-kk-services', 'SB002', 'KK Services Enterprise', 'KK Services', 'sole_proprietor', '202301005678', 'C9876543210', '', 'No. 5, Bandar Baru', 'Sabah', 'Sandakan', '90000', '+6089-654321', 'admin@kkservices.my', '2024-06-30');

-- Seed user-company access
INSERT INTO user_company_access (id, user_id, company_id, role) VALUES
('uca-001', 'user-001', 'company-sabah-trading', 'accountant_owner'),
('uca-002', 'user-001', 'company-kk-services', 'accountant_owner'),
('uca-003', 'user-002', 'company-sabah-trading', 'client_owner'),
('uca-004', 'user-003', 'company-kk-services', 'client_staff');

-- Seed subscription
INSERT INTO subscriptions (id, company_id, plan_id, status, start_date, renewal_date, billing_cycle, payment_reference) VALUES
('sub-001', 'company-sabah-trading', 'plan-business', 'active', '2024-01-01', '2025-01-01', 'yearly', 'PAY-REF-DEMO-001');
