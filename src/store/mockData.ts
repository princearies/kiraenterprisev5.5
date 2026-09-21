import { Company, User, Account, Customer, Supplier, Invoice, InvoiceLine, JournalEntry, JournalLine, AccountingPeriod, EInvoice, ZakatProfile, YearEndPackage, AuditLog, Subscription, Plan, DashboardStats, Item } from '../types';
import { v4 as uuidv4 } from 'uuid';

const PLATFORM_ID = '134deb69-2609-4b84-8e5c-079aa8d9ba3a';

// Mock Plans
export const plans: Plan[] = [
  { id: 'plan-starter', name: 'Starter', description: 'For single companies', monthly_price: 4900, yearly_price: 49000, max_companies: 1, max_users: 3, features: ['Basic Accounting', 'Invoicing', 'Reports'], is_active: true },
  { id: 'plan-business', name: 'Business', description: 'For growing businesses', monthly_price: 9900, yearly_price: 99000, max_companies: 5, max_users: 10, features: ['Full Accounting', 'e-Invoice', 'Multi-company', 'Year-End'], is_active: true },
  { id: 'plan-enterprise', name: 'Enterprise', description: 'For accounting firms', monthly_price: 19900, yearly_price: 199000, max_companies: 50, max_users: 50, features: ['All Features', 'Unlimited Companies', 'Priority Support', 'API Access'], is_active: true },
];

// Mock Companies
export const companies: Company[] = [
  {
    company_id: uuidv4(), company_code: 'SB001', legal_name: 'Sabah Trading Sdn Bhd', trading_name: 'Sabah Trading',
    entity_type: 'private_limited', ssm_number: '202301001234', tin: 'C1234567890', sst_number: 'W10-1901-32000001',
    business_address: 'Lot 12, Jalan Gaya', state: 'Sabah', district: 'Kota Kinabalu', postcode: '88000',
    phone: '+6088-123456', email: 'info@sabahtrading.my', financial_year_end: '2024-12-31',
    base_currency: 'MYR', status: 'active', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z'
  },
  {
    company_id: uuidv4(), company_code: 'SB002', legal_name: 'KK Services Enterprise', trading_name: 'KK Services',
    entity_type: 'sole_proprietor', ssm_number: '202301005678', tin: 'C9876543210', sst_number: '',
    business_address: 'No. 5, Bandar Baru', state: 'Sabah', district: 'Sandakan', postcode: '90000',
    phone: '+6089-654321', email: 'admin@kkservices.my', financial_year_end: '2024-06-30',
    base_currency: 'MYR', status: 'active', created_at: '2024-02-15T00:00:00Z', updated_at: '2024-02-15T00:00:00Z'
  }
];

// Mock Users
export const users: User[] = [
  { id: 'user-001', email: 'admin@kiraenterprise.my', name: 'Ahmad bin Ismail', role: 'accountant_owner', company_id: null, created_at: '2024-01-01T00:00:00Z' },
  { id: 'user-002', email: 'client1@sabahtrading.my', name: 'Fatimah binti Ali', role: 'client_owner', company_id: companies[0].company_id, created_at: '2024-01-01T00:00:00Z' },
  { id: 'user-003', email: 'staff@kkservices.my', name: 'Muhammad bin Hassan', role: 'client_staff', company_id: companies[1].company_id, created_at: '2024-02-01T00:00:00Z' },
];

