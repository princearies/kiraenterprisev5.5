# Security Model

## Authentication

- Password hashing using bcrypt (or compatible provider)
- Session tokens with expiry
- HttpOnly cookies for token storage
- CSRF protection on state-changing operations
- Rate limiting on authentication endpoints (5 attempts per minute)

## Authorization

### Roles

| Role | Description |
|------|-------------|
| platform_admin | Full system access |
| accountant_owner | Owns accounting practice, manages all client companies |
| accountant_staff | Works under accountant_owner, limited admin |
| client_owner | Owns a client company, full access to their company |
| client_staff | Works for a client company, limited access |
| viewer | Read-only access |

### Permission Matrix

| Action | platform_admin | accountant_owner | accountant_staff | client_owner | client_staff | viewer |
|--------|:-:|:-:|:-:|:-:|:-:|:-:|
| Manage companies | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Manage users | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Post journals | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Lock periods | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Publish year-end | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| View reports | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Export data | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Manage settings | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |

## Multi-Tenant Isolation

- Every database query includes `WHERE company_id = ?`
- Server-side middleware validates company access before every operation
- Users can only access companies they are explicitly granted access to
- No API endpoint returns data from unauthorized companies

## Data Protection

- Soft delete for invoices (preserves audit trail)
- No hard deletion of posted accounting transactions
- All deletions logged in audit trail
- Reversal entries for corrections (never silent edits)
- Published snapshots are immutable

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Login | 5 per minute per IP |
| API (authenticated) | 100 per minute per user |
| Export/Print | 20 per minute per user |
| e-Invoice submit | 10 per minute per company |

## Input Validation

- Client-side validation for UX
- Server-side validation for security (always)
- SQL injection prevention via prepared statements
- XSS prevention via React's default escaping
- File upload validation (type, size)

## Secrets Management

- All credentials stored in Cloudflare Secrets
- Never committed to source code
- Never included in client-side bundle
- Rotated regularly
- Different secrets per environment

## Audit Trail

Every sensitive action is logged:
- Login/logout
- Create, edit, delete operations
- Journal posting
- Period locking/unlocking
- Report export/printing
- e-Invoice submission
- Year-end publication
- User management changes
