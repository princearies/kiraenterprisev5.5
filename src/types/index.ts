// KiraEnterprise v5.5 - Core Type Definitions

export type UserRole = 'platform_admin' | 'accountant_owner' | 'accountant_staff' | 'client_owner' | 'client_staff' | 'viewer';

export type EntityType = 'sole_proprietor' | 'partnership' | 'private_limited' | 'public_limited' | 'llp' | 'cooperative';

export type CompanyStatus = 'active' | 'inactive' | 'suspended';

export interface Company {
  company_id: string;
  company_code: string;
  legal_name: string;
  trading_name: string;
  entity_type: EntityType;
  ssm_number: string;
  tin: string;
  sst_number: string;
  business_address: string;
  state: string;
  district: string;
  postcode: string;
  phone: string;
  email: string;
  financial_year_end: string;
  base_currency: string;
  status: CompanyStatus;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_id: string | null;
  created_at: string;
}

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface Account {
  id: string;
  company_id: string;
  code: string;
  name: string;
  type: AccountType;
  parent_id: string | null;
  description: string;
  opening_balance: number; // stored in cents
  currency: string;
  is_active: boolean;
  is_bank: boolean;
  created_at: string;
  updated_at: string;
}

export type JournalStatus = 'draft' | 'posted' | 'reversed' | 'voided';

export interface JournalEntry {
  id: string;
  company_id: string;
  entry_number: string;
  entry_date: string;
  description: string;
  status: JournalStatus;
  source_document: string;
  reference: string;
  total_debit: number;
  total_credit: number;
  period_id: string;
  created_by: string;
  posted_by: string | null;
  posted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalLine {
  id: string;
  journal_id: string;
  account_id: string;
  description: string;
  debit: number;
  credit: number;
  currency: string;
  exchange_rate: number;
}

export type AccountingPeriodStatus = 'open' | 'locked' | 'closed';

export interface AccountingPeriod {
  id: string;
  company_id: string;
  year: number;
  month: number;
  start_date: string;
  end_date: string;
  status: AccountingPeriodStatus;
  locked_by: string | null;
  locked_at: string | null;
}

export interface Customer {
  id: string;
  company_id: string;
  name: string;
  tin: string;
  brn: string;
  address: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
  classification_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  company_id: string;
  name: string;
  tin: string;
  brn: string;
  address: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  company_id: string;
  code: string;
  name: string;
  description: string;
  type: 'product' | 'service';
  unit_price: number;
  cost_price: number;
  tax_code: string;
  classification_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type InvoiceStatus = 'draft' | 'issued' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled' | 'voided';
export type InvoiceType = 'invoice' | 'quotation' | 'receipt' | 'credit_note' | 'debit_note' | 'refund_note';

export interface Invoice {
  id: string;
  company_id: string;
  type: InvoiceType;
  invoice_number: string;
  date: string;
  due_date: string;
  customer_id: string;
  status: InvoiceStatus;
  subtotal: number;
  tax_amount: number;
  discount: number;
  total: number;
  currency: string;
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLine {
  id: string;
  invoice_id: string;
  item_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax_code: string;
  tax_amount: number;
  line_total: number;
  classification_code: string;
}

export type EInvoiceStatus = 'not_ready' | 'draft' | 'queued' | 'submitted' | 'valid' | 'invalid' | 'cancelled' | 'rejected';

export interface EInvoice {
  id: string;
  company_id: string;
  invoice_id: string;
  status: EInvoiceStatus;
  supplier_tin: string;
  buyer_tin: string;
  buyer_name: string;
  buyer_brn: string;
  buyer_address: string;
  buyer_state: string;
  buyer_country: string;
  invoice_number: string;
  invoice_date: string;
  total_amount: number;
  tax_amount: number;
  tax_type: string;
  tax_rate: number;
  currency: string;
  payment_mode: string;
  classification_code: string;
  original_invoice_ref: string | null;
  submission_response: string | null;
  validation_id: string | null;
  uuid: string | null;
  cancellation_status: string | null;
  rejection_reason: string | null;
  qr_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface ZakatProfile {
  id: string;
  company_id: string;
  name: string;
  zakat_year: number;
  calculation_method: string;
  nisab: number;
  rate: number;
  eligible_amount: number;
  deductions: number;
  manual_adjustments: number;
  calculated_amount: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  payment_status: 'unpaid' | 'paid' | 'partial';
  receipt_number: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type YearEndStatus = 'draft' | 'reviewed' | 'published' | 'superseded' | 'corrected';

export interface YearEndPackage {
  id: string;
  company_id: string;
  financial_year: number;
  status: YearEndStatus;
  checks_completed: boolean;
  trial_balance_generated: boolean;
  pnl_generated: boolean;
  balance_sheet_generated: boolean;
  published_at: string | null;
  published_by: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  company_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  company_id: string;
  plan_id: string;
  status: 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired';
  start_date: string;
  renewal_date: string;
  cancellation_date: string | null;
  trial_end: string | null;
  payment_reference: string | null;
  billing_cycle: 'monthly' | 'yearly';
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  max_companies: number;
  max_users: number;
  features: string[];
  is_active: boolean;
}

export interface DashboardStats {
  activeCompanies: number;
  currentFinancialYear: string;
  unpaidInvoices: number;
  unpaidBills: number;
  cashBalance: number;
  profitForPeriod: number;
  eInvoiceErrors: number;
  missingDocuments: number;
  yearEndReadiness: number;
  subscriptionStatus: string;
}
