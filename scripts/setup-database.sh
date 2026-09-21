#!/bin/bash

# KiraEnterprise v5.5 - Database Setup Script
# This script initializes the D1 database with schema and demo data

echo "🚀 KiraEnterprise v5.5 - Database Setup"
echo "======================================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler is not installed"
    echo "Install it with: npm install -g wrangler"
    exit 1
fi

echo "✅ Wrangler is installed"
echo ""

# Database name from wrangler.toml
DB_NAME="name"

echo "📦 Applying migrations..."
echo ""

# Apply migrations in order
for migration in migrations/*.sql; do
    if [ -f "$migration" ]; then
        echo "  → Applying $(basename $migration)..."
        wrangler d1 execute $DB_NAME --file="$migration" --remote
        if [ $? -eq 0 ]; then
            echo "    ✅ Success"
        else
            echo "    ❌ Failed"
            exit 1
        fi
    fi
done

echo ""
echo "🌱 Seeding demo data..."
echo ""

# Seed dummy data
if [ -f "scripts/seed-dummy-data.sql" ]; then
    echo "  → Running seed-dummy-data.sql..."
    wrangler d1 execute $DB_NAME --file="scripts/seed-dummy-data.sql" --remote
    if [ $? -eq 0 ]; then
        echo "    ✅ Success"
    else
        echo "    ❌ Failed"
        exit 1
    fi
else
    echo "  ⚠️  Seed file not found: scripts/seed-dummy-data.sql"
fi

echo ""
echo "🔍 Verifying data..."
echo ""

# Check if users were created
echo "  → Checking users table..."
wrangler d1 execute $DB_NAME --command="SELECT COUNT(*) as user_count FROM users" --remote

echo ""
echo "  → Checking companies table..."
wrangler d1 execute $DB_NAME --command="SELECT COUNT(*) as company_count FROM companies" --remote

echo ""
echo "======================================"
echo "✅ Database setup complete!"
echo ""
echo "📝 Demo Credentials:"
echo "   Email: admin@kiraenterprise.my"
echo "   Password: demo (or any password)"
echo ""
echo "🌐 Application URL:"
echo "   https://kiraenterprisev5-5.mykira.workers.dev/"
echo ""
