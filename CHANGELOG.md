# Changelog

## v5.5.0 (2024)

### Initial Release

#### Core Features
- Multi-tenant cloud accounting application
- Double-entry bookkeeping with journal entries
- Chart of accounts with hierarchical structure
- General ledger and trial balance
- Accounting periods with lock/unlock

#### Invoicing
- Customer and supplier management
- Invoice creation with line items
- Payment allocation
- Credit notes, debit notes, refund notes
- Printable A4 invoice layout

#### Malaysian Compliance
- e-Invoice data preparation module
- Malaysian e-Invoice classification codes
- TIN and SST registration tracking
- SSM number management
- Zakat calculation module (configurable)

#### Reports
- General Journal
- General Ledger
- Trial Balance
- Profit and Loss Statement
- Statement of Financial Position
- All reports printable with signature spaces

#### Year-End
- Pre-closing checks
- Year-end adjustment entries
- Period locking
- Immutable published snapshots
- Export package

#### Security
- Role-based access control (6 roles)
- Company-level data isolation
- Audit logging
- Soft delete for invoices
- No hard deletion of posted transactions

#### Subscription
- Plan management (Starter, Business, Enterprise)
- Mock payment adapter
- Trial period support

#### Technology
- React 18 + TypeScript frontend
- Cloudflare Workers backend
- Cloudflare D1 database
- Cloudflare R2 for document storage
- Tailwind CSS 4 for styling
- Mobile-responsive design

### Known Limitations
- e-Invoice submission uses mock adapter (requires LHDN credentials)
- Payment processing uses mock adapter (requires payment provider)
- PDF export uses browser print functionality
- Real-time collaboration not implemented
- Fixed asset module not yet implemented
