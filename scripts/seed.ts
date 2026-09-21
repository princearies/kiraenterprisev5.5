/**
 * KiraEnterprise v5.5 - Development Seed Script
 * 
 * This script seeds the D1 database with demo data for local development.
 * Run with: wrangler d1 execute kiraenterprise-db --local --file=migrations/005_seed_data.sql
 * 
 * DO NOT run this in production!
 */

// Seed data summary:
// - 3 users (admin, client1, staff)
// - 2 companies (Sabah Trading, KK Services)
// - 3 plans (Starter, Business, Enterprise)
// - 1 active subscription
// - User-company access grants

console.log('=== KiraEnterprise v5.5 Seed Script ===');
console.log('');
console.log('To seed the local D1 database, run:');
console.log('');
console.log('  wrangler d1 execute kiraenterprise-db --local --file=migrations/005_seed_data.sql');
console.log('');
console.log('To apply all migrations:');
console.log('');
console.log('  for f in migrations/*.sql; do');
console.log('    wrangler d1 execute kiraenterprise-db --local --file="$f"');
console.log('  done');
console.log('');
console.log('Demo credentials:');
console.log('  Email: admin@kiraenterprise.my');
console.log('  Password: demo (any password works in dev mode)');
console.log('');
console.log('Platform ID: 134deb69-2609-4b84-8e5c-079aa8d9ba3a');
console.log('D1 Database ID: 134deb69-2609-4b84-8e5c-079aa8d9ba3a');
