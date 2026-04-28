# 17_Folder_Structure.md

# MB Tech Labs - Folder Structure

## Overview

The folder structure for MB Tech Labs is designed to support the modular architecture across frontend, backend, and deployment environments. The structure promotes code organization, scalability, and maintainability while following industry best practices for each technology stack.

## Root Directory Structure

```
MB_Tech_Labs/
├── Docs/                          # Documentation files
├── frontend/                      # Frontend application (Vite + TypeScript)
├── backend/                       # Backend application (Django)
├── deployment/                    # Deployment configurations
├── docker/                        # Docker configurations
├── scripts/                       # Utility scripts
├── .github/                       # GitHub configurations
├── .gitignore                     # Git ignore rules
├── README.md                      # Project README
└── LICENSE                        # Project license
```

## Frontend Folder Structure

```
frontend/
├── public/                        # Static assets
│   ├── favicon.ico
│   ├── robots.txt
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
├── src/
│   ├── components/                # Reusable UI components
│   │   ├── common/               # Generic components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── Loading/
│   │   ├── layout/               # Layout components
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   └── Navigation/
│   │   └── modules/              # Feature-specific components
│   │       ├── auth/
│   │       ├── dashboard/
│   │       ├── projects/
│   │       ├── billing/
│   │       └── communication/
│   ├── pages/                     # Page components
│   │   ├── public/               # Public website pages
│   │   │   ├── Home/
│   │   │   ├── Services/
│   │   │   ├── Portfolio/
│   │   │   └── Contact/
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   └── PasswordReset/
│   │   ├── client/               # Client portal pages
│   │   │   ├── Dashboard/
│   │   │   ├── Projects/
│   │   │   ├── Billing/
│   │   │   └── Messages/
│   │   ├── employee/             # Employee workspace pages
│   │   │   ├── Dashboard/
│   │   │   ├── Tasks/
│   │   │   ├── TimeTracking/
│   │   │   └── Team/
│   │   ├── admin/                # Admin dashboard pages
│   │   │   ├── Overview/
│   │   │   ├── Users/
│   │   │   ├── Projects/
│   │   │   └── Analytics/
│   │   └── saas/                 # SaaS platform pages
│   │       ├── Marketplace/
│   │       ├── Subscriptions/
│   │       └── Products/
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useProjects.ts
│   │   └── useNotifications.ts
│   ├── services/                  # API service functions
│   │   ├── api.ts                # Base API configuration
│   │   ├── auth.ts               # Authentication services
│   │   ├── projects.ts           # Project services
│   │   ├── billing.ts            # Billing services
│   │   ├── communication.ts      # Communication services
│   │   └── notifications.ts      # Notification services
│   ├── stores/                    # State management
│   │   ├── authStore.ts
│   │   ├── projectStore.ts
│   │   ├── uiStore.ts
│   │   └── notificationStore.ts
│   ├── utils/                     # Utility functions
│   │   ├── constants.ts          # Application constants
│   │   ├── helpers.ts            # Helper functions
│   │   ├── validation.ts         # Form validation
│   │   └── formatters.ts         # Data formatters
│   ├── types/                     # TypeScript type definitions
│   │   ├── api.ts                # API response types
│   │   ├── models.ts             # Data model types
│   │   └── components.ts         # Component prop types
│   ├── styles/                    # Global styles
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── themes.css
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   └── router.tsx                 # Application routing
├── tests/                         # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
├── .env.example                  # Environment variables template
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── index.html                    # HTML template
```

## Backend Folder Structure

```
backend/
├── mbtechlabs/                   # Main Django project
│   ├── __init__.py
│   ├── settings.py              # Django settings
│   ├── urls.py                  # Main URL configuration
│   ├── wsgi.py                  # WSGI configuration
│   └── asgi.py                  # ASGI configuration
├── apps/                        # Django applications
│   ├── accounts/                # User accounts and authentication
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── tests.py
│   │   └── apps.py
│   ├── projects/                # Project management
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── tests.py
│   │   └── apps.py
│   ├── tasks/                   # Task management
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── tests.py
│   │   └── apps.py
│   ├── billing/                 # Billing and invoicing
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── tests.py
│   │   └── apps.py
│   ├── communication/           # Messaging and chat
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── tests.py
│   │   └── apps.py
│   ├── notifications/           # Notification system
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── tests.py
│   │   └── apps.py
│   ├── saas/                    # SaaS platform
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── tests.py
│   │   └── apps.py
│   └── api/                     # API configuration
│       ├── v1/
│       │   ├── urls.py
│       │   └── views.py
│       ├── serializers.py
│       ├── permissions.py
│       ├── pagination.py
│       └── filters.py
├── static/                      # Static files
│   ├── css/
│   ├── js/
│   └── images/
├── media/                       # User-uploaded files
├── templates/                   # Django templates (if needed)
├── utils/                       # Utility functions
│   ├── email.py                 # Email utilities
│   ├── payment.py               # Payment processing
│   ├── file_upload.py           # File handling
│   └── notifications.py         # Notification helpers
├── config/                      # Configuration files
│   ├── celery.py                # Celery configuration
│   ├── logging.py               # Logging configuration
│   └── cache.py                 # Cache configuration
├── tests/                       # Test files
│   ├── conftest.py
│   ├── test_accounts.py
│   ├── test_projects.py
│   ├── test_billing.py
│   └── test_api.py
├── requirements/                # Requirements files
│   ├── base.txt
│   ├── development.txt
│   ├── production.txt
│   └── testing.txt
├── scripts/                     # Management scripts
│   ├── setup_database.py
│   ├── seed_data.py
│   └── backup.py
├── .env.example                # Environment variables
├── manage.py                   # Django management script
├── pytest.ini                  # Pytest configuration
├── Dockerfile                  # Docker configuration
└── docker-compose.yml          # Docker Compose
```

