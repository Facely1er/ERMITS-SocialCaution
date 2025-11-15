# ERMITS Social Caution MVP - Production Deployment Guide

## 🚀 Production Readiness Checklist

### Pre-Deployment Requirements

- [ ] **Environment Variables** - All secrets configured
- [ ] **Database** - MongoDB production instance ready
- [ ] **Domain** - DNS configured
- [ ] **SSL Certificates** - HTTPS enabled
- [ ] **Email Service** - SMTP configured (optional)
- [ ] **Monitoring** - Error tracking and logging setup
- [ ] **Backups** - Database backup strategy in place

---

## 🔐 Security Hardening

### 1. Environment Variables

**Never commit these to Git!** Use environment-specific `.env` files:

**Backend Production `.env`:**
```env
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ermits-prod?retryWrites=true&w=majority

# JWT Secrets (Generate with: openssl rand -base64 64)
JWT_SECRET=<your-64-character-secret-here>
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=<your-different-64-character-secret-here>
JWT_REFRESH_EXPIRE=30d

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Optional: Email (for password resets, notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=ERMITS Social Caution

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Redis (for production caching)
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

**Frontend Production `.env`:**
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=ERMITS Social Caution
VITE_APP_ENV=production
```

### 2. Generate Strong Secrets

```bash
# Generate JWT_SECRET
openssl rand -base64 64

# Generate JWT_REFRESH_SECRET
openssl rand -base64 64

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### 3. Database Security

**MongoDB Atlas (Recommended):**
1. Create production cluster
2. Whitelist only your application server IPs
3. Use strong database password
4. Enable backup with point-in-time recovery
5. Use connection string with `retryWrites=true&w=majority`

**Self-Hosted MongoDB:**
```bash
# Enable authentication
mongod --auth --bind_ip localhost

# Create admin user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "strong-password",
  roles: ["root"]
})

# Create application user
use ermits-prod
db.createUser({
  user: "ermits-app",
  pwd: "strong-app-password",
  roles: [{ role: "readWrite", db: "ermits-prod" }]
})
```

---

## 🌐 Deployment Options

### Option 1: Docker + Docker Compose (Recommended)

**1. Update `docker-compose.prod.yml`:**
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "5000:5000"
    env_file:
      - ./backend/.env.production
    depends_on:
      - redis
    networks:
      - app-network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=${VITE_API_URL}
    restart: always
    ports:
      - "3000:3000"
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

volumes:
  redis-data:

networks:
  app-network:
    driver: bridge
```

**2. Build and Deploy:**
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

---

### Option 2: Cloud Platform (Heroku, Railway, Render)

**Heroku Example:**

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create ermits-backend
heroku create ermits-frontend

# Add MongoDB
heroku addons:create mongolab:sandbox -a ermits-backend

# Add Redis
heroku addons:create heroku-redis:hobby-dev -a ermits-backend

# Set environment variables
heroku config:set NODE_ENV=production -a ermits-backend
heroku config:set JWT_SECRET=$(openssl rand -base64 64) -a ermits-backend
heroku config:set JWT_REFRESH_SECRET=$(openssl rand -base64 64) -a ermits-backend
heroku config:set FRONTEND_URL=https://ermits-frontend.herokuapp.com -a ermits-backend

# Deploy backend
cd backend
git push heroku main

# Deploy frontend
cd ..
git push heroku main
```

---

### Option 3: VPS (DigitalOcean, Linode, AWS EC2)

**1. Server Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

**2. Application Setup:**
```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/your-repo/ermits-social-caution.git
cd ermits-social-caution

# Backend setup
cd backend
npm install --production
cp .env.example .env
nano .env  # Configure production values
node src/database/seedPersonas.js

# Start with PM2
pm2 start src/server.js --name ermits-backend
pm2 save
pm2 startup  # Follow instructions

# Frontend setup
cd ..
npm install
npm run build

# Serve with PM2
pm2 serve dist 3000 --name ermits-frontend --spa
pm2 save
```

**3. Nginx Configuration:**

`/etc/nginx/sites-available/ermits`:
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;

        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }
}

# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
```

