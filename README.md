# EducaCenter - Multi-Tenant Time Tracking SaaS

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14.0-blue.svg)](https://www.postgresql.org/)
[![RDL 8/2019](https://img.shields.io/badge/compliance-RDL%208%2F2019-success.svg)](https://www.boe.es/eli/es/rdl/2019/03/08/8)
[![RGPD](https://img.shields.io/badge/compliance-RGPD%2FGDPR-success.svg)](https://gdpr.eu/)

**Enterprise-grade multi-tenant SaaS platform for labor time tracking, compliant with Spanish RDL 8/2019 and GDPR.**

---

## 🎯 Overview

EducaCenter is a professional, secure, and legally-compliant SaaS application designed for Spanish businesses and labor management companies (gestorías) to track employee work hours, manage vacations, and generate legal reports as required by Spanish labor law.

### Key Features

✅ **Legal Compliance**
- Fully compliant with RDL 8/2019 (mandatory time tracking)
- GDPR/RGPD compliant data processing
- 4-year data retention as legally required
- Audit trails for all operations
- Ready for labor inspections

✅ **Multi-Tenant Architecture**
- Complete data isolation per company
- Support for multiple companies per user (gestorías)
- Scalable to thousands of companies and employees

✅ **Time Tracking (Fichajes)**
- One-click check-in/check-out
- Optional GPS geolocation capture (with consent)
- Prevents duplicate active entries
- Comment support for entries
- Immutable logs with modification tracking

✅ **Vacation Management**
- Automatic calculation of 22 business days
- Excludes weekends and Spanish holidays
- Proportional days for mid-year hires
- Approval workflow for admins
- Balance tracking

✅ **Reporting**
- Employee time reports
- Company-wide reports
- Monthly summaries
- Vacation reports
- Export to PDF, Excel, CSV (coming soon)

✅ **Security**
- JWT authentication with HTTPOnly cookies
- Role-based access control (RBAC)
- Password hashing with bcrypt (12 rounds)
- HTTPS/TLS encryption
- CSRF and XSS protection
- Multi-tenant isolation at database level

---

## 🏗 Architecture

### Tech Stack

**Backend:**
- Node.js 20+ with TypeScript
- Fastify (high-performance web framework)
- Prisma ORM
- PostgreSQL 14+
- JWT authentication
- Zod validation

**Frontend:**
- React 19
- Vite
- Material-UI (MUI)
- React Router
- Axios

**Infrastructure:**
- Docker & Docker Compose
- Compatible with Railway, Render, Fly.io, AWS, GCP
- PostgreSQL (managed or self-hosted)

### Project Structure

```
EducaCenter/
├── backend/                 # Node.js + TypeScript backend
│   ├── src/
│   │   ├── config/         # Configuration and DB client
│   │   ├── controllers/    # Business logic handlers
│   │   ├── middleware/     # Auth and validation
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utilities (JWT, password, audit)
│   │   └── server.ts       # Main server file
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Initial data seeding
│   ├── Dockerfile          # Production Docker image
│   └── package.json
├── src/                     # React frontend
│   ├── api/                # API integration
│   ├── components/         # React components
│   └── views/              # Page views
├── docs/
│   └── legal/              # Legal documentation
│       ├── PRIVACY_POLICY_ES.md
│       ├── LEGAL_NOTICE_ES.md
│       ├── DATA_PROCESSING_AGREEMENT_ES.md
│       └── LEGAL_COMPLIANCE_CHECKLIST.md
├── docker-compose.yml      # Local development setup
├── DEPLOYMENT.md           # Deployment guide
└── README.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/joaki1991/EducaCenter.git
cd EducaCenter
```

2. **Start with Docker Compose (Recommended)**

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database on port 5432
- Backend API on port 3000

3. **Or set up manually:**

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

**Frontend:**
```bash
# From root directory
npm install
npm run dev
```

4. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

**Test Credentials:**
- Super Admin: `admin@educacenter.com` / `EducaCenter2025`
- Company Admin: `admin@empresademo.com` / `admin123`
- Employee: `empleado@empresademo.com` / `employee123`

---

## 📖 Documentation

- **[Backend API Documentation](backend/README.md)** - Complete API reference
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions
- **[Legal Compliance Checklist](docs/legal/LEGAL_COMPLIANCE_CHECKLIST.md)** - RGPD and RDL 8/2019 compliance
- **[Privacy Policy](docs/legal/PRIVACY_POLICY_ES.md)** - Spanish privacy policy template
- **[Legal Notice](docs/legal/LEGAL_NOTICE_ES.md)** - Spanish legal notice template
- **[Data Processing Agreement](docs/legal/DATA_PROCESSING_AGREEMENT_ES.md)** - GDPR compliant DPA

---

## 🔐 Security

Security is a top priority in EducaCenter:

- **Authentication:** JWT tokens in HTTPOnly cookies (not accessible via JavaScript)
- **Password Security:** bcrypt hashing with 12 salt rounds
- **HTTPS:** Enforced in production
- **CSRF Protection:** Via Fastify Helmet
- **XSS Protection:** Content Security Policy headers
- **SQL Injection:** Prevented by Prisma ORM parameterized queries
- **Rate Limiting:** Protection against brute force attacks
- **Multi-Tenant Isolation:** Strict database-level separation
- **Audit Logging:** Complete trail of all operations

---

## ⚖️ Legal Compliance

### RDL 8/2019 - Labor Time Tracking Law

EducaCenter fully complies with Spanish Royal Decree-Law 8/2019:

- ✅ Daily registration of working hours
- ✅ Entry and exit timestamps
- ✅ 4-year minimum data retention
- ✅ Available for labor inspections
- ✅ Accessible to employee representatives
- ✅ Immutable records with audit trails

### RGPD/GDPR - Data Protection

Full compliance with EU General Data Protection Regulation:

- ✅ Data minimization (only necessary data collected)
- ✅ Purpose limitation (clear, defined purposes)
- ✅ User rights implementation (access, rectification, deletion, portability)
- ✅ Security measures (encryption, access control)
- ✅ Data processing agreements (DPA templates provided)
- ✅ Privacy by design
- ✅ Breach notification procedures (48h to authority)

**See [Legal Compliance Checklist](docs/legal/LEGAL_COMPLIANCE_CHECKLIST.md) for complete details.**

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **SUPER_ADMIN** | Platform administration, create companies, view all data |
| **COMPANY_ADMIN** | Manage employees, approve vacations, view company reports |
| **EMPLOYEE** | Check-in/out, request vacations, view own data |
| **MANAGER** | (Optional) Multi-company access for gestorías |

---

## 🌍 Multi-Tenant Architecture

Every company's data is completely isolated:

- All queries filtered by `companyId`
- Middleware enforces company context
- No cross-company data access possible
- Single users belong to one company
- Gestoría users can access multiple companies (with explicit selection)

**Security First:** The backend determines the company context from the authenticated session. The frontend NEVER sends `companyId` - this prevents data leakage.

---

## 📊 Database Schema

Key models:

- **Companies:** Organization data (name, CIF, plan)
- **Users:** Authentication and user profiles
- **UserCompanies:** Multi-company access mapping
- **Employees:** Employee records with company assignment
- **TimeEntries:** Check-in/out records with GPS (optional)
- **VacationRequests:** Holiday requests and approvals
- **Holidays:** Spanish national and regional holidays
- **AuditLogs:** Complete audit trail

See [Prisma Schema](backend/prisma/schema.prisma) for complete details.

---

## 🧪 Testing

```bash
# Backend tests (coming soon)
cd backend
npm test

# Frontend tests (coming soon)
npm test
```

---

## 🚢 Deployment

### Quick Deploy Options

**Option 1: Railway (Backend) + Vercel (Frontend)**
- Easiest for beginners
- Automatic SSL
- Free tier available
- See [Deployment Guide](DEPLOYMENT.md)

**Option 2: Docker on VPS**
- Full control
- Cost-effective for scale
- Requires more setup

**Option 3: AWS/GCP/Azure**
- Enterprise-grade
- High availability
- Auto-scaling

**Complete deployment instructions:** [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🛠 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user

### Time Entries
- `POST /api/time-entries/check-in` - Check in
- `POST /api/time-entries/check-out` - Check out
- `GET /api/time-entries/status` - Current status
- `GET /api/time-entries/my-entries` - My entries

### Vacations
- `POST /api/vacations` - Request vacation
- `GET /api/vacations/my-requests` - My requests
- `GET /api/vacations/balance` - Vacation balance
- `PUT /api/vacations/:id/approve-reject` - Approve/reject (admin)

### Reports
- `GET /api/reports/employee/:id` - Employee report
- `GET /api/reports/company` - Company report
- `GET /api/reports/monthly` - Monthly summary
- `GET /api/reports/vacation` - Vacation report

### Companies & Employees
- `POST /api/companies` - Create company (super admin)
- `GET /api/companies` - List companies
- `POST /api/employees` - Create employee (admin)
- `GET /api/employees` - List employees

**Full API documentation:** [backend/README.md](backend/README.md)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/joaki1991/EducaCenter/issues)
- **Email:** support@educacenter.com
- **Documentation:** See `/docs` folder

---

## 🙏 Acknowledgments

- Built with [Fastify](https://www.fastify.io/)
- Database ORM by [Prisma](https://www.prisma.io/)
- UI components by [Material-UI](https://mui.com/)
- Compliant with Spanish labor law (RDL 8/2019)
- GDPR/RGPD compliant

---

## ⚠️ Important Notes

### Before Production

1. **Change `JWT_SECRET`** to a strong random value
2. **Enable HTTPS** and set `COOKIE_SECURE=true`
3. **Configure backups** for database
4. **Review legal documents** with your legal team
5. **Perform security audit**
6. **Set up monitoring** (Sentry, LogRocket, etc.)

### Legal Disclaimer

This software provides tools to help comply with Spanish labor law and GDPR, but **you are responsible** for ensuring compliance with all applicable laws and regulations. Consult with legal professionals for your specific situation.

---

**Made with ❤️ for Spanish businesses and gestorías**