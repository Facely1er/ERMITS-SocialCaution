# Database Setup Script for 30-Day Privacy Roadmap
# PowerShell version for Windows

Write-Host "🚀 Setting up Supabase database for 30-Day Privacy Roadmap..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found. Please create one with your Supabase credentials." -ForegroundColor Red
    Write-Host "Example:" -ForegroundColor Yellow
    Write-Host "VITE_SUPABASE_URL=your_supabase_url" -ForegroundColor Cyan
    Write-Host "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key" -ForegroundColor Cyan
    exit 1
}

# Check if supabase-schema.sql exists
if (-not (Test-Path "supabase-schema.sql")) {
    Write-Host "❌ supabase-schema.sql not found. Please ensure the schema file exists." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Environment file found" -ForegroundColor Green
Write-Host "✅ Schema file found" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to your Supabase dashboard" -ForegroundColor White
Write-Host "2. Navigate to SQL Editor" -ForegroundColor White
Write-Host "3. Copy the contents of supabase-schema.sql" -ForegroundColor White
Write-Host "4. Paste and execute the SQL" -ForegroundColor White
Write-Host "5. Verify tables are created in the Table Editor" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Tables that will be created:" -ForegroundColor Yellow
Write-Host "   - users" -ForegroundColor White
Write-Host "   - thirty_day_challenges" -ForegroundColor White
Write-Host "   - daily_tasks" -ForegroundColor White
Write-Host "   - user_progress" -ForegroundColor White
Write-Host "   - achievements" -ForegroundColor White

Write-Host ""
Write-Host "🔐 Security features:" -ForegroundColor Yellow
Write-Host "   - Row Level Security (RLS) enabled" -ForegroundColor White
Write-Host "   - User data isolation" -ForegroundColor White
Write-Host "   - Automatic triggers for timestamps" -ForegroundColor White
Write-Host "   - Initial achievements creation" -ForegroundColor White

Write-Host ""
Write-Host "✨ Setup complete! Your backend is ready for the 30-day privacy roadmap." -ForegroundColor Green

# Optional: Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host ""
    Write-Host "🔧 Supabase CLI detected. You can also run:" -ForegroundColor Yellow
    Write-Host "   supabase db reset" -ForegroundColor Cyan
    Write-Host "   supabase db push" -ForegroundColor Cyan
} catch {
    Write-Host ""
    Write-Host "💡 Tip: Install Supabase CLI for easier database management:" -ForegroundColor Yellow
    Write-Host "   npm install -g supabase" -ForegroundColor Cyan
}
