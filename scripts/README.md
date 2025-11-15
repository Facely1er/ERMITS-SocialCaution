# Production Scripts

This directory contains production validation and health check scripts.

## Available Scripts

### health-check.cjs
Quick health check to verify required files and configurations exist.

**Usage:**
```bash
npm run health-check
```

**What it checks:**
- Required files (package.json, vite.config.ts, etc.)
- Security headers and redirects
- Package.json scripts and dependencies
- Source files

### validate-production.cjs
Comprehensive production validation before deployment.

**Usage:**
```bash
npm run production-check
```

**What it validates:**
- TypeScript type checking
- ESLint validation
- Production build
- Required files
- Build output

## Integration

These scripts are integrated into npm scripts:

- `npm run health-check` - Quick health check
- `npm run production-check` - Full production validation
- `npm run pre-deploy` - Runs before deployment (alias for production-check)

## Exit Codes

- `0` - Validation passed
- `1` - Validation failed (errors found)

## Usage in CI/CD

These scripts can be used in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Production Validation
  run: npm run production-check
```

```bash
# Example Netlify build command
npm run production-check && npm run build
```