// Chart of Accounts
export const accounts: Account[] = [
  { id: 'acc-001', company_id: companies[0].company_id, code: '1000', name: 'Current Assets', type: 'asset', parent_id: null, description: 'All current assets', opening_balance: 0, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-002', company_id: companies[0].company_id, code: '1010', name: 'Cash on Hand', type: 'asset', parent_id: 'acc-001', description: 'Petty cash', opening_balance: 50000, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-003', company_id: companies[0].company_id, code: '1020', name: 'Bank - Maybank', type: 'asset', parent_id: 'acc-001', description: 'Maybank current account', opening_balance: 1500000, currency: 'MYR', is_active: true, is_bank: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-004', company_id: companies[0].company_id, code: '1100', name: 'Accounts Receivable', type: 'asset', parent_id: 'acc-001', description: 'Trade receivables', opening_balance: 2500000, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-005', company_id: companies[0].company_id, code: '2000', name: 'Current Liabilities', type: 'liability', parent_id: null, description: 'All current liabilities', opening_balance: 0, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-006', company_id: companies[0].company_id, code: '2010', name: 'Accounts Payable', type: 'liability', parent_id: 'acc-005', description: 'Trade payables', opening_balance: 1800000, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-007', company_id: companies[0].company_id, code: '2020', name: 'SST Payable', type: 'liability', parent_id: 'acc-005', description: 'Sales tax payable', opening_balance: 0, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-008', company_id: companies[0].company_id, code: '3000', name: 'Equity', type: 'equity', parent_id: null, description: 'Owner equity', opening_balance: 0, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-009', company_id: companies[0].company_id, code: '3010', name: 'Share Capital', type: 'equity', parent_id: 'acc-008', description: 'Paid-up capital', opening_balance: 5000000, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-010', company_id: companies[0].company_id, code: '3020', name: 'Retained Earnings', type: 'equity', parent_id: 'acc-008', description: 'Accumulated profits', opening_balance: 2000000, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-011', company_id: companies[0].company_id, code: '4000', name: 'Revenue', type: 'revenue', parent_id: null, description: 'All revenue', opening_balance: 0, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-012', company_id: companies[0].company_id, code: '4010', name: 'Sales Revenue', type: 'revenue', parent_id: 'acc-011', description: 'Sales income', opening_balance: 0, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-013', company_id: companies[0].company_id, code: '4020', name: 'Service Revenue', type: 'revenue', parent_id: 'acc-011', description: 'Service income', opening_balance: 0, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-014', company_id: companies[0].company_id, code: '5000', name: 'Expenses', type: 'expense', parent_id: null, description: 'All expenses', opening_balance: 0, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-015', company_id: companies[0].company_id, code: '5010', name: 'Cost of Goods Sold', type: 'expense', parent_id: 'acc-014', description: 'Direct costs', opening_balance: 0, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-016', company_id: companies[0].company_id, code: '5020', name: 'Rent Expense', type: 'expense', parent_id: 'acc-014', description: 'Office rent', opening_balance: 0, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-017', company_id: companies[0].company_id, code: '5030', name: 'Utilities', type: 'expense', parent_id: 'acc-014', description: 'Electricity, water, internet', opening_balance: 0, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'acc-018', company_id: companies[0].company_id, code: '5040', name: 'Salary Expense', type: 'expense', parent_id: 'acc-014', description: 'Staff salaries', opening_balance: 0, currency: 'MYR', is_active: true, is_bank: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
];

// Customers
export const customers: Customer[] = [
  { id: 'cust-001', company_id: companies[0].company_id, name: 'ABC Enterprise Sdn Bhd', tin: 'C1111111111', brn: '202001001111', address: 'Lot 1, Jalan Tuaran', state: 'Sabah', postcode: '88100', country: 'MY', phone: '+6088-111111', email: 'abc@example.my', classification_code: '001', is_active: true, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: 'cust-002', company_id: companies[0].company_id, name: 'XYZ Trading', tin: 'C2222222222', brn: '202101002222', address: 'No. 22, Mile 5', state: 'Sabah', postcode: '88200', country: 'MY', phone: '+6088-222222', email: 'xyz@example.my', classification_code: '002', is_active: true, created_at: '2024-02-01', updated_at: '2024-02-01' },
  { id: 'cust-003', company_id: companies[0].company_id, name: 'Government of Sabah', tin: 'C3333333333', brn: '', address: 'Wisma Sabah', state: 'Sabah', postcode: '88604', country: 'MY', phone: '+6088-333333', email: 'gov@sabah.gov.my', classification_code: '003', is_active: true, created_at: '2024-03-01', updated_at: '2024-03-01' },
];

// Suppliers
export const suppliers: Supplier[] = [
  { id: 'sup-001', company_id: companies[0].company_id, name: 'Office Supplies Sdn Bhd', tin: 'C4444444444', brn: '201901003333', address: 'Lot 5, Jalan Lintas', state: 'Sabah', postcode: '88300', country: 'MY', phone: '+6088-444444', email: 'supply@example.my', is_active: true, created_at: '2024-01-10', updated_at: '2024-01-10' },
  { id: 'sup-002', company_id: companies[0].company_id, name: 'Tech Solutions MY', tin: 'C5555555555', brn: '202001004444', address: 'Block A, IT Park', state: 'Sabah', postcode: '88400', country: 'MY', phone: '+6088-555555', email: 'tech@example.my', is_active: true, created_at: '2024-02-01', updated_at: '2024-02-01' },
];

// Items
export const items: Item[] = [
  { id: 'item-001', company_id: companies[0].company_id, code: 'SVC-001', name: 'Consulting Services', description: 'Business consulting per hour', type: 'service', unit_price: 25000, cost_price: 0, tax_code: 'SR', classification_code: '010', is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'item-002', company_id: companies[0].company_id, code: 'PRD-001', name: 'Office Stationery Pack', description: 'Standard office supply pack', type: 'product', unit_price: 15000, cost_price: 8000, tax_code: 'SR', classification_code: '020', is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'item-003', company_id: companies[0].company_id, code: 'SVC-002', name: 'IT Support', description: 'IT maintenance per visit', type: 'service', unit_price: 35000, cost_price: 0, tax_code: 'SR', classification_code: '010', is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
];

// Invoices
export const invoices: Invoice[] = [
  { id: 'inv-001', company_id: companies[0].company_id, type: 'invoice', invoice_number: 'INV-2024-001', date: '2024-03-15', due_date: '2024-04-15', customer_id: 'cust-001', status: 'issued', subtotal: 250000, tax_amount: 15000, discount: 0, total: 265000, currency: 'MYR', notes: 'Consulting services March', created_by: 'user-001', created_at: '2024-03-15', updated_at: '2024-03-15' },
  { id: 'inv-002', company_id: companies[0].company_id, type: 'invoice', invoice_number: 'INV-2024-002', date: '2024-04-01', due_date: '2024-05-01', customer_id: 'cust-002', status: 'partially_paid', subtotal: 500000, tax_amount: 30000, discount: 0, total: 530000, currency: 'MYR', notes: 'IT support contract', created_by: 'user-001', created_at: '2024-04-01', updated_at: '2024-04-01' },
  { id: 'inv-003', company_id: companies[0].company_id, type: 'invoice', invoice_number: 'INV-2024-003', date: '2024-05-10', due_date: '2024-06-10', customer_id: 'cust-003', status: 'overdue', subtotal: 120000, tax_amount: 7200, discount: 0, total: 127200, currency: 'MYR', notes: 'Government project phase 1', created_by: 'user-001', created_at: '2024-05-10', updated_at: '2024-05-10' },
  { id: 'inv-004', company_id: companies[0].company_id, type: 'invoice', invoice_number: 'INV-2024-004', date: '2024-06-01', due_date: '2024-07-01', customer_id: 'cust-001', status: 'paid', subtotal: 75000, tax_amount: 4500, discount: 0, total: 79500, currency: 'MYR', notes: 'Stationery supplies', created_by: 'user-001', created_at: '2024-06-01', updated_at: '2024-06-20' },
];

export const invoiceLines: InvoiceLine[] = [
  { id: 'il-001', invoice_id: 'inv-001', item_id: 'item-001', description: 'Consulting Services - 10 hours', quantity: 10, unit_price: 25000, discount: 0, tax_code: 'SR', tax_amount: 15000, line_total: 265000, classification_code: '010' },
  { id: 'il-002', invoice_id: 'inv-002', item_id: 'item-003', description: 'IT Support - Monthly', quantity: 1, unit_price: 500000, discount: 0, tax_code: 'SR', tax_amount: 30000, line_total: 530000, classification_code: '010' },
  { id: 'il-003', invoice_id: 'inv-003', item_id: 'item-001', description: 'Consulting - Phase 1', quantity: 5, unit_price: 24000, discount: 0, tax_code: 'SR', tax_amount: 7200, line_total: 127200, classification_code: '010' },
  { id: 'il-004', invoice_id: 'inv-004', item_id: 'item-002', description: 'Office Stationery Pack', quantity: 5, unit_price: 15000, discount: 0, tax_code: 'SR', tax_amount: 4500, line_total: 79500, classification_code: '020' },
];

// Journal Entries
export const journalEntries: JournalEntry[] = [
  { id: 'je-001', company_id: companies[0].company_id, entry_number: 'JE-001', entry_date: '2024-01-01', description: 'Opening balance - Cash', status: 'posted', source_document: 'OB-001', reference: 'Opening', total_debit: 1550000, total_credit: 1550000, period_id: 'period-01', created_by: 'user-001', posted_by: 'user-001', posted_at: '2024-01-01', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'je-002', company_id: companies[0].company_id, entry_number: 'JE-002', entry_date: '2024-03-15', description: 'Invoice INV-2024-001', status: 'posted', source_document: 'INV-2024-001', reference: 'Sales', total_debit: 265000, total_credit: 265000, period_id: 'period-03', created_by: 'user-001', posted_by: 'user-001', posted_at: '2024-03-15', created_at: '2024-03-15', updated_at: '2024-03-15' },
  { id: 'je-003', company_id: companies[0].company_id, entry_number: 'JE-003', entry_date: '2024-04-01', description: 'Rent payment April', status: 'posted', source_document: 'RCPT-001', reference: 'Payment', total_debit: 300000, total_credit: 300000, period_id: 'period-04', created_by: 'user-001', posted_by: 'user-001', posted_at: '2024-04-01', created_at: '2024-04-01', updated_at: '2024-04-01' },
  { id: 'je-004', company_id: companies[0].company_id, entry_number: 'JE-004', entry_date: '2024-05-15', description: 'Salary payment May', status: 'posted', source_document: 'PAY-005', reference: 'Payroll', total_debit: 850000, total_credit: 850000, period_id: 'period-05', created_by: 'user-001', posted_by: 'user-001', posted_at: '2024-05-15', created_at: '2024-05-15', updated_at: '2024-05-15' },
  { id: 'je-005', company_id: companies[0].company_id, entry_number: 'JE-005', entry_date: '2024-06-10', description: 'Purchase office supplies', status: 'draft', source_document: '', reference: '', total_debit: 45000, total_credit: 45000, period_id: 'period-06', created_by: 'user-001', posted_by: null, posted_at: null, created_at: '2024-06-10', updated_at: '2024-06-10' },
];

export const journalLines: JournalLine[] = [
  { id: 'jl-001', journal_id: 'je-001', account_id: 'acc-002', description: 'Cash on Hand', debit: 50000, credit: 0, currency: 'MYR', exchange_rate: 1 },
  { id: 'jl-002', journal_id: 'je-001', account_id: 'acc-003', description: 'Maybank Account', debit: 1500000, credit: 0, currency: 'MYR', exchange_rate: 1 },
  { id: 'jl-003', journal_id: 'je-001', account_id: 'acc-009', description: 'Share Capital', debit: 0, credit: 1550000, currency: 'MYR', exchange_rate: 1 },
  { id: 'jl-004', journal_id: 'je-002', account_id: 'acc-004', description: 'Accounts Receivable', debit: 265000, credit: 0, currency: 'MYR', exchange_rate: 1 },
  { id: 'jl-005', journal_id: 'je-002', account_id: 'acc-012', description: 'Sales Revenue', debit: 0, credit: 250000, currency: 'MYR', exchange_rate: 1 },
  { id: 'jl-006', journal_id: 'je-002', account_id: 'acc-007', description: 'SST Payable', debit: 0, credit: 15000, currency: 'MYR', exchange_rate: 1 },
  { id: 'jl-007', journal_id: 'je-003', account_id: 'acc-016', description: 'Rent Expense', debit: 300000, credit: 0, currency: 'MYR', exchange_rate: 1 },
  { id: 'jl-008', journal_id: 'je-003', account_id: 'acc-003', description: 'Maybank Account', debit: 0, credit: 300000, currency: 'MYR', exchange_rate: 1 },
  { id: 'jl-009', journal_id: 'je-004', account_id: 'acc-018', description: 'Salary Expense', debit: 850000, credit: 0, currency: 'MYR', exchange_rate: 1 },
  { id: 'jl-010', journal_id: 'je-004', account_id: 'acc-003', description: 'Maybank Account', debit: 0, credit: 850000, currency: 'MYR', exchange_rate: 1 },
  { id: 'jl-011', journal_id: 'je-005', account_id: 'acc-017', description: 'Utilities', debit: 45000, credit: 0, currency: 'MYR', exchange_rate: 1 },
  { id: 'jl-012', journal_id: 'je-005', account_id: 'acc-003', description: 'Maybank Account', debit: 0, credit: 45000, currency: 'MYR', exchange_rate: 1 },
];

// Accounting Periods
export const accountingPeriods: AccountingPeriod[] = [
  { id: 'period-01', company_id: companies[0].company_id, year: 2024, month: 1, start_date: '2024-01-01', end_date: '2024-01-31', status: 'locked', locked_by: 'user-001', locked_at: '2024-02-01' },
  { id: 'period-02', company_id: companies[0].company_id, year: 2024, month: 2, start_date: '2024-02-01', end_date: '2024-02-29', status: 'locked', locked_by: 'user-001', locked_at: '2024-03-01' },
  { id: 'period-03', company_id: companies[0].company_id, year: 2024, month: 3, start_date: '2024-03-01', end_date: '2024-03-31', status: 'locked', locked_by: 'user-001', locked_at: '2024-04-01' },
  { id: 'period-04', company_id: companies[0].company_id, year: 2024, month: 4, start_date: '2024-04-01', end_date: '2024-04-30', status: 'locked', locked_by: 'user-001', locked_at: '2024-05-01' },
  { id: 'period-05', company_id: companies[0].company_id, year: 2024, month: 5, start_date: '2024-05-01', end_date: '2024-05-31', status: 'open', locked_by: null, locked_at: null },
  { id: 'period-06', company_id: companies[0].company_id, year: 2024, month: 6, start_date: '2024-06-01', end_date: '2024-06-30', status: 'open', locked_by: null, locked_at: null },
];

// E-Invoices
export const eInvoices: EInvoice[] = [
  { id: 'ei-001', company_id: companies[0].company_id, invoice_id: 'inv-001', status: 'valid', supplier_tin: 'C1234567890', buyer_tin: 'C1111111111', buyer_name: 'ABC Enterprise Sdn Bhd', buyer_brn: '202001001111', buyer_address: 'Lot 1, Jalan Tuaran, Sabah', buyer_state: '01', buyer_country: 'MY', invoice_number: 'INV-2024-001', invoice_date: '2024-03-15', total_amount: 265000, tax_amount: 15000, tax_type: 'SST', tax_rate: 6, currency: 'MYR', payment_mode: 'bank_transfer', classification_code: '010', original_invoice_ref: null, submission_response: '{"uuid":"abc123","timestamp":"2024-03-15T10:30:00Z"}', validation_id: 'VAL-001', uuid: 'uuid-ei-001', cancellation_status: null, rejection_reason: null, qr_code: 'https://myinvois.hasil.gov.my/verify/uuid-ei-001', created_at: '2024-03-15', updated_at: '2024-03-15' },
  { id: 'ei-002', company_id: companies[0].company_id, invoice_id: 'inv-002', status: 'submitted', supplier_tin: 'C1234567890', buyer_tin: 'C2222222222', buyer_name: 'XYZ Trading', buyer_brn: '202101002222', buyer_address: 'No. 22, Mile 5, Sabah', buyer_state: '01', buyer_country: 'MY', invoice_number: 'INV-2024-002', invoice_date: '2024-04-01', total_amount: 530000, tax_amount: 30000, tax_type: 'SST', tax_rate: 6, currency: 'MYR', payment_mode: 'bank_transfer', classification_code: '010', original_invoice_ref: null, submission_response: null, validation_id: null, uuid: null, cancellation_status: null, rejection_reason: null, qr_code: null, created_at: '2024-04-01', updated_at: '2024-04-01' },
  { id: 'ei-003', company_id: companies[0].company_id, invoice_id: 'inv-003', status: 'rejected', supplier_tin: 'C1234567890', buyer_tin: 'C3333333333', buyer_name: 'Government of Sabah', buyer_brn: '', buyer_address: 'Wisma Sabah', buyer_state: '01', buyer_country: 'MY', invoice_number: 'INV-2024-003', invoice_date: '2024-05-10', total_amount: 127200, tax_amount: 7200, tax_type: 'SST', tax_rate: 6, currency: 'MYR', payment_mode: 'bank_transfer', classification_code: '010', original_invoice_ref: null, submission_response: '{"error":"buyer TIN format invalid"}', validation_id: null, uuid: null, cancellation_status: null, rejection_reason: 'Buyer TIN format does not match LHDN requirements', qr_code: null, created_at: '2024-05-10', updated_at: '2024-05-10' },
];

// Zakat
export const zakatProfiles: ZakatProfile[] = [
  { id: 'zak-001', company_id: companies[0].company_id, name: 'Sabah Trading Zakat 2024', zakat_year: 2024, calculation_method: 'business_income', nisab: 3000000, rate: 2.5, eligible_amount: 5000000, deductions: 500000, manual_adjustments: 0, calculated_amount: 112500, approval_status: 'pending', payment_status: 'unpaid', receipt_number: '', notes: 'Subject to review by qualified zakat officer', created_at: '2024-06-01', updated_at: '2024-06-01' },
];

// Year-End Packages
export const yearEndPackages: YearEndPackage[] = [
  { id: 'ye-001', company_id: companies[0].company_id, financial_year: 2023, status: 'published', checks_completed: true, trial_balance_generated: true, pnl_generated: true, balance_sheet_generated: true, published_at: '2024-02-28', published_by: 'user-001', version: 1, created_at: '2024-02-01', updated_at: '2024-02-28' },
  { id: 'ye-002', company_id: companies[0].company_id, financial_year: 2024, status: 'draft', checks_completed: false, trial_balance_generated: false, pnl_generated: false, balance_sheet_generated: false, published_at: null, published_by: null, version: 1, created_at: '2024-06-01', updated_at: '2024-06-01' },
];

// Audit Logs
export const auditLogs: AuditLog[] = [
  { id: 'al-001', company_id: companies[0].company_id, user_id: 'user-001', action: 'login', entity_type: 'user', entity_id: 'user-001', details: 'User logged in', ip_address: '192.168.1.1', created_at: '2024-06-15T09:00:00Z' },
  { id: 'al-002', company_id: companies[0].company_id, user_id: 'user-001', action: 'create', entity_type: 'invoice', entity_id: 'inv-001', details: 'Created invoice INV-2024-001', ip_address: '192.168.1.1', created_at: '2024-03-15T10:30:00Z' },
  { id: 'al-003', company_id: companies[0].company_id, user_id: 'user-001', action: 'post', entity_type: 'journal', entity_id: 'je-002', details: 'Posted journal JE-002', ip_address: '192.168.1.1', created_at: '2024-03-15T10:35:00Z' },
  { id: 'al-004', company_id: companies[0].company_id, user_id: 'user-001', action: 'export', entity_type: 'report', entity_id: 'trial-balance', details: 'Exported trial balance', ip_address: '192.168.1.1', created_at: '2024-06-01T14:00:00Z' },
  { id: 'al-005', company_id: companies[0].company_id, user_id: 'user-001', action: 'lock', entity_type: 'period', entity_id: 'period-03', details: 'Locked period March 2024', ip_address: '192.168.1.1', created_at: '2024-04-01T09:00:00Z' },
];

// Subscriptions
export const subscriptions: Subscription[] = [
  { id: 'sub-001', company_id: companies[0].company_id, plan_id: 'plan-business', status: 'active', start_date: '2024-01-01', renewal_date: '2025-01-01', cancellation_date: null, trial_end: null, payment_reference: 'PAY-REF-001', billing_cycle: 'yearly', created_at: '2024-01-01', updated_at: '2024-01-01' },
];

// Dashboard Stats
export const dashboardStats: DashboardStats = {
  activeCompanies: 2,
  currentFinancialYear: '2024',
  unpaidInvoices: 924400,
  unpaidBills: 450000,
  cashBalance: 1205000,
  profitForPeriod: 350000,
  eInvoiceErrors: 1,
  missingDocuments: 3,
  yearEndReadiness: 65,
  subscriptionStatus: 'Active - Business Plan',
};

export { PLATFORM_ID };