**4. Enable Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/ermits /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**5. SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot renew --dry-run  # Test auto-renewal
```

---

## 📊 Monitoring & Logging

### 1. Application Monitoring with PM2

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs ermits-backend
pm2 logs ermits-frontend

# Setup log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 2. Error Tracking with Sentry (Optional)

```bash
npm install @sentry/node
```

**backend/src/server.js:**
```javascript
const Sentry = require('@sentry/node');

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: 'production'
  });
}
```

### 3. Database Monitoring

**MongoDB Atlas:** Built-in monitoring dashboard

**Self-hosted:**
```bash
# Install mongodb-tools
sudo apt install mongodb-database-tools

# Setup automated backups
crontab -e
# Add: 0 2 * * * /usr/bin/mongodump --out /backups/mongodb/$(date +\%Y\%m\%d)
```

---

## 🔄 Continuous Deployment

### GitHub Actions

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/ermits-social-caution
            git pull origin main
            cd backend && npm install --production
            pm2 restart ermits-backend
            cd .. && npm install && npm run build
            pm2 restart ermits-frontend
```

---

## 🧪 Health Checks & Uptime

### 1. Application Health Endpoint

Already implemented: `GET /health`

### 2. External Monitoring

- **UptimeRobot** (free): https://uptimerobot.com
- **Pingdom** (paid): https://www.pingdom.com
- **StatusCake** (free tier): https://www.statuscake.com

Configure to check: `https://yourdomain.com/health` every 5 minutes

---

## 🔧 Performance Optimization

### 1. Enable Compression

Already implemented in backend with `compression` middleware.

### 2. CDN for Static Assets

Use Cloudflare or AWS CloudFront for:
- Frontend static assets
- Images
- Fonts

### 3. Database Indexing

Indexes are already defined in models. Verify with:
```javascript
mongosh
use ermits-prod
db.personas.getIndexes()
db.cautionitems.getIndexes()
db.rssfeeds.getIndexes()
```

### 4. Redis Caching

Update `backend/.env.production`:
```env
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

Caching is already implemented in the enhanced middleware.

---

## 📈 Scaling Considerations

### Horizontal Scaling

**Load Balancer Setup (Nginx):**
```nginx
upstream backend_servers {
    least_conn;
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}

server {
    location /api {
        proxy_pass http://backend_servers;
    }
}
```

### Database Scaling

1. **Read Replicas** - MongoDB Atlas supports this
2. **Sharding** - For very large datasets
3. **Connection Pooling** - Already configured in Mongoose

---

## 🛡️ Security Best Practices

### 1. Regular Updates

```bash
# Update dependencies monthly
npm audit
npm audit fix

# Update system packages
sudo apt update && sudo apt upgrade
```

### 2. Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22   # SSH
sudo ufw allow 80   # HTTP
sudo ufw allow 443  # HTTPS
sudo ufw enable
```

### 3. Fail2Ban (Prevent brute force)

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## ✅ Post-Deployment Checklist

- [ ] All services running (PM2 status / Docker ps)
- [ ] HTTPS working with valid SSL certificate
- [ ] Database seeded with personas and RSS feeds
- [ ] RSS cron jobs running (check logs)
- [ ] Health check endpoint responding: `/health`
- [ ] API endpoints responding correctly
- [ ] Frontend loads and can login/register
- [ ] Persona selection works
- [ ] Caution feed populates (may take 1 hour for first RSS fetch)
- [ ] Error tracking configured
- [ ] Backups scheduled
- [ ] Monitoring alerts configured
- [ ] DNS propagated and resolving correctly

---

## 🆘 Troubleshooting

### Backend Won't Start

```bash
# Check logs
pm2 logs ermits-backend --lines 100

# Check MongoDB connection
mongosh $MONGODB_URI

# Verify environment variables
pm2 env ermits-backend
```

### Database Connection Issues

```bash
# Test connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/ermits-prod"

# Check network access in MongoDB Atlas
# Ensure your server IP is whitelisted
```

### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

### High Memory Usage

```bash
# Check process memory
pm2 monit

# Restart if needed
pm2 restart ermits-backend

# Set memory limit
pm2 start src/server.js --max-memory-restart 500M
```

---

## 📞 Support

For deployment issues, check:
- Application logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/error.log`
- MongoDB logs: `/var/log/mongodb/mongod.log`
- System logs: `journalctl -xe`

---

**Your ERMITS Social Caution MVP is now production-ready!** 🎉
