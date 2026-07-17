MB Tech Labs — Software Business Operating System
A complete, production-ready platform for MB Tech Labs, a software development company. This is not just a website — it's a business operating system that handles client acquisition, project management, HR & recruitment, employee management, and client communication from a single integrated platform.
Table of Contents
Overview
Technology Stack
Architecture
Prerequisites
Installation
Environment Variables
Database Setup
Running the Project
Available Scripts
Project Structure
API Overview
Troubleshooting
Production Notes
License
Author
---
Overview
MB Tech Labs is a software development company that builds enterprise software, AI solutions, cloud platforms, and digital products. This platform serves as the company's complete digital infrastructure:
Main Features
Public Website
Premium landing page with animated WebGL shader background
Services, Industries, Process, FAQ, and Project Estimation sections
9-step Software Requirement Gathering (SRG) wizard with auto-save
Dedicated Careers portal with internship application system
Contact page with inquiry routing
Legal pages (Privacy, Terms, Pricing, Refund, Shipping policies)
Admin Dashboard (`/admin`)
CRM (Clients, Projects, SRG Submissions)
Proposal Builder with version history
Quotation Builder with line items, tax, discount
Invoice management with payment tracking
Team management
Analytics with real database queries
Talent Acquisition module
HR Dashboard (`/hr`)
Separate authentication and layout
Job posting management (publish to Careers page automatically)
Application review with candidate scorecard
Recruitment pipeline (Applied → Review → Technical → Offer → Intern → Employee)
Interview scheduling
Intern management and training
Certificate generation
Employee conversion
Employee Portal (`/employee`)
Personal dashboard with tasks and meetings
Project assignments
Task management
Notifications
Client Portal (`/client`)
Project tracking
Document access
Invoice history
Meeting schedules
Support tickets
---
Technology Stack
Layer	Technology
Frontend	Next.js 16 (App Router), React 19, TypeScript
Styling	Tailwind CSS 4, Framer Motion
UI Components	shadcn/ui, Lucide Icons
Forms	React Hook Form, Zod Validation
Backend	Next.js API Routes (Express.js architecture in `/backend`)
Database	SQLite (dev) → PostgreSQL (production)
ORM	Prisma 6
Authentication	JWT (jsonwebtoken), bcrypt
File Storage	Local (`/uploads`)
Build Tool	Bun
---
Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Public Website                        │
│  /  /about  /services  /projects  /careers  /contact    │
│              /start-project (SRG)                        │
└──────────────┬──────────────────────┬───────────────────┘
               │                      │
     ┌─────────▼──────────┐  ┌───────▼──────────┐
     │   Admin Dashboard   │  │   HR Dashboard    │
     │      /admin         │  │      /hr          │
     │  CRM · Projects     │  │  Jobs · Candidates│
     │  Proposals · Quotes │  │  Interviews       │
     │  Invoices · Team    │  │  Training · Certs │
     └─────────┬──────────┘  └───────┬──────────┘
               │                      │
     ┌─────────▼──────────┐  ┌───────▼──────────┐
     │  Employee Portal    │  │  Client Portal    │
     │     /employee       │  │     /client       │
     │  Tasks · Projects   │  │  Projects · Docs  │
     │  Meetings · Profile │  │  Invoices · Support│
     └─────────────────────┘  └───────────────────┘
               │                      │
               └──────────┬───────────┘
                          │
              ┌───────────▼───────────┐
              │    REST API Layer      │
              │  /api/auth · /api/hr   │
              │  /api/clients · /api/  │
              │  projects · /api/srg   │
              │  /api/careers · etc.   │
              └───────────┬───────────┘
                          │
              ┌───────────▼───────────┐
              │   Service Layer        │
              │  17 backend services   │
              │  Repository pattern    │
              └───────────┬───────────┘
                          │
              ┌───────────▼───────────┐
              │   Prisma ORM           │
              │   36 database models   │
              └───────────┬───────────┘
                          │
              ┌───────────▼───────────┐
              │   Database             │
              │   SQLite (dev)         │
              │   PostgreSQL (prod)    │
              └───────────────────────┘
```
Repository Pattern
All business logic follows the Repository Pattern:
```
API Route (route.ts)
    ↓
