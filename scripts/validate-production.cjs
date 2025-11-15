#!/usr/bin/env node
/**
 * Production Validation Script
 * Comprehensive validation before production deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const results = {
  passed: [],
  warnings: [],
  errors: []
};

function runCommand(command, description) {
  try {
    execSync(command, { stdio: 'pipe', cwd: process.cwd() });
    results.passed.push(`✅ ${description}`);
    return true;
  } catch (error) {
    results.errors.push(`❌ ${description}: ${error.message}`);
    return false;
  }
}

function checkTypeScript() {
  console.log('🔍 Checking TypeScript...');
  return runCommand('npx tsc --noEmit', 'TypeScript type checking');
}

function checkLinting() {
  console.log('🔍 Checking ESLint...');
  return runCommand('npm run lint', 'ESLint validation');
}

function checkBuild() {
  console.log('🔍 Building production bundle...');
  return runCommand('npm run build', 'Production build');
}

function checkFiles() {
  console.log('🔍 Checking required files...');
  
  const requiredFiles = [
    { path: 'package.json', critical: true },
    { path: 'vite.config.ts', critical: true },
    { path: 'tsconfig.json', critical: true },
    { path: 'netlify.toml', critical: true },
    { path: 'public/_headers', critical: true },
    { path: 'public/_redirects', critical: true },
    { path: 'src/main.tsx', critical: true },
    { path: 'src/App.tsx', critical: true }
  ];
  
  let allPassed = true;
  requiredFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file.path);
    if (fs.existsSync(fullPath)) {
      results.passed.push(`✅ Required file: ${file.path}`);
    } else {
      const message = `❌ Required file missing: ${file.path}`;
      if (file.critical) {
        results.errors.push(message);
        allPassed = false;
      } else {
        results.warnings.push(message);
      }
    }
  });
  
  return allPassed;
}

function checkDist() {
  console.log('🔍 Checking build output...');
  const distPath = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distPath)) {
    results.errors.push('❌ Build output directory (dist) not found');
    return false;
  }
  
  const indexHtml = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexHtml)) {
    results.errors.push('❌ dist/index.html not found');
    return false;
  }
  
  results.passed.push('✅ Build output directory exists');
  results.passed.push('✅ dist/index.html found');
  return true;
}

console.log('🚀 Starting Production Validation...\n');

// Run validations
const fileCheck = checkFiles();
const typeCheck = checkTypeScript();
const lintCheck = checkLinting();
const buildCheck = checkBuild();
const distCheck = checkDist();

// Summary
console.log('\n📋 Validation Summary\n');
console.log(`✅ Passed: ${results.passed.length}`);
console.log(`⚠️  Warnings: ${results.warnings.length}`);
console.log(`❌ Errors: ${results.errors.length}\n`);

if (results.passed.length > 0) {
  console.log('✅ Passed:');
  results.passed.forEach(check => console.log(`   ${check}`));
}

if (results.warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  results.warnings.forEach(warning => console.log(`   ${warning}`));
}

if (results.errors.length > 0) {
  console.log('\n❌ Errors:');
  results.errors.forEach(error => console.log(`   ${error}`));
}

const validationScore = results.passed.length / (results.passed.length + results.warnings.length + results.errors.length) * 100;
console.log(`\n🎯 Validation Score: ${Math.round(validationScore)}%`);

if (results.errors.length > 0) {
  console.log('\n❌ Production validation failed - fix errors before deployment');
  process.exit(1);
} else {
  console.log('\n✅ Production validation passed - ready for deployment');
  process.exit(0);
}

