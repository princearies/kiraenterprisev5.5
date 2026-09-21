/**
 * KiraEnterprise v5.5 - Cloudflare Worker API
 * 
 * This is the backend API entry point for Cloudflare Workers.
 * It handles all API requests, authentication, and database operations.
 * 
 * Bindings required (configured in wrangler.toml):
 * - DB: D1 Database
 * - DOCUMENTS: R2 Bucket
 * 
 * Secrets required (configured via wrangler secret put):
 * - AUTH_SECRET
 * - MYINVOIS_CLIENT_ID
 * - MYINVOIS_CLIENT_SECRET
 * - MYINVOIS_API_URL
 * - PAYMENT_PROVIDER_KEY
 */

export interface Env {
  DB: D1Database;
  DOCUMENTS: R2Bucket;
  AUTH_SECRET: string;
  MYINVOIS_CLIENT_ID: string;
  MYINVOIS_CLIENT_SECRET: string;
  MYINVOIS_API_URL: string;
  PAYMENT_PROVIDER_KEY: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // API Routes
      if (path.startsWith('/api/')) {
        return await handleApiRequest(request, env, path);
      }

      // Health check
      if (path === '/health') {
        return Response.json({ status: 'ok', version: '5.5.0' });
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Worker error:', error);
      return Response.json(
        { error: 'Internal server error' },
        { status: 500, headers: corsHeaders }
      );
    }
  },
};

async function handleApiRequest(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;

  // Health
  if (path === '/api/health') {
    return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  // Companies
  if (path === '/api/companies' && method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT company_id, company_code, legal_name, trading_name, entity_type, ssm_number, tin, status FROM companies WHERE status = ?'
    ).bind('active').all();
    return Response.json({ data: results }, { headers: corsHeaders });
  }

  // Chart of Accounts
  if (path.startsWith('/api/accounts') && method === 'GET') {
    const companyId = new URL(request.url).searchParams.get('company_id');
    if (!companyId) {
      return Response.json({ error: 'company_id required' }, { status: 400 });
    }
    const { results } = await env.DB.prepare(
      'SELECT * FROM chart_of_accounts WHERE company_id = ? AND is_active = 1 ORDER BY code'
    ).bind(companyId).all();
    return Response.json({ data: results }, { headers: corsHeaders });
  }

  // Journal Entries
  if (path.startsWith('/api/journals') && method === 'GET') {
    const companyId = new URL(request.url).searchParams.get('company_id');
    if (!companyId) {
      return Response.json({ error: 'company_id required' }, { status: 400 });
    }
    const { results } = await env.DB.prepare(
      'SELECT * FROM journal_entries WHERE company_id = ? ORDER BY entry_date DESC, entry_number DESC'
    ).bind(companyId).all();
    return Response.json({ data: results }, { headers: corsHeaders });
  }

  // Create Journal Entry (with balance validation)
  if (path === '/api/journals' && method === 'POST') {
    const body = await request.json() as any;
    
    // Validate balance
    const totalDebit = body.lines?.reduce((sum: number, l: any) => sum + (l.debit || 0), 0) || 0;
    const totalCredit = body.lines?.reduce((sum: number, l: any) => sum + (l.credit || 0), 0) || 0;
    
    if (totalDebit !== totalCredit) {
      return Response.json(
        { error: 'Journal entry does not balance. Total debit must equal total credit.' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (totalDebit === 0) {
      return Response.json(
        { error: 'Journal entry must have non-zero amounts.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check period is not locked
    if (body.period_id) {
      const period = await env.DB.prepare(
        'SELECT status FROM accounting_periods WHERE id = ?'
      ).bind(body.period_id).first();
      
      if (period && (period as any).status !== 'open') {
        return Response.json(
          { error: 'Cannot post to a locked or closed period.' },
          { status: 403, headers: corsHeaders }
        );
      }
    }

    // Insert journal entry (using prepared statement)
    const journalId = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO journal_entries (id, company_id, entry_number, entry_date, description, status, total_debit, total_credit, period_id, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      journalId,
      body.company_id,
      body.entry_number,
      body.entry_date,
      body.description,
      body.status || 'draft',
      totalDebit,
      totalCredit,
      body.period_id || null,
      body.created_by
    ).run();

    // Insert journal lines
    for (const line of body.lines || []) {
      await env.DB.prepare(
        `INSERT INTO journal_lines (id, journal_id, account_id, description, debit, credit, currency, exchange_rate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        crypto.randomUUID(),
        journalId,
        line.account_id,
        line.description || '',
        line.debit || 0,
        line.credit || 0,
        line.currency || 'MYR',
        line.exchange_rate || 1.0
      ).run();
    }

    return Response.json({ data: { id: journalId }, message: 'Journal entry created' }, { status: 201, headers: corsHeaders });
  }

  // Trial Balance
  if (path.startsWith('/api/reports/trial-balance')) {
    const companyId = new URL(request.url).searchParams.get('company_id');
    if (!companyId) {
      return Response.json({ error: 'company_id required' }, { status: 400 });
    }

    const accounts = await env.DB.prepare(
      `SELECT ca.id, ca.code, ca.name, ca.type, ca.opening_balance,
              COALESCE(SUM(jl.debit), 0) as total_debit,
              COALESCE(SUM(jl.credit), 0) as total_credit
       FROM chart_of_accounts ca
       LEFT JOIN journal_lines jl ON jl.account_id = ca.id
       LEFT JOIN journal_entries je ON je.id = jl.journal_id AND je.status = 'posted'
       WHERE ca.company_id = ? AND ca.is_active = 1 AND ca.parent_id IS NOT NULL
       GROUP BY ca.id
       ORDER BY ca.code`
    ).bind(companyId).all();

    return Response.json({ data: accounts.results }, { headers: corsHeaders });
  }

  // Default
  return Response.json({ error: 'Endpoint not found' }, { status: 404, headers: corsHeaders });
}
