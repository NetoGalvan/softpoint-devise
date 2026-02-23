A full-stack web application for managing real estate properties, built with
Laravel (Backend APIs) and React + TypeScript (Frontend).

## TECH STACK

### BACKEND
- **Laravel 12** - PHP Framework
- **PHP 8.3** - Programming Language
- **PostgreSQL 16** - Database
- **Laravel Sanctum** - API Authentication **Bearer token**
- **Queue System** - Background job processing Database

### FRONTEND
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite 5** - Build Tool
- **TailwindCSS** - Styling
- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **Chart.js** - Data Visualization
- **React Router v6** - Client-side Routing

### DEVOPS
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server (production)

---

## PREREQUISITES

Before you begin, ensure you have the following installed on your system:

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
  - Download: https://www.docker.com/products/docker-desktop/
  - Minimum version: 20.10+

- **Docker Compose**
  - Usually included with Docker Desktop
  - Minimum version: 1.29+

- **Git** (for cloning the repository)

**Verify installations:**

```bash
docker --version
# Expected: Docker version 24.x.x or higher

docker-compose --version
# Expected: docker-compose version 1.29.x or higher
```

---

## INSTALATION

### Step 1: Clone or Download the Project

```bash
# If you have Git installed:
git clone https://github.com/NetoGalvan/softpoint-devise.git
cd softpoint-devise

```

## Environment Configuration

### BACKEND CONFIGURATION

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Copy environment file:**

```bash
# On Linux/Mac:
cp .env.example .env

# On Windows (PowerShell):
copy .env.example .env
```

3. **Edit `.env` file with the following configuration:**

**Required Settings:**

```env
# Database (Docker PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=property_management
DB_USERNAME=softpoint_user
DB_PASSWORD=softpoint_secret_pass

# Queue
QUEUE_CONNECTION=database

# Session
SESSION_DRIVER=database
SESSION_DOMAIN=localhost

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Optional Settings (Email Notifications):**

To enable email notifications, you need a Mailtrap account (free):

1. Go to https://mailtrap.io/ and create a free account
2. Navigate to **Email Testing → Inboxes → My Inbox**
3. Select **Laravel 9+** from the integrations dropdown
4. Copy your credentials and add to `.env`:

```env
# Mail Configuration (Mailtrap - Optional)
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@property-management.local
MAIL_FROM_NAME="Property Management"
```

**Note:** If you skip this step, the application will work normally but email notifications will be logged instead of sent.

---

### FRONTEND CONFIGURATION

1. **Navigate to frontend directory:**

```bash
cd ../frontend
```

2. **Copy environment file:**

```bash
# On Linux/Mac:
cp .env.example .env

# On Windows (PowerShell):
copy .env.example .env
```

3. **Edit `.env` file:**

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Property Management
VITE_ENV=development
```

**Note:** Usually, you don't need to change these values for local development.

---

## DATABASE SETUP

### Step 1: Build and Start Docker Containers

From the **project root** directory: ~/softpoint-devise/

```bash
# Build Docker images (first time only)
docker-compose build

# Start all services
docker-compose up -d

```
**Verify containers are running:**

```bash
docker-compose ps

# You should see 4 services running:
# - softpoint_postgres (PostgreSQL database)
# - softpoint_backend (Laravel API)
# - softpoint_queue (Queue worker)
# - softpoint_frontend (React app)
```

### Step 2: Generate Application Key

```bash
docker-compose exec backend php artisan key:generate
```

### Step 3: Run Database Migrations

This creates all required tables:

```bash
docker-compose exec backend php artisan migrate
```

### Step 4: Seed Database with Sample Data

This creates test users and sample properties:

```bash
docker-compose exec backend php artisan db:seed
```

**TEST CREDENTIALS:**
- Email: `egalvan@example.com`
- Password: `password`

## 🎮 Running the Application

### Verify All Services are Running

```bash
docker-compose ps

```

### ACCESS THE APPLICATION

1. **Frontend (React):** http://localhost:5173
   - Login page will be displayed

2. **Backend API:** http://localhost:8000
   - Health check: http://localhost:8000/api/health


---


## ARCHITECTURE

```
┌─────────────────┐
│   React + TS    │  Frontend (Port 5173)
│   (Frontend)    │  - React 18 + TypeScript
└────────┬────────┘  - Vite build tool
         │           - TailwindCSS styling
         │ HTTP/JSON
         ▼
┌─────────────────┐
│  Laravel API    │  Backend (Port 8000)
│   (Backend)     │  - RESTful API
└────────┬────────┘  - Laravel Sanctum auth
         │           - Bearer token
         │
    ┌────┴────┬──────────────┐
    ▼         ▼              ▼
┌────────┐ ┌────────┐  ┌────────┐
│Postgres│ │ Queue  │  │ Mail   │
│  DB    │ │Worker  │  │(Mailtrap)
└────────┘ └────────┘  └────────┘
```

---

### Backend Architecture

**Pattern:** RESTful API with Repository-like structure

```
backend/
├── app/
│   ├── Http/
│   │   └── Controllers/      # API Controllers
│   │       ├── AuthController.php
│   │       ├── PropertyController.php
│   │       └── DashboardController.php
│   │
│   ├── Models/               # Eloquent Models
│   │   ├── User.php
│   │   └── Property.php
│   │
│   ├── Jobs/                 # Queue Jobs
│   │   └── PropertyCreatedJob.php
│   │
│   └── Mail/                 # Email Templates
│       └── PropertyCreatedMail.php
│
├── database/
│   ├── migrations/           # Database schema
│   ├── seeders/              # Test data
│   └── factories/            # Model factories
│
├── routes/
│   └── api.php               # API routes
│
└── tests/                    # Automated tests
    ├── Feature/
    └── Unit/
```


---

### Frontend Architecture

**Pattern:** Component-based architecture with Context API for state

```
frontend/
├── src/
│   ├── api/                  # API client layer
│   │   ├── client.ts         # HTTP client (fetch)
│   │   ├── auth.ts           # Auth endpoints
│   │   ├── properties.ts     # Property endpoints
│   │   └── dashboard.ts      # Dashboard endpoints
│   │
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── forms/            # Form components
│   │   │   ├── Select.tsx
│   │   │   └── TextArea.tsx
│   │   │
│   │   └── layout/           # Layout components
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       └── DashboardLayout.tsx
│   │
│   ├── contexts/             # React Context
│   │   └── AuthContext.tsx   # Authentication state
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useToast.ts
│   │
│   ├── pages/                # Page components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── properties/
│   │
│   ├── routes/               # Routing
│   │   ├── AppRoutes.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── PublicRoute.tsx
│   │
│   ├── types/                # TypeScript types
│   │   ├── auth.ts
│   │   ├── property.ts
│   │   └── api.ts
│   │
│   └── utils/                # Utility functions
│       ├── formatters.ts
│       └── constants.ts
```


### Clear All Caches

If experiencing strange behavior:

```bash
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan route:clear
docker-compose exec backend php artisan view:clear
docker-compose restart backend frontend queue
```

## RUNING TEST

The application includes automated tests for the backend API.
```bash
docker-compose exec backend php artisan test --env=testing
```

**Last Updated:** February 2026
