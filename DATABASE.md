# Database Documentation

## Overview

KiraEnterprise uses Cloudflare D1 (SQLite) as its primary database. All schema changes are managed through numbered migration files.

## Tables Summary

### Core Platform
| Table | Purpose |
|-------|---------|
| users | User accounts with authentication |
| roles | Role definitions |
| permissions | Role-permission mappings |
| companies | Tenant company records |
| user_company_access | Multi-tenant access grants |

### Accounting
| Table | Purpose |
|-------|---------|
| accounting_periods | Monthly accounting periods |
| chart_of_accounts | Account definitions |
| journal_entries | Transaction headers |
| journal_lines | Transaction line items |

### Invoicing
| Table | Purpose |
|-------|---------|
| customers | Customer records |
| suppliers | Supplier records |
| items | Products and services |
| invoices | Invoice headers |
| invoice_lines | Invoice line items |
| payments | Payment records |
| payment_allocations | Payment-to-invoice mapping |
| tax_codes | Configurable tax rates |

### e-Invoice
| Table | Purpose |
|-------|---------|
| e_invoices | e-Invoice records and status |
| e_invoice_events | e-Invoice submission history |

### Zakat
| Table | Purpose |
|-------|---------|
| zakat_profiles | Zakat calculation profiles |
| zakat_calculations | Calculation history |

### Year-End
| Table | Purpose |
|-------|---------|
| year_end_packages | Year-end workflow state |
| published_snapshots | Immutable report snapshots |

### Billing
| Table | Purpose |
|-------|---------|
| plans | Subscription plan definitions |
| subscriptions | Active subscriptions |
| billing_events | Payment history |

### Supporting
| Table | Purpose |
|-------|---------|
| attachments | File upload metadata |
| audit_logs | System audit trail |

## Design Principles

1. **Every tenant table has company_id** - Ensures data isolation
2. **Integer cents for money** - No floating-point precision issues
3. **Prepared statements** - SQL injection prevention
4. **Soft delete where appropriate** - Preserve audit trail
5. **created_at/updated_at on all tables** - Track changes
6. **created_by/updated_by where useful** - Attribution
7. **Foreign keys with cascading rules** - Data integrity
8. **Indexes on query patterns** - Performance

## Migration Convention

Files are named: `NNN_description.sql`
- Applied in numerical order
- Each migration is idempotent (uses IF NOT EXISTS)
- Never modify an applied migration
- Create new migrations for changes
