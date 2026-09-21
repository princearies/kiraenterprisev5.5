# Redeployment Instructions

## Current Status

The Worker is deployed but the frontend is not being served because the latest configuration with `[assets]` binding hasn't been deployed yet.

## What Changed

1. ✅ Added `[assets]` configuration to `wrangler.toml`
2. ✅ Updated Worker to serve static assets via `env.ASSETS.fetch()`
3. ✅ Updated API client to use relative URLs in production
4. ✅ Build completed successfully

## Required Action

**You need to redeploy the Worker with the new configuration:**

```bash
# Build the frontend
npm run build

# Deploy to Cloudflare
npx wrangler deploy
```

## What This Will Do

1. Upload the built frontend assets from `./dist` to Cloudflare
2. Deploy the updated Worker code that serves both API and frontend
3. The Worker will now:
   - Serve API requests at `/api/*` and `/health`
   - Serve frontend static files at all other routes (including `/`)

## After Redeployment

Visit: https://kiraenterprisev5-5.mykira.workers.dev/

You should see the KiraEnterprise login screen.

## Initialize Database (If Not Done)

```bash
# Apply all migrations
for file in migrations/*.sql; do
  wrangler d1 execute name --file="$file" --remote
done
```

## Test the Application

1. Open https://kiraenterprisev5-5.mykira.workers.dev/
2. Login with:
   - Email: `admin@kiraenterprise.my`
   - Password: `demo` (any password works in demo mode)
3. You should see the Dashboard

## Troubleshooting

### If frontend still shows "Unauthorized"
- Verify deployment succeeded: `npx wrangler deployments list`
- Check Worker logs: `npx wrangler tail`
- Ensure `dist/` directory exists after `npm run build`

### If you see 404 errors for assets
- Check that `[assets]` section is in `wrangler.toml`
- Verify `directory = "./dist"` is correct
- Ensure build completed successfully

### If API calls fail
- Check browser console for CORS errors
- Verify Worker is responding: `curl https://kiraenterprisev5-5.mykira.workers.dev/health`
- Check Worker logs: `npx wrangler tail`

## Verification Checklist

After redeployment, verify:

- [ ] Frontend loads at root URL
- [ ] Login screen appears
- [ ] Can login with demo credentials
- [ ] Dashboard displays data
- [ ] Can navigate between pages
- [ ] API endpoints respond correctly
- [ ] Health check works: `/health`

## Current Configuration

```toml
name = "kiraenterprisev5-5"
compatibility_date = "2024-01-01"
main = "workers/index.ts"

[assets]
directory = "./dist"
binding = "ASSETS"

[[d1_databases]]
binding = "DB"
database_name = "name"
database_id = "134deb69-2609-4b84-8e5c-079aa8d9ba3a"
```

## Build Output

```
dist/index.html                   0.92 kB
dist/assets/index-PUWohlsm.css   34.21 kB
dist/assets/index-B_Ac6s_2.js     2.90 kB
dist/assets/index-BFjhI9yJ.js   284.68 kB
```

Total: ~322 KB (gzipped: ~74 KB)

---

**Next Step:** Run `npx wrangler deploy` to deploy the updated Worker with frontend assets.
