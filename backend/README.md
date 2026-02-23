### BACKEND
- **Laravel 12** - PHP Framework
- **PHP 8.3** - Programming Language
- **PostgreSQL 16** - Database
- **Laravel Sanctum** - API Authentication **Bearer token**
- **Queue System** - Background job processing Database


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
