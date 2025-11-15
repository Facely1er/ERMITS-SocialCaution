#!/usr/bin/env node
/**
 * Production Health Check Script
 * Validates production readiness before deployment
 */

const fs = require('fs');
const path = require('path');

const checks = {
  passed: [],
  warnings: [],
  errors: []
};

function checkFile(filePath, description, critical = false) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    checks.passed.push(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    const message = `${critical ? '❌' : '⚠️'} ${description}: ${filePath} ${critical ? 'MISSING' : 'not found'}`;
    if (critical) {
      checks.errors.push(message);
    } else {
      checks.warnings.push(message);
    }
    return false;
  }
}

function checkPackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Check required scripts
    const requiredScripts = ['build', 'dev', 'lint', 'type-check'];
    requiredScripts.forEach(script => {
      if (pkg.scripts && pkg.scripts[script]) {
        checks.passed.push(`✅ Script '${script}' found`);
      } else {
        checks.warnings.push(`⚠️ Script '${script}' missing`);
      }
    });
    
    // Check required dependencies
    const requiredDeps = ['react', 'react-dom', 'react-router-dom'];
    requiredDeps.forEach(dep => {
      if (pkg.dependencies && pkg.dependencies[dep]) {
        checks.passed.push(`✅ Dependency '${dep}' found`);
      } else {
        checks.errors.push(`❌ Required dependency '${dep}' missing`);
      }
    });
    
    return true;
  } else {
    checks.errors.push('❌ package.json not found');
    return false;
  }
}

console.log('🔍 Running Production Health Check...\n');

// Check critical files
checkFile('package.json', 'Package configuration', true);
checkFile('vite.config.ts', 'Build configuration', true);
checkFile('tsconfig.json', 'TypeScript configuration', true);
checkFile('netlify.toml', 'Netlify deployment config', true);
checkFile('public/_headers', 'Security headers', true);
checkFile('public/_redirects', 'URL redirects', true);

// Check optional but recommended files
checkFile('README.md', 'Project documentation', false);
checkFile('public/manifest.json', 'PWA manifest', false);
checkFile('public/robots.txt', 'SEO robots file', false);
checkFile('public/sitemap.xml', 'SEO sitemap', false);

// Check source files
checkFile('src/main.tsx', 'Main entry point', true);
checkFile('src/App.tsx', 'App component', true);
checkFile('src/utils/production.ts', 'Production utilities', false);
checkFile('src/utils/monitoring.tsx', 'Monitoring service', false);

// Check package.json
checkPackageJson();

// Summary
console.log('\n📋 Health Check Summary\n');
console.log(`✅ Passed: ${checks.passed.length}`);
console.log(`⚠️  Warnings: ${checks.warnings.length}`);
console.log(`❌ Errors: ${checks.errors.length}\n`);

if (checks.passed.length > 0) {
  console.log('✅ Passed Checks:');
  checks.passed.forEach(check => console.log(`   ${check}`));
}

if (checks.warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  checks.warnings.forEach(warning => console.log(`   ${warning}`));
}

if (checks.errors.length > 0) {
  console.log('\n❌ Errors:');
  checks.errors.forEach(error => console.log(`   ${error}`));
}

const healthScore = checks.passed.length / (checks.passed.length + checks.warnings.length + checks.errors.length) * 100;
console.log(`\n🎯 Health Score: ${Math.round(healthScore)}%`);

if (checks.errors.length > 0) {
  console.log('\n❌ Health check failed - fix errors before deployment');
  process.exit(1);
} else if (checks.warnings.length > 5) {
  console.log('\n⚠️  Health check passed with warnings - review before deployment');
  process.exit(0);
} else {
  console.log('\n✅ Health check passed - ready for deployment');
  process.exit(0);
}

