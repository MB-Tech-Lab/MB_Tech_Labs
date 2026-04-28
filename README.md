# MB Tech Labs

## Overview
MB Tech Labs is a unified IT business platform built to serve modern freelance services, client management, employee collaboration, SaaS operations, and developer tooling.

This platform combines:
- Freelancing service marketplace for web, mobile, and desktop development
- Client management and billing system for project tracking
- Employee workspace with task management and collaboration tools
- Admin control center for analytics and monitoring
- SaaS product platform with subscription management
- Developer platform with API key issuance and usage tracking

MB Tech Labs is structured as a hybrid ERP/CRM/project management ecosystem designed for business owners, clients, and internal teams.

## Tech Stack
**Frontend**
- Vite + TypeScript
- Hosted on Vercel

**Backend**
- Python Django REST API
- Hosted on Hostinger VPS

**Database**
- MySQL on the same VPS

## Project Structure
- `/Docs` → System documentation and design guidance
- `/frontend` → Vite + TypeScript application
- `/backend` → Django REST API and service backend
- `/database` → Schema definitions and migration assets

## Core Features

### 🌐 Public Website
- Services showcase for development offerings
- Portfolio and case studies
- Lead generation forms and contact capture
- Authentication for clients, employees, and admins

### 🧑‍💼 Client Portal
- Project tracking and milestone visibility
- Billing, invoices, and UPI payment workflows
- Secure file sharing and document exchange
- Feedback collection and approval workflows

### 👨‍💻 Employee Workspace
- Task assignment and Kanban-style management
- Role-based dashboards tailored to responsibilities
- Time tracking and work log reporting
- Internal communication and collaboration tools

### 👑 Admin Dashboard
- Business analytics and operational monitoring
- Client account and project administration
- Employee performance and capacity oversight
- Billing control, revenue tracking, and reporting

### ⚙️ SaaS Platform
- Product listings and subscription plans
- Subscription lifecycle management
- User dashboards and self-service controls
- Payment validation and recurring billing support

### 🔑 Developer Platform
- API key generation and secure delivery
- Usage tracking and quota enforcement
- Subscription validation for developer access
- Developer-friendly documentation and onboarding

## Work Model
MB Tech Labs supports both remote and office-based collaboration.

- **Work From Home**: Flexible remote work with home-based productivity tracking, online task coordination, and asynchronous team collaboration.
- **Work From Office**: Structured office operations for monthly planning, in-person standups, and focused delivery cycles.
- **Productivity Tracking**: Time logs, task progress metrics, and performance dashboards enable transparent productivity monitoring.
- **Team Collaboration Tools**: Internal chat, notifications, file sharing, and project discussion streams keep teams aligned.

## Development Workflow

- **GitHub private repositories per project** provide secure code management for each client engagement.
- **Branching strategy** uses `main`, `develop`, `feature/*`, and `bugfix/*` to streamline releases and collaboration.
- **Code review process** is enforced through pull requests, peer review, and approval gates.
- **Deployment workflow** connects branch-based CI/CD pipelines to staging and production environments.

## Getting Started

### Prerequisites
- Node.js
- Python
- MySQL

### Installation Steps
1. Clone the repository
2. Set up the frontend in `/frontend`
3. Configure the backend in `/backend`
4. Create and connect the MySQL database

> Keep configuration and secrets secure when deploying to the Hostinger VPS.

## Development Phases
- **Phase 1:** Website and client system launch
- **Phase 2:** Employee workspace and task management
- **Phase 3:** Admin dashboard and analytics
- **Phase 4:** Communication and collaboration tools
- **Phase 5:** SaaS platform and developer product offerings

## Security
- **JWT authentication** protects API access and sessions
- **Role-based access control** manages permissions for clients, employees, and admins
- **API key security** ensures protected access for developer integrations

## Future Scope
- Advanced SaaS products and platform expansion
- Hackathons, internal tech events, and innovation programs
- Game development services and multimedia solutions
- AI integrations for automation, analytics, and customer support

## License
This project is licensed under the terms described in the `LICENSE` file.