Controller (validates input, calls service)
    ↓
Service (business logic)
    ↓
Repository (Prisma database queries)
    ↓
Prisma (ORM)
    ↓
Database
```
---
Prerequisites
Node.js 18+ (recommended: 20+)
Bun (installed globally) — Install Bun
PostgreSQL 14+ (for production) — Install PostgreSQL
Git — Install Git
> **Note:** SQLite is used for local development by default. PostgreSQL is only required for production deployment.
---
Installation
1. Clone the repository
```bash
git clone https://github.com/mbtechlabs/mbtechlabs-platform.git
cd mbtechlabs-platform
```
2. Install frontend dependencies
```bash
bun install
```
3. Install backend dependencies (optional — backend runs within Next.js)
```bash
cd backend
bun install
cd ..
```
4. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` with your configuration (see Environment Variables).
5. Set up the database
```bash
# Generate Prisma Client
bunx prisma generate

# Create database tables
bunx prisma db push
```
6. Create the default admin user
```bash
# This happens automatically on first API call, or manually:
curl -X POST http://localhost:3000/api/init
```
---
Environment Variables
Create a `.env` file in the project root:
```env
# ─── Database ────────────────────────────────────────────
# SQLite for local development:
DATABASE_URL="file:./dev.db"

# PostgreSQL for production:
# DATABASE_URL="postgresql://user:password@localhost:5432/mbtechlabs?schema=public"

# ─── JWT Configuration ───────────────────────────────────
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_REFRESH_EXPIRES_IN="30d"

# ─── Default Admin (created on first run) ────────────────
DEFAULT_ADMIN_EMAIL="admin@mbtechlabs.com"
DEFAULT_ADMIN_PASSWORD="admin123"
DEFAULT_ADMIN_NAME="Admin User"

# ─── Server ──────────────────────────────────────────────
PORT=3000
NODE_ENV=development

# ─── File Uploads ────────────────────────────────────────
UPLOAD_DIR="./uploads"

# ─── CORS (for separate backend deployment) ──────────────
CORS_ORIGIN="http://localhost:3000"
```
Environment Variable Reference
Variable	Description	Default
`DATABASE_URL`	Database connection string	`file:./dev.db`
`JWT_SECRET`	Secret key for JWT access tokens	Required
`JWT_EXPIRES_IN`	Access token expiry duration	`7d`
`JWT_REFRESH_SECRET`	Secret key for refresh tokens	Required
`JWT_REFRESH_EXPIRES_IN`	Refresh token expiry duration	`30d`
`DEFAULT_ADMIN_EMAIL`	Default admin email (first run)	`admin@mbtechlabs.com`
`DEFAULT_ADMIN_PASSWORD`	Default admin password (first run)	`admin123`
`DEFAULT_ADMIN_NAME`	Default admin display name	`Admin User`
`PORT`	Server port	`3000`
`NODE_ENV`	Environment (`development` or `production`)	`development`
`UPLOAD_DIR`	File upload directory path	`./uploads`
`CORS_ORIGIN`	Allowed CORS origin	`http://localhost:3000`
---
Database Setup
Using SQLite (Local Development — Default)
SQLite requires no installation. The database file is created automatically:
```bash
# Generate Prisma Client
bunx prisma generate

# Push schema to SQLite database
bunx prisma db push
```
The database file will be created at `db/custom.db`.
Using PostgreSQL (Production)
Install PostgreSQL on your system
Create a database:
```sql
CREATE DATABASE mbtechlabs;
CREATE USER mbtechlabs_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mbtechlabs TO mbtechlabs_user;
```
Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"    // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```
Update `.env`:
```env
DATABASE_URL="postgresql://mbtechlabs_user:your_password@localhost:5432/mbtechlabs?schema=public"
```
Run migrations:
```bash
bunx prisma generate
bunx prisma migrate dev --name init
```
Prisma Studio (Database GUI)
```bash
bunx prisma studio
```
Opens a web interface at `http://localhost:5555` to view and edit database records.
---
Running the Project
Start the development server
```bash
bun run dev
```
The application will be available at:
Portal	URL
Public Website	http://localhost:3000
Admin Dashboard	http://localhost:3000/admin
HR Dashboard	http://localhost:3000/hr
Employee Portal	http://localhost:3000/employee
Client Portal	http://localhost:3000/client
Start Project (SRG)	http://localhost:3000/start-project
Careers	http://localhost:3000/careers
Prisma Studio	http://localhost:5555
Default Login Credentials
Portal	Email	Password
Admin	`admin@mbtechlabs.com`	`admin123`
HR	`admin@mbtechlabs.com`	`admin123`
Employee	`admin@mbtechlabs.com`	`admin123`
Client	`admin@mbtechlabs.com`	`admin123`
> **Note:** The default admin has `SUPER_ADMIN` role with access to all portals. Create separate users with appropriate roles for production use.
Initialize the database (first run)
```bash
# Create default admin user
curl -X POST http://localhost:3000/api/init
```
---
Available Scripts
Frontend (root directory)
```bash
# Development server
bun run dev

# Production build
bun run build

# Start production server
bun run start

# Run ESLint
bun run lint

# Database operations
bun run db:push       # Push schema to database
bun run db:generate   # Generate Prisma Client
bun run db:migrate    # Create and apply migration
bun run db:reset      # Reset database (destructive)
```
Prisma Commands
```bash
# Generate Prisma Client
bunx prisma generate

# Push schema changes to database (no migration files)
bunx prisma db push

# Create a migration
bunx prisma migrate dev --name <migration_name>

# Apply migrations in production
bunx prisma migrate deploy

# Open Prisma Studio (database GUI)
bunx prisma studio

# Reset database (WARNING: deletes all data)
bunx prisma migrate reset
```
Backend (backend/ directory — optional separate Express server)
```bash
cd backend

# Install dependencies
bun install

# Development server
bun run dev

# Build
bun run build

# Start production server
bun run start

# Generate Prisma Client
bun run prisma:generate

# Push schema
bun run prisma:push
```
---
Project Structure
```
mbtechlabs-platform/
├── prisma/
│   └── schema.prisma              # 36 database models with relations
│
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── page.tsx               # Homepage
│   │   ├── about/                 # About page
│   │   ├── services/              # Services page
│   │   ├── projects/              # Projects portfolio
│   │   ├── careers/               # Careers portal
│   │   │   ├── page.tsx           # 11-section careers page
│   │   │   ├── [id]/              # Job detail page
│   │   │   │   └── apply/         # 9-step application wizard
│   │   │   └── ...
│   │   ├── contact/               # Contact page
│   │   ├── start-project/         # SRG wizard
│   │   ├── privacy-policy/        # Legal pages
│   │   ├── terms/
│   │   ├── pricing-policy/
│   │   ├── refund-cancellation/
│   │   ├── shipping-delivery/
│   │   ├── technologies/
│   │   ├── not-found.tsx          # 404 page
│   │   │
│   │   ├── admin/                 # Admin Dashboard
│   │   │   ├── layout.tsx         # Admin shell with sidebar
│   │   │   ├── login/             # Admin JWT login
│   │   │   ├── page.tsx           # Dashboard with real stats
│   │   │   ├── clients/           # CRM
│   │   │   ├── projects/          # Project management
│   │   │   ├── submissions/       # SRG submissions
│   │   │   ├── proposals/         # Proposal builder
│   │   │   ├── quotations/        # Quotation builder
│   │   │   ├── invoices/          # Invoice management
│   │   │   ├── team/              # Team management
│   │   │   ├── analytics/         # Real database analytics
│   │   │   ├── calendar/          # Calendar
│   │   │   ├── notifications/     # Notifications
│   │   │   ├── settings/          # Settings
│   │   │   └── talent/            # Talent acquisition module
│   │   │
│   │   ├── hr/                    # HR Dashboard (separate portal)
│   │   │   ├── layout.tsx         # HR shell with sidebar
│   │   │   ├── login/             # HR JWT login
│   │   │   ├── page.tsx           # HR dashboard with stats
│   │   │   ├── jobs/              # Job post management
│   │   │   ├── applications/      # Application review
│   │   │   │   └── [id]/          # Candidate detail + scorecard
│   │   │   ├── candidates/        # Candidate pool
│   │   │   ├── interviews/        # Interview scheduling
│   │   │   ├── offers/            # Offer letters
│   │   │   ├── interns/           # Intern management
│   │   │   ├── training/          # Training batches
│   │   │   ├── employees/         # Employee records
│   │   │   ├── certificates/      # Certificate generation
│   │   │   ├── reports/           # HR analytics
│   │   │   ├── calendar/          # HR calendar
│   │   │   ├── notifications/     # HR notifications
│   │   │   └── settings/          # HR settings
│   │   │
│   │   ├── employee/              # Employee Portal
│   │   │   ├── layout.tsx         # Employee shell
│   │   │   ├── login/             # Employee JWT login
│   │   │   ├── page.tsx           # Employee dashboard
│   │   │   ├── projects/          # Assigned projects
│   │   │   ├── tasks/             # Task management
│   │   │   ├── meetings/          # Meetings
│   │   │   ├── notifications/     # Notifications
│   │   │   └── profile/           # Profile settings
│   │   │
│   │   ├── client/                # Client Portal
│   │   │   ├── layout.tsx         # Client shell
│   │   │   ├── login/             # Client JWT login
│   │   │   ├── page.tsx           # Client dashboard
│   │   │   ├── projects/          # Project tracking
│   │   │   ├── documents/         # Document access
│   │   │   ├── invoices/          # Invoice history
│   │   │   ├── meetings/          # Meeting schedule
│   │   │   ├── support/           # Support tickets
│   │   │   ├── notifications/     # Notifications
│   │   │   └── profile/           # Profile settings
│   │   │
│   │   └── api/                   # REST API routes (40 endpoints)
│   │       ├── auth/              # Authentication
│   │       ├── dashboard/         # Dashboard stats
│   │       ├── analytics/         # Analytics data
│   │       ├── search/            # Global search
│   │       ├── clients/           # Client CRUD
│   │       ├── projects/          # Project CRUD
│   │       ├── srg/               # SRG submissions
│   │       ├── proposals/         # Proposal CRUD
│   │       ├── quotations/        # Quotation CRUD
│   │       ├── invoices/          # Invoice CRUD
│   │       ├── tasks/             # Task CRUD
│   │       ├── team/              # Team CRUD
│   │       ├── meetings/          # Meeting CRUD
│   │       ├── notifications/     # Notification CRUD
│   │       ├── files/             # File upload/download
│   │       ├── careers/           # Careers (positions, applications)
│   │       ├── hr/                # HR (stats, jobs, applications)
│   │       └── init/              # Database initialization
│   │
│   ├── modules/
│   │   ├── backend/               # Backend business logic
│   │   │   ├── services/          # 17 service classes
│   │   │   ├── middlewares/       # Auth, error handling
│   │   │   ├── utils/             # JWT, API error, CRUD factory
│   │   │   └── types/             # Shared types
│   │   │
│   │   ├── admin/                 # Admin module (context, components)
│   │   │   ├── context/           # AdminContext for state
│   │   │   ├── components/        # Admin UI components
│   │   │   └── services/          # Admin-specific services
│   │   │
│   │   └── srg/                   # SRG (Software Requirement Gathering)
│   │       ├── templates/         # 7 dynamic templates
│   │       ├── engine/            # Runtime engine (validation, conditions)
│   │       ├── services/          # Storage, uploads, API connector
│   │       ├── context/           # SRGContext for state
│   │       └── components/        # SRG wizard components
│   │
│   ├── components/
│   │   ├── mb-tech-labs/          # Public website components
│   │   │   ├── ShaderBackground.tsx    # WebGL animated background
│   │   │   ├── FloatingNav.tsx         # Glassmorphism navigation
│   │   │   ├── Hero.tsx                # Hero section
│   │   │   ├── ProjectEstimation.tsx   # Project estimation process
│   │   │   ├── LegalPageLayout.tsx     # Reusable legal page layout
│   │   │   ├── Footer.tsx              # Premium 5-section footer
│   │   │   └── ...                     # 16 components total
│   │   └── ui/                    # shadcn/ui components
│   │
│   ├── lib/
│   │   ├── api/                   # Frontend API service layer
│   │   │   ├── client.ts          # Axios-like fetch wrapper with JWT
│   │   │   ├── auth.ts            # Auth API service
│   │   │   ├── clients.ts         # Clients API service
│   │   │   ├── projects.ts        # Projects API service
│   │   │   ├── srg.ts             # SRG API service
│   │   │   ├── careers.ts         # Careers API service
│   │   │   ├── hr.ts              # HR API service
│   │   │   ├── dashboard.ts       # Dashboard API service
│   │   │   ├── analytics.ts       # Analytics API service
│   │   │   └── ...                # 18 API service files
│   │   ├── db.ts                  # Prisma Client singleton
│   │   └── utils.ts               # Utility functions
│   │
│   └── hooks/                     # Custom React hooks
│
├── backend/                       # Separate Express.js backend (optional)
│   ├── src/
│   │   ├── config/                # Configuration
│   │   ├── controllers/           # Express controllers
│   │   ├── routes/                # Express routes
│   │   ├── middlewares/           # Express middlewares
│   │   ├── services/              # Business logic
│   │   ├── repositories/          # Data access
│   │   ├── validators/            # Zod validators
│   │   ├── prisma/                # Prisma schema (mirror)
│   │   ├── utils/                 # Utilities
│   │   ├── types/                 # TypeScript types
│   │   └── server.ts              # Express server entry
│   ├── prisma/
│   │   └── schema.prisma          # Prisma schema (mirror)
│   ├── uploads/                   # File uploads directory
│   ├── logs/                      # Log files
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── db/                            # SQLite database file (dev)
├── uploads/                       # File uploads (frontend)
├── public/                        # Static assets
│   └── MBTechLabsLogo.png         # Company logo
│
├── prisma/
│   └── schema.prisma              # Main Prisma schema (36 models)
│
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Frontend dependencies
└── README.md                      # This file
```
---
API Overview
All APIs return consistent JSON responses:
```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Resource not found" } }

// Paginated
{ "success": true, "data": [...], "meta": { "page": 1, "pageSize": 20, "total": 50, "totalPages": 3 } }
```
Authentication APIs
Method	Endpoint	Description	Auth
POST	`/api/auth/login`	Login with email/password	Public
POST	`/api/auth/refresh`	Refresh access token	Public
GET	`/api/auth/profile`	Get current user profile	Required
POST	`/api/auth/logout`	Logout (invalidate session)	Required
POST	`/api/init`	Create default admin user	Public
Admin APIs
Method	Endpoint	Description
GET	`/api/dashboard`	Dashboard statistics
GET	`/api/dashboard/activity`	Recent activity feed
GET	`/api/analytics`	Analytics data (revenue, charts)
GET	`/api/search?q=`	Global search across all entities
GET/POST	`/api/clients`	List/Create clients
GET/PUT/DELETE	`/api/clients/:id`	Get/Update/Delete client
GET/POST	`/api/projects`	List/Create projects
GET/PUT/DELETE	`/api/projects/:id`	Get/Update/Delete project
GET/POST	`/api/srg`	List/Create SRG submissions
GET/PUT/DELETE	`/api/srg/:id`	Get/Update/Delete SRG
GET/POST	`/api/proposals`	List/Create proposals
GET/PUT/DELETE	`/api/proposals/:id`	Get/Update/Delete proposal
GET/POST	`/api/quotations`	List/Create quotations
GET/PUT/DELETE	`/api/quotations/:id`	Get/Update/Delete quotation
GET/POST	`/api/invoices`	List/Create invoices
GET/PUT/DELETE	`/api/invoices/:id`	Get/Update/Delete invoice
GET/POST	`/api/tasks`	List/Create tasks
GET/PUT/DELETE	`/api/tasks/:id`	Get/Update/Delete task
GET/POST	`/api/team`	List/Create team members
GET/PUT/DELETE	`/api/team/:id`	Get/Update/Delete team member
GET/POST	`/api/meetings`	List/Create meetings
GET/PUT/DELETE	`/api/meetings/:id`	Get/Update/Delete meeting
GET/PATCH/DELETE	`/api/notifications`	List/Mark read/Delete notifications
GET/POST	`/api/files`	List/Upload files
GET/DELETE	`/api/files/:id`	Get metadata/Delete file
GET	`/api/files/:id?download=true`	Download file
HR APIs
Method	Endpoint	Description
GET	`/api/hr/stats`	HR dashboard statistics
GET/POST	`/api/hr/jobs`	List/Create job posts
GET/PUT/DELETE	`/api/hr/jobs/:id`	Get/Update/Delete job post
GET	`/api/hr/applications`	List applications
GET/PUT	`/api/hr/applications/:id`	Get/Update application status
Careers APIs (Public)
Method	Endpoint	Description	Auth
GET	`/api/careers/positions`	List published positions	Public
GET	`/api/careers/positions/:id`	Get position details	Public
POST	`/api/careers/applications`	Submit application	Public
GET	`/api/careers/stats`	HR dashboard stats	Required
---
Troubleshooting
Database Connection Issues
Problem: `PrismaClientInitializationError: Can't reach database server`
Solution (SQLite):
```bash
# Delete the database file and recreate
rm db/custom.db
bunx prisma db push
```
Solution (PostgreSQL):
```bash
# Verify PostgreSQL is running
pg_isready

# Check your DATABASE_URL in .env
# Format: postgresql://user:password@localhost:5432/dbname?schema=public

# Test connection
psql -U user -d mbtechlabs -h localhost
```
Prisma Migration Issues
Problem: `Migration failed to apply cleanly`
```bash
# Reset database (WARNING: deletes all data)
bunx prisma migrate reset

# Or force push schema without migrations
bunx prisma db push --force-reset
```
Port Conflicts
Problem: `Port 3000 is already in use`
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 bun run dev
```
Environment Variable Errors
Problem: `Environment variable not found`
```bash
# Ensure .env file exists
cp .env.example .env

