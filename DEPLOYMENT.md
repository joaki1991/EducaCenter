# EducaCenter - Deployment Guide

Complete guide for deploying the multi-tenant time tracking SaaS application.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Production Deployment](#production-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Security Checklist](#security-checklist)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Backend Requirements
- Node.js 20+ LTS
- PostgreSQL 14+
- npm or yarn
- Git

### Frontend Requirements
- Node.js 20+
- npm or yarn

### Production Requirements
- Domain with SSL certificate
- PostgreSQL database (managed service recommended)
- Hosting platform (Railway, Render, Fly.io, AWS, etc.)
- Email service (optional, for notifications)

---

## 💻 Local Development

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/EducaCenter.git
cd EducaCenter
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Example .env for local development:**
```env
DATABASE_URL="postgresql://educacenter:educacenter123@localhost:5432/educacenter?schema=public"
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

### 3. Database Setup

**Option A: Local PostgreSQL**

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
```

```sql
CREATE DATABASE educacenter;
CREATE USER educacenter WITH ENCRYPTED PASSWORD 'educacenter123';
GRANT ALL PRIVILEGES ON DATABASE educacenter TO educacenter;
\q
```

**Option B: Docker PostgreSQL**

```bash
# From root directory
docker-compose up -d postgres
```

### 4. Run Migrations and Seed

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed initial data
npm run prisma:seed
```

### 5. Start Backend

```bash
# Development mode with hot reload
npm run dev

# Backend runs on http://localhost:3000
```

### 6. Frontend Setup

```bash
# From root directory
cd ..  # (if you're in backend/)

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend runs on http://localhost:5173
```

### 7. Test the Application

Open http://localhost:5173 and login with:

- **Super Admin:** admin@educacenter.com / EducaCenter2025
- **Company Admin:** admin@empresademo.com / admin123
- **Employee:** empleado@empresademo.com / employee123

---

## 🚀 Production Deployment

### Architecture Options

#### Option 1: Separate Hosting (Recommended)
- **Backend:** Railway / Render / Fly.io
- **Frontend:** Vercel / Netlify
- **Database:** Supabase / Neon / Railway PostgreSQL

#### Option 2: All-in-One Docker
- Single VPS with Docker Compose
- Traefik or Nginx as reverse proxy
- Let's Encrypt for SSL

#### Option 3: Cloud Provider
- AWS (EC2 + RDS + S3)
- Google Cloud (GCE + Cloud SQL)
- Azure (App Service + Azure Database)

---

### Deployment to Railway (Backend)

#### 1. Create Railway Account
Visit https://railway.app and sign up.

#### 2. Create New Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

#### 3. Add PostgreSQL Database

In Railway dashboard:
- Click "+ New"
- Select "Database"
- Choose "PostgreSQL"
- Copy the DATABASE_URL

#### 4. Configure Environment Variables

In Railway project settings, add:

```env
DATABASE_URL=<from-railway-postgres>
PORT=3000
NODE_ENV=production
JWT_SECRET=<generate-strong-random-secret>
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.com
COOKIE_DOMAIN=your-backend-domain.railway.app
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 5. Deploy Backend

```bash
cd backend
railway up
```

#### 6. Run Migrations

```bash
railway run npm run prisma:deploy
railway run npm run prisma:seed
```

Your backend will be available at: `https://your-app.railway.app`

---

### Deployment to Vercel (Frontend)

#### 1. Create Vercel Account
Visit https://vercel.com and sign up.

#### 2. Update Frontend API URL

Edit `src/api/config.js`:

```javascript
const API_BASE = 'https://your-backend.railway.app/api';
export default API_BASE;
```

#### 3. Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### 4. Configure Domain

In Vercel dashboard:
- Add your custom domain
- Vercel automatically handles SSL

---

### Docker Production Deployment

#### 1. Build Images

```bash
# Backend
cd backend
docker build -t educacenter-backend .

# Frontend (create Dockerfile first)
cd ..
docker build -t educacenter-frontend .
```

#### 2. Use Docker Compose

Update `docker-compose.yml` for production:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  backend:
    image: educacenter-backend:latest
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      CORS_ORIGIN: https://your-domain.com
      COOKIE_SECURE: "true"
    depends_on:
      - postgres
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
    restart: always

volumes:
  postgres_data:
```

#### 3. Start Services

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔐 Environment Variables

### Backend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | - | PostgreSQL connection string |
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment (development/production) |
| `JWT_SECRET` | ✅ Yes | - | Secret for JWT signing (min 32 chars) |
| `JWT_EXPIRES_IN` | No | 2h | Token expiration |
| `JWT_REFRESH_EXPIRES_IN` | No | 7d | Refresh token expiration |
| `CORS_ORIGIN` | ✅ Yes | - | Frontend URL for CORS |
| `COOKIE_DOMAIN` | ✅ Yes | - | Domain for cookies |
| `COOKIE_SECURE` | ✅ Yes (prod) | false | Set to `true` in production |
| `COOKIE_SAME_SITE` | No | lax | `strict`, `lax`, or `none` |

### Frontend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ✅ Yes | - | Backend API URL |

---

## 💾 Database Setup

### Production Database Options

#### Option 1: Managed PostgreSQL (Recommended)

**Providers:**
- **Supabase:** Free tier + managed Postgres
- **Neon:** Serverless Postgres
- **Railway:** Integrated with hosting
- **AWS RDS:** Enterprise-grade
- **Google Cloud SQL:** Fully managed

**Benefits:**
- Automatic backups
- Scaling
- Monitoring
- High availability

#### Option 2: Self-Hosted

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Secure installation
sudo -u postgres psql
```

```sql
-- Create production user with strong password
CREATE USER educacenter_prod WITH ENCRYPTED PASSWORD 'very-strong-password-here';
CREATE DATABASE educacenter_prod OWNER educacenter_prod;
GRANT ALL PRIVILEGES ON DATABASE educacenter_prod TO educacenter_prod;
```

### Backup Strategy

#### Automated Daily Backups

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/educacenter"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="educacenter_prod"
DB_USER="educacenter_prod"

mkdir -p $BACKUP_DIR

pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

**Cron job:**
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

### Restore from Backup

```bash
gunzip -c backup_YYYYMMDD_HHMMSS.sql.gz | psql -U educacenter_prod educacenter_prod
```

---

## 🔒 Security Checklist

### Before Going Live

- [ ] Change `JWT_SECRET` to strong random value (64+ characters)
- [ ] Set `COOKIE_SECURE=true`
- [ ] Enable HTTPS/SSL on all domains
- [ ] Configure proper `CORS_ORIGIN` (no wildcards in production)
- [ ] Use strong database passwords
- [ ] Enable database encryption at rest
- [ ] Set up firewall rules (only necessary ports open)
- [ ] Enable rate limiting
- [ ] Configure CSP (Content Security Policy)
- [ ] Review and update `.env` files (never commit)
- [ ] Enable 2FA for hosting accounts
- [ ] Set up monitoring and alerts
- [ ] Configure automatic security updates
- [ ] Perform security audit / penetration testing

### Ongoing Security

- [ ] Regular dependency updates (`npm audit`)
- [ ] Monitor logs for suspicious activity
- [ ] Regular backup testing
- [ ] Review access logs monthly
- [ ] Rotate JWT secrets annually
- [ ] Update SSL certificates (if self-managed)
- [ ] Review and update firewall rules

---

## 📊 Monitoring

### Application Monitoring

**Recommended Tools:**
- **Sentry:** Error tracking
- **LogRocket:** Session replay
- **DataDog:** Full-stack monitoring
- **New Relic:** Performance monitoring

### Database Monitoring

Monitor:
- Connection pool usage
- Query performance (slow queries)
- Database size growth
- Lock contention
- Replication lag (if applicable)

### Server Monitoring

Monitor:
- CPU usage
- Memory usage
- Disk space
- Network traffic
- Response times
- Error rates

### Setting Up Sentry (Example)

```bash
npm install @sentry/node
```

```typescript
// src/server.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: config.nodeEnv,
  tracesSampleRate: 1.0,
});

fastify.setErrorHandler((error, request, reply) => {
  Sentry.captureException(error);
  // ... rest of error handler
});
```

---

## 🐛 Troubleshooting

### Backend Won't Start

**Problem:** `Error: Cannot find module '@prisma/client'`

**Solution:**
```bash
npm run prisma:generate
```

---

**Problem:** `Error: DATABASE_URL not found`

**Solution:** Check `.env` file exists and contains `DATABASE_URL`.

---

**Problem:** `Error: connect ECONNREFUSED`

**Solution:** Database not running or wrong connection string.

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U educacenter -h localhost -d educacenter
```

---

### Frontend Can't Connect to Backend

**Problem:** CORS error in browser console

**Solution:** 
1. Check `CORS_ORIGIN` in backend `.env` matches frontend URL
2. Ensure `credentials: true` in CORS config
3. Verify frontend is using correct API URL

---

**Problem:** Cookies not being set

**Solution:**
1. Check `COOKIE_SECURE` matches your HTTPS status
2. If crossing domains, set `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true`
3. Verify `COOKIE_DOMAIN` is correct

---

### Database Issues

**Problem:** `FATAL: password authentication failed`

**Solution:** Check database credentials in `DATABASE_URL`.

---

**Problem:** Migrations fail

**Solution:**
```bash
# Reset database (CAUTION: deletes all data)
npm run prisma migrate reset

# Or manually fix migration
npm run prisma migrate resolve --applied <migration-name>
```

---

### Performance Issues

**Problem:** Slow queries

**Solution:**
```bash
# Enable query logging
# In prisma config, add log: ['query']

# Add indexes to frequently queried fields
# Check prisma/schema.prisma for @@index directives
```

---

### Memory Leaks

**Problem:** Node process consuming too much memory

**Solution:**
1. Update to latest Node.js LTS
2. Check for unhandled promises
3. Review database connection pool settings
4. Use profiling tools (`node --inspect`)

---

## 📚 Additional Resources

### Documentation
- [Prisma Docs](https://www.prisma.io/docs)
- [Fastify Docs](https://www.fastify.io/docs/latest/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [React Router Docs](https://reactrouter.com/)

### Spanish Labor Law
- [RDL 8/2019 (BOE)](https://www.boe.es/eli/es/rdl/2019/03/08/8)
- [Guía AEPD RGPD](https://www.aepd.es/guias)
- [Inspección de Trabajo](https://www.mites.gob.es)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

## 🆘 Support

For issues or questions:

- **GitHub Issues:** [Create an issue](https://github.com/yourusername/EducaCenter/issues)
- **Email:** support@educacenter.com
- **Documentation:** Check backend/README.md

---

**Last Updated:** December 2025