## Deployment Folder Structure

```
deployment/
├── docker/                     # Docker configurations
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── Dockerfile.nginx
│   └── docker-compose.yml
├── kubernetes/                 # Kubernetes manifests
│   ├── frontend-deployment.yml
│   ├── backend-deployment.yml
│   ├── database-deployment.yml
│   └── ingress.yml
├── ansible/                    # Ansible playbooks
│   ├── inventory/
│   ├── playbooks/
│   │   ├── deploy.yml
│   │   ├── setup.yml
│   │   └── rollback.yml
│   └── roles/
├── terraform/                  # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── modules/
├── nginx/                      # Nginx configurations
│   ├── nginx.conf
│   ├── sites-available/
│   └── ssl/
├── ssl/                        # SSL certificates
│   ├── cert.pem
│   ├── key.pem
│   └── dhparam.pem
├── monitoring/                 # Monitoring configurations
│   ├── prometheus.yml
│   ├── grafana/
│   └── alertmanager.yml
├── backups/                    # Backup configurations
│   ├── database_backup.sh
│   ├── file_backup.sh
│   └── restore.sh
└── scripts/                    # Deployment scripts
    ├── deploy.sh
    ├── rollback.sh
    └── health_check.sh
```

## Docker Folder Structure

```
docker/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── backend/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   └── .dockerignore
├── database/
│   ├── Dockerfile
│   ├── init.sql
│   └── .dockerignore
├── docker-compose.yml          # Development environment
├── docker-compose.prod.yml     # Production environment
└── .env                        # Docker environment variables
```

## Scripts Folder Structure

```
scripts/
├── development/                # Development scripts
│   ├── setup_dev.sh
│   ├── reset_db.sh
│   ├── seed_data.py
│   └── run_tests.sh
├── deployment/                 # Deployment scripts
│   ├── deploy_frontend.sh
│   ├── deploy_backend.sh
│   ├── database_migration.sh
│   └── health_check.sh
├── maintenance/                # Maintenance scripts
│   ├── backup_database.sh
│   ├── cleanup_logs.sh
│   ├── optimize_database.sh
│   └── update_dependencies.sh
├── monitoring/                 # Monitoring scripts
│   ├── check_disk_usage.sh
│   ├── monitor_services.sh
│   ├── log_analysis.py
│   └── performance_report.sh
└── utilities/                  # Utility scripts
    ├── generate_api_docs.py
    ├── export_data.py
    ├── import_data.py
    └── send_notifications.py
```

## GitHub Folder Structure

```
.github/
├── workflows/                  # GitHub Actions
│   ├── ci.yml                 # Continuous integration
│   ├── cd.yml                 # Continuous deployment
│   ├── security.yml           # Security scanning
│   └── testing.yml            # Automated testing
├── ISSUE_TEMPLATE/            # Issue templates
│   ├── bug_report.md
│   ├── feature_request.md
│   └── security_report.md
├── PULL_REQUEST_TEMPLATE.md   # Pull request template
├── CODEOWNERS                 # Code ownership rules
├── dependabot.yml             # Dependency updates
└── FUNDING.yml                # Funding configuration
```

## Configuration Files

### Root Level Configuration
```
MB_Tech_Labs/
├── .editorconfig              # Editor configuration
├── .pre-commit-config.yaml    # Pre-commit hooks
├── .python-version            # Python version specification
├── pyproject.toml             # Python project configuration
├── poetry.lock                # Poetry lock file (alternative)
├── package-lock.json          # NPM lock file
└── .nvmrc                     # Node.js version
```

### Environment Files
```
MB_Tech_Labs/
├── .env.example               # Environment template
├── .env.development           # Development environment
├── .env.staging               # Staging environment
└── .env.production           # Production environment
```

## File Naming Conventions

### General Rules
- Use lowercase with hyphens for file names: `user-profile.ts`
- Use PascalCase for component files: `UserProfile.tsx`
- Use camelCase for utility files: `formatDate.ts`
- Use kebab-case for directories: `user-management/`

### Specific Conventions
- **Components**: `ComponentName.tsx`
- **Hooks**: `useHookName.ts`
- **Services**: `serviceName.ts`
- **Types**: `typeName.ts`
- **Utils**: `utilityName.ts`
- **Tests**: `componentName.test.ts`

## Module Organization Principles

### Separation of Concerns
- **Components**: UI logic only
- **Services**: API communication
- **Stores**: State management
- **Utils**: Pure functions
- **Types**: Type definitions

### Import Organization
```typescript
// External imports
import React from 'react';
import { useState } from 'react';

// Internal imports
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/formatters';
import type { User } from '@/types/models';
```

This folder structure provides a scalable, maintainable foundation for MB Tech Labs development, supporting the modular architecture and future growth of the platform.