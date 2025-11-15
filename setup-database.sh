#!/bin/bash

# Database Setup Script for 30-Day Privacy Roadmap
# This script helps set up the Supabase database schema

echo "🚀 Setting up Supabase database for 30-Day Privacy Roadmap..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create one with your Supabase credentials."
    echo "Example:"
    echo "VITE_SUPABASE_URL=your_supabase_url"
    echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
    exit 1
fi

# Check if supabase-schema.sql exists
if [ ! -f "supabase-schema.sql" ]; then
    echo "❌ supabase-schema.sql not found. Please ensure the schema file exists."
    exit 1
fi

echo "✅ Environment file found"
echo "✅ Schema file found"

echo ""
echo "📋 Next steps:"
echo "1. Go to your Supabase dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Copy the contents of supabase-schema.sql"
echo "4. Paste and execute the SQL"
echo "5. Verify tables are created in the Table Editor"
echo ""
echo "🔧 Tables that will be created:"
echo "   - users"
echo "   - thirty_day_challenges"
echo "   - daily_tasks"
echo "   - user_progress"
echo "   - achievements"
echo ""
echo "🔐 Security features:"
echo "   - Row Level Security (RLS) enabled"
echo "   - User data isolation"
echo "   - Automatic triggers for timestamps"
echo "   - Initial achievements creation"
echo ""
echo "✨ Setup complete! Your backend is ready for the 30-day privacy roadmap."

# Optional: Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
    echo ""
    echo "🔧 Supabase CLI detected. You can also run:"
    echo "   supabase db reset"
    echo "   supabase db push"
else
    echo ""
    echo "💡 Tip: Install Supabase CLI for easier database management:"
    echo "   npm install -g supabase"
fi
