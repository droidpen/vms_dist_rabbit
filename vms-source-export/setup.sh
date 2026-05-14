#!/bin/bash
# Quick Setup Script for Risk Acceptance Review System
# Run this after extracting the ZIP file to set up the development environment

set -e  # Exit on any error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Risk Acceptance Review System - Quick Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for required tools
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.x or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18.x or higher (current: $(node -v))"
    exit 1
fi
echo "✅ Node.js $(node -v) installed"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm is not installed. Installing pnpm..."
    npm install -g pnpm@8
fi
echo "✅ pnpm $(pnpm -v) installed"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Check for .env file
echo ""
echo "🔧 Checking environment configuration..."
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⚠️  IMPORTANT: Configure your .env file!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Edit .env and add your Supabase credentials:"
    echo "  1. Go to: https://app.supabase.com/project/<your-project>/settings/api"
    echo "  2. Copy your Project URL and Anon Key"
    echo "  3. Update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
    echo ""
else
    echo "✅ .env file found"
fi

# Display next steps
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Configure Supabase (REQUIRED):"
echo "   • Create a Supabase project at https://supabase.com"
echo "   • Run supabase-setup.sql in SQL Editor"
echo "   • Create storage buckets (ra-presentation, correspondence, supporting-evidence)"
echo "   • Run storage-policies.sql in SQL Editor"
echo "   • Update .env with your Supabase credentials"
echo ""
echo "2. Start development server:"
echo "   pnpm run dev"
echo ""
echo "3. Build for production:"
echo "   pnpm run build"
echo ""
echo "📖 Documentation:"
echo "   • README.md - Project overview"
echo "   • DEPLOYMENT.md - Deployment instructions"
echo "   • SETUP_GUIDE.md - Detailed setup guide"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
