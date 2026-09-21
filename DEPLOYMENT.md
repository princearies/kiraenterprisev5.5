# Deployment Guide

## Prerequisites

1. Cloudflare account with Workers Paid plan
2. Wrangler CLI installed (`npm install -g wrangler`)
3. Node.js 18+ and npm 9+

## Environment Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd kiraenterprise
npm install
```

### 2. Configure Wrangler

Update `wrangler.toml` with your Cloudflare account details.

### 3. Create D1 Database

```bash
# Staging
wrangler d1 create kiraenterprise-db-staging

# Production
wrangler d1 create kiraenterprise-db-production
```

Update the database IDs in `wrangler.toml`.

### 4. Apply Migrations

```bash
# Local development
for f in migrations/*.sql; do
  wrangler d1 execute kiraenterprise-db --local --file="$f"
done

# Staging
for f in migrations/*.sql; do
  wrangler d1 execute kiraenterprise-db-staging --remote --file="$f"
done

# Production
for f in migrations/*.sql; do
  wrangler d1 execute kiraenterprise-db-production --remote --file="$f"
done
```

### 5. Set Secrets

```bash
# Staging
wrangler secret put AUTH_SECRET --env=staging
wrangler secret put MYINVOIS_CLIENT_ID --env=staging
wrangler secret put MYINVOIS_CLIENT_SECRET --env=staging

# Production
wrangler secret put AUTH_SECRET --env=production
wrangler secret put MYINVOIS_CLIENT_ID --env=production
wrangler secret put MYINVOIS_CLIENT_SECRET --env=production
```

### 6. Create R2 Bucket

```bash
wrangler r2 bucket create kiraenterprise-documents-staging
wrangler r2 bucket create kiraenterprise-documents-production
```

## Deploy

### Staging

```bash
npm run build
wrangler pages deploy dist --env=staging
wrangler deploy --env=staging
```

### Production

```bash
npm run build
wrangler pages deploy dist --env=production
wrangler deploy --env=production
```

## Backup

### D1 Database Backup

```bash
# Export staging
wrangler d1 export kiraenterprise-db-staging --remote --output=backup-staging.sql

# Export production
wrangler d1 export kiraenterprise-db-production --remote --output=backup-production.sql
```

### R2 Backup

Use Cloudflare dashboard or rclone to backup R2 bucket contents.

## Monitoring

- Check Worker logs: `wrangler tail --env=production`
- D1 usage: Cloudflare Dashboard → D1
- R2 usage: Cloudflare Dashboard → R2
- Pages deployments: Cloudflare Dashboard → Pages

## Rollback

```bash
# Rollback Pages to previous deployment
wrangler pages deployment rollback --env=production

# Rollback Worker
wrangler deployments rollback --env=production
```

## Health Checks

After deployment, verify:
1. Frontend loads correctly
2. Login works
3. Can create/view companies
4. Can post journal entries
5. Reports generate correctly
6. Audit log records actions
