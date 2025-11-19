# Medeva Backend Assessment

Backend REST API untuk sistem manajemen karyawan dengan fitur autentikasi, filtering dinamis, dan Swagger documentation.

## 📋 Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (Bearer Token)
- **Logging**: Winston + Morgan
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker + Docker Compose
- **Package Manager**: pnpm

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0
- PostgreSQL >= 14
- pnpm >= 8.0
- Docker & Docker Compose (opsional)

### Development Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd backend

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp example.env .env

# Edit .env dengan konfigurasi lokal
# DATABASE_URL=postgresql://user:password@localhost:5432/medeva_db

# 4. Setup database
pnpm prisma migrate dev

# 5. Seed data (optional)
pnpm seed

# 6. Start development server
pnpm dev
```

Server akan berjalan di `http://localhost:3150`

### Docker Setup

```bash
# 1. Build dan start services
docker-compose up -d

# 2. Run migrations
docker-compose exec backend pnpm prisma migrate deploy

# 3. Seed data (optional)
docker-compose exec backend pnpm seed

# Check logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## 🔧 Environment Variables

```env
# Server
NODE_ENV=development
PORT=3150
SERVICE=rest

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/medeva_db

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=1h

# Logging
LOG_LEVEL=info
```

## 📚 API Endpoints

### Authentication

```
POST /api/v1/auth/register
  body: { email, username, password }
  response: { user, token }

POST /api/v1/auth/login
  body: { email/username, password }
  response: { user, token }
```

### Employees

```
GET    /api/v1/employees              # List all employees (with filtering)
GET    /api/v1/employees/{id}         # Get employee by ID
POST   /api/v1/employees              # Create employee (ADMIN only)
PUT    /api/v1/employees/{id}         # Update employee (ADMIN only)
DELETE /api/v1/employees/{id}         # Delete employee (ADMIN only)
```

#### Filtering & Pagination

```bash
# Partial search - contains
curl 'http://localhost:3150/api/v1/employees?search=rangga'

# Pagination with limit 10 per page
curl 'http://localhost:3150/api/v1/employees?page=1&limit=10'

# Get all employees (unlimited)
curl 'http://localhost:3150/api/v1/employees?limit=-1'

# Sorting
curl 'http://localhost:3150/api/v1/employees?sortBy=fullName&sortOrder=asc'

# Filter by position
curl 'http://localhost:3150/api/v1/employees?positionId=<uuid>'

# Filter by status
curl 'http://localhost:3150/api/v1/employees?status=active'
```

**Query Parameters:**

- `search`: Filter search (contains, case-insensitive)
- `page`: Halaman (default: 1)
- `limit`: Items per halaman (default: 10, use `-1` for unlimited)
- `sortBy`: Field untuk sorting (fullName, nik, createdAt, updatedAt)
- `sortOrder`: asc/desc (default: asc)
- `positionId`: Filter by position UUID
- `status`: Filter by status (active/inactive)

**Field Aliases** (case-insensitive):

- `fullname` → `fullName`
- `dateofbirth` → `dateOfBirth`
- `placeofbirth` → `placeOfBirth`

### Departments

```
GET    /api/v1/departments                      # List all departments
GET    /api/v1/departments/{id}/positions       # Get position department ID
```

#### Filtering & Pagination

```bash
# List departments with pagination
curl 'http://localhost:3150/api/v1/departments?page=1&limit=10'

# Get all departments (unlimited)
curl 'http://localhost:3150/api/v1/departments?limit=-1'

# Search department
curl 'http://localhost:3150/api/v1/departments?search=IT'
```

**Query Parameters:**

- `search`: Search department name (case-insensitive)
- `page`: Halaman (default: 1)
- `limit`: Items per halaman (default: 10, use `-1` for unlimited)

### Swagger Documentation

Akses dokumentasi interaktif di: `http://localhost:3150/api-docs`

## 🏗️ Arsitektur

```
src/
├── controllers/       # Request handlers
├── services/          # Business logic
├── repositories/      # Data access layer
├── entities/          # Data models & interfaces
├── middlewares/       # Express middlewares
├── validations/       # Zod schemas
├── routes/            # API routes definition
├── types/             # TypeScript definitions
├── utils/             # Helper functions
├── pkg/               # Third-party integrations
│   ├── logger/        # Winston logger
│   ├── prisma/        # Prisma client
│   └── swagger/       # OpenAPI generator
└── index.ts           # Application entry point
```

### Layer Responsibilities

- **Controllers** → Parse request, call service, return response
- **Services** → Business logic, validation, error handling
- **Repositories** → Database queries, data transformation
- **Entities** → Type definitions (Error, Query, User, etc.)
- **Middlewares** → Auth, validation, error handling, logging

## ✨ Key Features

### 1. Role-Based Access Control

- ADMIN: Full CRUD access
- USER: Read-only access
- Middleware-based role validation

### 2. Comprehensive Error Handling

- Custom error classes (AppError, BadRequestError)
- Prisma error mapping (P2002, P2025, etc.)
- Zod validation error translation
- Centralized error response formatting

### 3. Database Cascading

Relasi antar entity dengan cascade delete:

```
User → Employee: CASCADE (hapus user, employee ikut dihapus)
Department → Position → Employee: CASCADE
```

