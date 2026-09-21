# Deployment Fix - R2 Bucket Issue

## Problem
The deployment failed with error:
```
R2 bucket 'kiraenterprise-documents' not found. Verify the bucket exists in your account 
and that the bucket_name in your configuration is correct. [code: 10085]
```

## Root Cause
The `wrangler.toml` configuration referenced an R2 bucket (`kiraenterprise-documents`) that doesn't exist in the Cloudflare account yet.

## Solution Applied

### 1. Fixed Worker Name
Changed `wrangler.toml` to use the correct Worker name that matches the CI system:
```toml
name = "kiraenterprisev5-5"  # Was: "kiraenterprise"
```

### 2. Made R2 Binding Optional
Commented out the R2 bucket binding in `wrangler.toml`:
```toml
# R2 Bucket Binding (uncomment after creating the bucket)
# Run: wrangler r2 bucket create kiraenterprise-documents
# [[r2_buckets]]
# binding = "DOCUMENTS"
# bucket_name = "kiraenterprise-documents"
```

### 3. Updated Worker Interface
Made the `DOCUMENTS` binding optional in `workers/index.ts`:
```typescript
export interface Env {
  DB: D1Database;
  DOCUMENTS?: R2Bucket; // Optional
  // ... other optional bindings
}
```

## Current Status
✅ Build succeeds (1395 modules, 3.23s)
✅ D1 database binding configured correctly
✅ Worker name matches CI expectations
⏸️ R2 bucket binding disabled (can be enabled later)

## Next Steps

### Option 1: Deploy Without R2 (Recommended Now)
The application will work without R2. Document attachments will be disabled until R2 is set up.

**Deploy command:**
```bash
npm run build
npx wrangler deploy
```

### Option 2: Create R2 Bucket First
If you want document attachments to work immediately:

1. **Create the R2 bucket:**
   ```bash
   wrangler r2 bucket create kiraenterprise-documents
   ```

2. **Uncomment R2 binding in wrangler.toml:**
   ```toml
   [[r2_buckets]]
   binding = "DOCUMENTS"
   bucket_name = "kiraenterprise-documents"
   ```

3. **Deploy:**
   ```bash
   npm run build
   npx wrangler deploy
   ```

## Verification After Deployment

After successful deployment, verify:

1. **Worker is running:**
   ```bash
   curl https://kiraenterprisev5-5.<your-subdomain>.workers.dev/health
   ```
   Expected: `{"status":"ok","version":"5.5.0"}`

2. **D1 database is accessible:**
   ```bash
   wrangler d1 execute kiraenterprise-db --command "SELECT COUNT(*) FROM users"
   ```

3. **Frontend loads:**
   Visit: `https://kiraenterprisev5-5.<your-subdomain>.workers.dev`

## Database Setup

If the D1 database is empty, run migrations:

```bash
# Apply all migrations
for file in migrations/*.sql; do
  wrangler d1 execute kiraenterprise-db --file="$file" --remote
done
```

## Environment Variables

Set required secrets (if not already set):
```bash
wrangler secret put AUTH_SECRET
wrangler secret put MYINVOIS_CLIENT_ID
wrangler secret put MYINVOIS_CLIENT_SECRET
```

## Troubleshooting

### If deployment still fails:
1. Check Cloudflare dashboard for the Worker
2. Verify D1 database exists: `wrangler d1 list`
3. Check build logs for TypeScript errors
4. Ensure all dependencies are installed: `npm install`

### If frontend shows blank page:
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check CORS settings in Worker
4. Ensure D1 database has seed data

## Future Enhancements

Once deployed successfully:
1. Create R2 bucket for document storage
2. Set up Cloudflare Pages for frontend (optional)
3. Configure custom domain
4. Set up monitoring and logging
5. Implement backup strategy for D1 database
