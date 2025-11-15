#!/bin/bash

# Script to help update remaining pages with PageLayout component

echo "Starting page updates..."

# List of pages to update
pages=(
  "src/pages/ContactPage.tsx"
  "src/pages/BlogPage.tsx"
  "src/pages/AssessmentPage.tsx"
  "src/pages/PersonasPage.tsx"
  "src/pages/ResourcesPage.tsx"
  "src/pages/ToolkitPage.tsx"
  "src/pages/HelpCenterPage.tsx"
  "src/pages/HowItWorksPage.tsx"
  "src/pages/PrivacyJourneyPage.tsx"
  "src/pages/PrivacyFocusPage.tsx"
  "src/pages/PrivacyActionCenterPage.tsx"
)

echo "Pages to update:"
for page in "${pages[@]}"; do
  echo "  - $page"
done

echo ""
echo "Each page needs:"
echo "1. Import PageLayout from '../components/layout/PageLayout'"
echo "2. Replace motion.div wrapper with PageLayout component"
echo "3. Add appropriate title, subtitle, and breadcrumbs"
echo "4. Ensure dark mode classes are consistent"
echo ""

echo "Dashboard pages need special handling with DashboardLayout"
echo ""

echo "Legal pages in src/pages/legal/ also need updates"
echo "Blog pages in src/pages/blog/ also need updates"
echo "Tool pages in src/pages/tools/ also need updates"
echo ""

echo "Update checklist:"
echo "✓ HomePage - Updated"
echo "✓ AboutPage - Updated"
echo "✓ FeaturesPage - Updated"
echo "✓ PricingPage - Updated"
echo "✓ Created Breadcrumb component"
echo "✓ Created PageLayout component"
echo "✓ Updated Card component for consistency"
echo "✓ Updated ThemeSwitcher for better animations"
echo "✓ Updated DashboardLayout with breadcrumb support"
echo "✓ Updated CSS variables for consistent theming"
echo ""
echo "Next steps: Update remaining pages listed above"