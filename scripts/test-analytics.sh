#!/bin/bash

# Test script for Google Analytics setup
# This simulates the GitHub Actions build process locally

echo "🧪 Testing Google Analytics Build Configuration"
echo "=============================================="

cd apps/web

echo "📦 Installing dependencies..."
pnpm install

echo "🏗️  Building with test GA measurement ID..."
VITE_GA_MEASUREMENT_ID=G-TEST123456 pnpm build

echo "🔍 Checking if GA measurement ID was injected..."
if grep -q "G-TEST123456" dist/assets/*.js; then
    echo "✅ GA measurement ID found in build output"
else
    echo "❌ GA measurement ID NOT found in build output"
    echo "   Check vite.config.ts configuration"
fi

echo "🔍 Checking analytics utility..."
if grep -q "initializeAnalytics" dist/assets/*.js; then
    echo "✅ Analytics utility found in build"
else
    echo "❌ Analytics utility NOT found in build"
fi

echo "📋 Build summary:"
echo "   - Environment: production simulation"
echo "   - GA Measurement ID: G-TEST123456 (test)"
echo "   - Domain validation: devtools.anvik.studio"
echo "   - Analytics status: conditional (production only)"

echo ""
echo "🚀 To deploy with real analytics:"
echo "   1. Set GA_MEASUREMENT_ID secret in GitHub repository"
echo "   2. Push to master branch"
echo "   3. GitHub Actions will build and deploy automatically"

cd ../..
