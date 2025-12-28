# EducaCenter Backend API

Multi-tenant time tracking SaaS backend compliant with Spanish RDL 8/2019 and GDPR.

## 🏗 Architecture

- **Runtime**: Node.js 20+
- **Framework**: Fastify
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript
- **Authentication**: JWT with HTTPOnly cookies

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials and secrets
nano .env

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with initial data
npm run prisma:seed
```

### Development

```bash
# Start development server
npm run dev

# The API will be available at http://localhost:3000
```

### Production

```bash
# Build TypeScript
npm run build

# Run migrations
npm run prisma:deploy

# Start production server
npm start
```

## 🐳 Docker Deployment

### Using Docker Compose (recommended for local development)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Building Docker Image

```bash
# Build image
docker build -t educacenter-backend .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  educacenter-backend
```

## 📚 API Documentation

### Authentication

All authenticated endpoints require a valid JWT token in an HTTPOnly cookie named `authToken`.

#### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "admin@empresademo.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "admin@empresademo.com",
    "role": "COMPANY_ADMIN",
    "companyId": "..."
  }
}
```

#### POST /api/auth/logout
Logout and clear cookies.

#### GET /api/auth/me
Get current user information.

### Time Entries (Fichajes)

#### POST /api/time-entries/check-in
Check in (entrada).

**Request:**
```json
{
  "latitude": 40.4168,
  "longitude": -3.7038,
  "comment": "Llegada a la oficina"
}
```

#### POST /api/time-entries/check-out
Check out (salida).

#### GET /api/time-entries/status
Get current check-in/out status.

#### GET /api/time-entries/my-entries
Get my time entries with optional date filters.

### Vacation Requests

#### POST /api/vacations
Create vacation request.

**Request:**
```json
{
  "startDate": "2025-07-01",
  "endDate": "2025-07-15"
}
```

#### GET /api/vacations/my-requests
Get my vacation requests.

#### GET /api/vacations/balance?year=2025
Get vacation balance for a year.

#### GET /api/vacations/pending
Get pending requests (admin only).

#### PUT /api/vacations/:id/approve-reject
Approve or reject vacation request (admin only).

### Companies

#### POST /api/companies
Create company (super admin only).

#### GET /api/companies
List companies accessible to user.

#### GET /api/companies/:id
Get company details.

#### PUT /api/companies/:id
Update company.

### Employees

#### POST /api/employees
Create employee (admin only).

#### GET /api/employees
List employees in company.

#### GET /api/employees/:id
Get employee details.

#### PUT /api/employees/:id
Update employee.

#### GET /api/employees/:id/time-entries
Get employee time entries.

## 🔐 Security Features

- ✅ HTTPOnly cookies for JWT tokens
- ✅ CSRF protection via Fastify Helmet
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Role-based access control (RBAC)
- ✅ Multi-tenant data isolation
- ✅ Audit logging for all operations
- ✅ HTTPS enforcement in production
- ✅ XSS protection headers

## 🏢 Multi-Tenant Architecture

All data queries are automatically filtered by `companyId` to ensure tenant isolation:

- Single-company users have `companyId` in their JWT
- Multi-company users (gestorías) have `companyIds[]` and must send `X-Company-Id` header
- Backend middleware enforces company isolation on all queries

## 📊 Database Schema

Key models:
- **Companies**: Organizations using the platform
- **Users**: Authentication and basic user data
- **Employees**: Employee records linked to companies
- **TimeEntries**: Check-in/out records with geolocation
- **VacationRequests**: Holiday request management
- **Holidays**: Spanish national/regional holidays
- **AuditLogs**: Complete audit trail

## 🧪 Testing Credentials

After running seed:

- **Super Admin**: admin@educacenter.com / EducaCenter2025
- **Company Admin**: admin@empresademo.com / admin123
- **Employee**: empleado@empresademo.com / employee123

## ⚖️ Legal Compliance

This system is designed to comply with:

- **RDL 8/2019**: Spanish labor time tracking law
- **RGPD**: General Data Protection Regulation (GDPR)
- 4-year data retention requirement
- Immutable audit trails
- Geolocation consent and privacy

## 🔧 Environment Variables

See `.env.example` for all configuration options.

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing (must be secure in production)
- `PORT`: Server port (default: 3000)
- `CORS_ORIGIN`: Frontend URL for CORS
- `COOKIE_SECURE`: Set to `true` in production with HTTPS

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration and database client
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth and validation middleware
│   ├── routes/         # API routes
│   ├── utils/          # Utilities (JWT, password, audit)
│   └── server.ts       # Main server file
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Initial data seed
├── Dockerfile          # Production Docker image
└── package.json        # Dependencies and scripts
```

## 🚨 Important Notes

1. **Never commit `.env` file** - it contains secrets
2. **Always use HTTPS in production** - set `COOKIE_SECURE=true`
3. **Change JWT_SECRET** - use a strong random string
4. **Backup database regularly** - 4-year retention required
5. **Monitor audit logs** - for security and compliance

## 📞 Support

For questions or issues, contact the development team.