### 4. Swagger/OpenAPI Integration

- Auto-generated documentation dari Zod schemas
- Interactive API testing di browser
- Real-time spec updates

## 🔐 Authentication Flow

```
1. POST /auth/login → Get JWT token
2. Set header: Authorization: Bearer <token>
3. Middleware validasi token, extract user info
4. Request proceed dengan user context
```

**Token Payload:**

```json
{
  "id": "user-uuid",
  "role": "ADMIN|USER",
  "iat": 1234567890,
  "exp": 1234571490
}
```

## 📊 Database Schema

### Users

- id (UUID, Primary Key)
- email (String, Unique)
- username (String, Unique)
- password (String, Hashed with bcrypt)
- role (Enum: USER, ADMIN)
- createdAt, updatedAt

### Employees

- id (UUID, Primary Key)
- userId (UUID, FK to Users, Unique, CASCADE Delete)
- nik (String, Unique, 16 chars)
- fullName (String)
- dateOfBirth (Date)
- placeOfBirth (String)
- address (Text)
- phone (String)
- positionId (UUID, FK to Positions, CASCADE Delete)
- isActive (Boolean, default: true)
- createdAt, updatedAt

### Positions

- id (UUID, Primary Key)
- name (String)
- departmentId (UUID, FK to Departments, CASCADE Delete)
- createdAt, updatedAt

### Departments

- id (UUID, Primary Key)
- name (String, Unique)
- createdAt, updatedAt

## ⚠️ Trade-offs & Design Decisions

### 1. **Query Key Tidak Fully Dynamic** 🔒

**Issue**: Field filtering saat ini hanya support Employee model fields yang sudah di-hardcode di alias mapping. Client **tidak bisa query relational fields** seperti `user.email` atau `position.name` secara dinamis.

**Current Limitation**:

- ✅ Support: `fullName`, `nik`, `isActive`, `dateOfBirth` (direct fields)
- ❌ Not Support: `user.email`, `position.name`, `department.name` (relational)

**Why**: Prisma relational filtering lebih kompleks dan perlu join/include logic. Hardcoding lebih safe daripada allow arbitrary nested queries.

**Trade-off**:

- ✅ **Benefit**: More secure, prevent N+1 queries, easier to optimize
- ❌ **Cost**: Less flexible, client harus request feature baru untuk each relational field

**Future Improvement**:

- Whitelist specific relational fields (e.g. `allowedRelations: ['user', 'position']`)
- Support dot notation dengan auto include: `{ searchFilters: { 'position.name': 'Manager' } }`
- Query complexity limit untuk prevent abuse

### 2. **No Request Logging Body in Production** 🔒

**Decision**: Log body hanya di development untuk security.

**Benefit**: Hide sensitive data (password, token)
**Cost**: Lebih susah debug production issues

### 3. **JWT Expiry 1 Hour** ⏰

**Decision**: Token expire dalam 1 jam untuk security.

**Benefit**: Reduce token hijacking window
**Cost**: User harus re-login lebih sering

### 4. **No Redis Caching - Database Indexing Strategy** ⚡

**Decision**: Tidak implement Redis caching layer. Fokus pada database optimization dengan strategic indexing.

**Why**:

- Redis adds operational complexity (infra, monitoring, cache invalidation)
- Database indexing lebih cost-effective untuk dataset size kecil-medium
- Filtering engine sudah optimize dengan Prisma

**Trade-off**:

- ✅ **Benefit**: Simple architecture, fast enough untuk typical queries, no cache invalidation headaches
- ❌ **Cost**: Database disk usage (indexes), slower for extremely large datasets (>1M rows)

**When to Add Redis**:

- Query response time > 500ms for common filters
- Same queries executed 100+ times per hour
- High concurrent load (>100 RPS)

**Implementation Path** (Future):

1. Add `ioredis` to package.json
2. Create `pkg/redis/` module with singleton pattern
3. Implement cache layer in repository methods
4. Add cache invalidation on CREATE/UPDATE/DELETE

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 📦 Build & Deploy

```bash
# Build TypeScript
pnpm build

# Start production server
pnpm start

# Or dengan Docker
docker-compose up -d
```

## 🔍 Debugging

### Enable debug logging

```env
LOG_LEVEL=debug
```

### View Prisma queries

```env
DEBUG=prisma:*
```

### Inspect database

```bash
pnpm prisma studio
```

## 📝 Scripts

```bash
pnpm dev              # Start dev server dengan hot-reload
pnpm build            # Compile TypeScript
pnpm start            # Run production build
pnpm test             # Run unit tests
pnpm seed             # Seed database
pnpm prisma migrate   # Run migrations
pnpm prisma studio    # Open Prisma Studio UI
pnpm format           # Format code
pnpm typecheck        # Check TypeScript types
```

## 🚨 Known Issues & Limitations

1. **No Request Rate Limiting** - Gunakan reverse proxy (nginx) atau library (express-rate-limit)
2. **No CORS Whitelist** - Set CORS_ORIGIN di production
3. **Single Database Connection** - Perlu connection pooling untuk high traffic

## 👤 Author

Rangga Kristna

---

**Last Updated**: November 19, 2025
