# Quick Start Guide - EducaCenter

Get up and running with EducaCenter in 5 minutes!

## 🚀 Prerequisites

- Node.js 20+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/)) or Docker
- Git

## ⚡ Quick Setup (Docker - Recommended)

### 1. Clone and Start

```bash
# Clone repository
git clone https://github.com/joaki1991/EducaCenter.git
cd EducaCenter

# Start PostgreSQL and Backend with Docker Compose
docker-compose up -d

# Frontend
npm install
npm run dev
```

### 2. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

### 3. Login

- **Super Admin:** admin@educacenter.com / EducaCenter2025
- **Company Admin:** admin@empresademo.com / admin123
- **Employee:** empleado@empresademo.com / employee123

**That's it! 🎉**

---

## 🔧 Manual Setup (Without Docker)

### 1. Clone Repository

```bash
git clone https://github.com/joaki1991/EducaCenter.git
cd EducaCenter
```

### 2. Setup PostgreSQL

**Option A: Local PostgreSQL**

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postgresql

# macOS
brew install postgresql
brew services start postgresql

# Create database
sudo -u postgres psql -c "CREATE DATABASE educacenter;"
sudo -u postgres psql -c "CREATE USER educacenter WITH PASSWORD 'educacenter123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE educacenter TO educacenter;"
```

**Option B: Docker PostgreSQL Only**

```bash
docker run --name educacenter-postgres \
  -e POSTGRES_USER=educacenter \
  -e POSTGRES_PASSWORD=educacenter123 \
  -e POSTGRES_DB=educacenter \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env (if needed, default values work for local)
# nano .env

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed initial data
npm run prisma:seed

# Start backend
npm run dev
```

Backend will run on http://localhost:3000

### 4. Setup Frontend

```bash
# From root directory (open new terminal)
cd EducaCenter  # (if you're in backend/)

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend will run on http://localhost:5173

---

## 🧪 Test the Application

### 1. Login as Super Admin

- Email: `admin@educacenter.com`
- Password: `EducaCenter2025`

### 2. Try Time Tracking

1. Login as employee: `empleado@empresademo.com` / `employee123`
2. Go to time tracking section
3. Click "Check In" (Entrada)
4. Click "Check Out" (Salida)

### 3. Try Vacation Request

1. Login as employee
2. Go to vacation section
3. Request vacation dates
4. Login as admin to approve/reject

### 4. View Reports

1. Login as admin
2. Go to reports section
3. View employee or company reports

---

## 📚 API Testing

### Using curl

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@educacenter.com","password":"EducaCenter2025"}' \
  -c cookies.txt

# Get current user (with cookies)
curl http://localhost:3000/api/auth/me \
  -b cookies.txt

# Check in
curl -X POST http://localhost:3000/api/time-entries/check-in \
  -H "Content-Type: application/json" \
  -d '{"latitude":40.4168,"longitude":-3.7038,"comment":"Test check-in"}' \
  -b cookies.txt
```

### Using Postman/Insomnia

1. Import collection from `backend/postman_collection.json` (create if needed)
2. Set base URL: `http://localhost:3000/api`
3. Enable cookies in settings
4. Test endpoints

---

## 🔍 Common Issues

### Problem: Backend won't start

**Error:** `Error: Cannot find module '@prisma/client'`

```bash
cd backend
npm run prisma:generate
```

---

**Error:** `Error: DATABASE_URL not found`

```bash
# Check .env file exists
ls backend/.env

# If not, copy from example
cd backend
cp .env.example .env
```

---

### Problem: Database connection failed

**Error:** `Error: connect ECONNREFUSED`

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Or check Docker container
docker ps | grep postgres

# Test connection
psql -U educacenter -h localhost -d educacenter
```

---

### Problem: Port already in use

**Error:** `EADDRINUSE: address already in use :::3000`

```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in backend/.env
PORT=3001
```

---

### Problem: CORS errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

```bash
# Check CORS_ORIGIN in backend/.env
CORS_ORIGIN=http://localhost:5173

# Restart backend
```

---

## 🧹 Clean Reset

If you need to start fresh:

```bash
# Stop all services
docker-compose down

# Remove all data (⚠️ WARNING: Deletes all data)
docker-compose down -v

# Start fresh
docker-compose up -d

# Or manually reset database
cd backend
npm run prisma migrate reset
npm run prisma:seed
```

---

## 📱 Environment Variables Reference

### Backend (`backend/.env`)

```env
# Required
DATABASE_URL="postgresql://educacenter:educacenter123@localhost:5432/educacenter?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:5173

# Optional (defaults shown)
PORT=3000
NODE_ENV=development
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

### Frontend (`src/api/config.js`)

```javascript
const API_BASE = 'http://localhost:3000/api';
```

---

## 🎯 Next Steps

1. **Explore the API:** Check [backend/README.md](backend/README.md)
2. **Read Documentation:** See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
3. **Deploy to Production:** Follow [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Customize Frontend:** Adapt UI for time tracking features

---

## 🆘 Need Help?

- **Documentation:** Check `/docs` folder
- **Issues:** https://github.com/joaki1991/EducaCenter/issues
- **API Docs:** [backend/README.md](backend/README.md)

---

## 🎓 Learning Resources

### Spanish Labor Law
- [RDL 8/2019 (BOE)](https://www.boe.es/eli/es/rdl/2019/03/08/8)
- [Ministerio de Trabajo](https://www.mites.gob.es)

### GDPR/RGPD
- [AEPD - Guías](https://www.aepd.es/guias)
- [GDPR Official Text](https://gdpr.eu/)

### Technologies
- [Fastify Docs](https://www.fastify.io/)
- [Prisma Docs](https://www.prisma.io/docs)
- [React Docs](https://react.dev/)

---

**Ready to build! 🚀**