# Verify variables are loaded
cat .env

# Restart the dev server
bun run dev
```
Build Errors
Problem: `TypeScript compilation errors`
```bash
# The project ignores build errors by default (next.config.ts)
# To see all errors:
bunx tsc --noEmit

# To fix lint errors:
bun run lint --fix
```
Prisma Client Not Generated
Problem: `Cannot find module '@prisma/client'` or `prisma is not defined`
```bash
# Regenerate Prisma Client
bunx prisma generate

# Restart the dev server
bun run dev
```
File Upload Issues
Problem: `Upload directory does not exist`
```bash
# Create the uploads directory
mkdir -p uploads

# Ensure write permissions
chmod 755 uploads
```
---
Production Notes
PostgreSQL Configuration
Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mbtechlabs?schema=public"
JWT_SECRET="use-a-strong-random-secret-here"
JWT_REFRESH_SECRET="use-a-different-strong-random-secret"
NODE_ENV="production"
```
Run migrations:
```bash
bunx prisma migrate deploy
bunx prisma generate
```
Build Commands
```bash
# Build the frontend
bun run build

# Start production server
bun run start
```
Deployment Recommendations
Frontend: Deploy to Vercel, Netlify, or any Node.js hosting
Backend: Deploy the Express.js backend separately (in `/backend`) or keep as Next.js API routes
Database: Use a managed PostgreSQL service (Supabase, Neon, Railway — all have free tiers)
File Storage: Migrate from local `/uploads` to S3, Cloudinary, or Vercel Blob
Email: Connect Resend (free tier) or Gmail SMTP through the EmailService abstraction
Real-time: Add Socket.IO for live notifications
Security: Add Helmet, rate limiting, and CORS configuration for production
Switching Database Provider
The entire system uses Prisma ORM with the Repository Pattern. To switch from SQLite to PostgreSQL:
Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
Update `DATABASE_URL` in `.env`
Run `bunx prisma migrate dev`
No application code changes required
---
License
This project is proprietary software owned by MB Tech Labs. All rights reserved.
© 2025 MB Tech Labs. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.
---
Author
MB Tech Labs
Website: mbtechlabs.com
Email: hello@mbtechlabs.com
LinkedIn: linkedin.com/company/mbtechlabs
GitHub: github.com/mbtechlabs
Instagram: instagram.com/mbtechlabs
> Engineering Tomorrow's Digital Future.
