# Additional Dependencies to Install

## Backend Dependencies

Install the following package for CSRF protection:

```bash
cd backend
npm install cookie-parser
```

## Frontend Dependencies (Optional)

For E2E testing, install Playwright:

```bash
npm install -D @playwright/test
npx playwright install
```

For load testing, install k6:

```bash
# macOS
brew install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Windows
# Download from https://k6.io/docs/getting-started/installation/
```

## Summary

Required:
- `cookie-parser` (backend) - For CSRF protection

Optional:
- `@playwright/test` (frontend) - For E2E testing
- `k6` (system) - For load testing

