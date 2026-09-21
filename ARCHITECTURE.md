# KiraEnterprise v5.5 - Architecture

## System Overview

KiraEnterprise v5.5 follows a modern serverless architecture deployed on Cloudflare's edge network.

```
┌─────────────────────────────────────────────────────┐
│                   Cloudflare Pages                   │
│              (React SPA - Static Assets)             │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│                Cloudflare Workers                     │
│              (API / Backend Logic)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   Auth   │  │  Routes  │  │  Middleware       │  │
│  │  Module  │  │  Handler │  │  (Rate Limit,     │  │
│  │          │  │          │  │   CSRF, Validate) │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└───────┬──────────────┬──────────────┬───────────────┘
        │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │  D1 DB  │   │  R2     │   │ Secrets │
   │(SQLite) │   │(Storage)│   │ (Keys)  │
   └─────────┘   └─────────┘   └─────────┘
```

## Multi-Tenant Architecture

- Each company record is isolated by `company_id`
- Every tenant-owned table includes `company_id` as a column
- All API queries filter by `company_id` from the authenticated user's access
- Server-side middleware enforces authorization on every endpoint
- No cross-tenant data access is possible without explicit authorization

## Authentication Flow

1. User submits credentials
2. Worker validates against hashed password in D1
3. Session token (JWT) issued with user_id, role, and company_access
4. Frontend stores token in httpOnly cookie
5. Each API request validates token and checks role permissions
6. Rate limiting applied to auth endpoints

## Data Flow

1. Frontend sends API request with auth token
2. Worker middleware validates token, checks rate limits
3. Route handler validates input, checks permissions
4. Business logic executes with prepared SQL statements
5. Audit log entry created for sensitive operations
6. Response returned to frontend

## Environment Separation

| Environment | Database | Workers | Pages |
|-------------|----------|---------|-------|
| Local | D1 local file | `wrangler dev` | `vite dev` |
| Staging | D1 staging | staging worker | staging pages |
| Production | D1 production | production worker | production pages |

## Key Design Decisions

1. **Integer cents for money** - Avoids floating-point precision issues
2. **Prepared statements** - Prevents SQL injection
3. **Migration-based schema** - Trackable, reversible database changes
4. **Soft delete** - Preserves audit trail for accounting data
5. **Immutable posted entries** - Corrections via reversal entries only
6. **Configurable tax/zakat** - No hard-coded regulatory values
7. **Adapter pattern** - e-Invoice and payment providers are swappable
