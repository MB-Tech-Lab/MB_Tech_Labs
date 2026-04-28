# 22_Development_Workflow_GitHub.md

# MB Tech Labs - Development Workflow (GitHub)

## Overview

The MB Tech Labs development workflow is built around GitHub private repositories, role-based access controls, and an integrated project lifecycle. This design supports secure collaboration, code quality, and deployment automation while preserving flexibility for hybrid and distributed teams.

## Repository Strategy

### Private Repository Model
- **One private repository per client project**: Each client project is isolated in a dedicated repository
- **Organization-level management**: Repositories are owned by the MB Tech Labs GitHub organization
- **Access control**: Permissions managed by role and project assignment
- **Repository naming convention**: `mbtechlabs-client-{project-code}`

### Repository Types
- **Client Project Repos**: Project-specific development repositories
- **Platform Repos**: Core platform utilities, shared libraries, and documentation
- **Infrastructure Repos**: Deployment scripts, IaC, and automation code
- **Template Repos**: Standard repository structure for new client projects

### Repository Governance
- **Branch protection**: Enforce rules on `main` and `develop`
- **Code owners**: Designate responsible reviewers per repository
- **Repository templates**: Consistent structure and CI configuration
- **Security scanning**: GitHub Advanced Security or integrated code scanners

## Branching Strategy

### Main Branches
- **main**: Production-ready code only
- **develop**: Staging code, integration branch for active work

### Topic Branches
- **feature/**: New features and enhancements
- **bugfix/**: Fixes for broken functionality
- **hotfix/**: Urgent production fixes
- **release/**: Release preparation branches
- **chore/**: Maintenance, documentation, and tooling updates

### Branching Rules
- **Branch from `develop`** for feature and bugfix work
- **Pull Requests** required for merge into `develop` and `main`
- **Feature branch naming**: `feature/{ticket-id}-{short-description}`
- **Bugfix branch naming**: `bugfix/{ticket-id}-{short-description}`

## GitHub Workflow

### 1. Project Initiation
- **Admin/Manager creates project** in MB Tech Labs system
- **Project metadata** entered (client, budget, timeline, scope)
- **Repository template selected** for the new client project
- **GitHub repository** created and linked to project record

### 2. Repository Provisioning
- **Private repository creation** under MB Tech Labs organization
- **Default branches** initialized: `main`, `develop`
- **Required checks** configured: PR reviews, CI tests, security scans
- **Access lists** populated from project team roles

### 3. Team Onboarding
- **Team members added** to repository based on assignment
- **Role-based GitHub access** applied:
  - **Admin**: Full repository admin access
  - **Manager**: Write access and PR review permissions
  - **Team Leader**: Write access and code review capability
  - **Senior Developer**: Write access and merge rights on staging
  - **Junior Developer**: Write access to feature branches
  - **Intern**: Read access or limited write access per project policy
- **Training documentation** shared for repository conventions

### 4. Task Assignment
- **Tasks created** in project management system
- **Task metadata** includes GitHub branch and issue references
- **Task assignment** to developer or team lead
- **Dependency and priority information** included

### 5. Development and Code Push
- **Developers create feature branches** for assigned tasks
- **Code pushed** to GitHub private repo
- **Commits reference task IDs** and include descriptive messages
- **Automated tests** run on push via CI workflows

### 6. Code Review and Quality Control
- **Pull request created** against `develop`
- **Code review by senior developer or team lead**
- **Automated checks** validate linting, testing, security, and style
- **Review feedback** tracked in PR comments
- **Merge only after approvals and passing checks**

### 7. Merge and Release
- **Merge to `develop`** after successful review
- **Deployment to staging** triggered automatically
- **Acceptance testing** performed on staging
- **Release branch created** for production-ready work
- **Merge to `main`** when release is approved
- **Production deployment** triggered after final checks

### 8. Deployment Triggered
- **Deployments** automated through GitHub Actions or CI pipeline
- **Main branch** deployment targets production environment
- **Develop branch** deployment targets staging/test environment
- **Release notes** generated from PR and issue data
- **Post-deployment verification** and health checks performed

## Access Control

### Role-Based GitHub Access
- **Admin**: Full organization and repository administration
- **Manager**: Repository write access, branch management, and team oversight
- **Team Leader**: Full feature development and review responsibilities
- **Senior Developer**: Code review, merge to staging, and technical approvals
- **Junior Developer**: Limited write access, peer review participation
- **Intern**: Read access or restricted write access depending on project risk
- **HR / Marketing**: Read access or repository visibility only if required

### Access Rules
- **Least privilege**: Access granted only for assigned repositories
- **Temporary access**: Contract or short-term contributors granted limited-duration access
- **Review assignments**: Senior reviewers assigned for critical branches
- **Approval chains**: Require two reviewers for `main` or `release` merges
- **Audit logging**: GitHub access events tracked through organization audit logs

## Issue and Change Management

### Issue Tracking
- **GitHub Issues** can be used as a secondary system or synced with the task management system
- **Issue templates** for feature requests, bug reports, and documentation updates
- **Labels** categorize issue priority, type, and team
- **Milestone assignments** map issues to project milestones

### Pull Request Practices
- **Template usage** for PR descriptions and checklist
- **Reference task IDs** and related issue numbers
- **Standard review checklist** for code quality and tests
- **Merge strategies**: squash or merge commits based on repository policy
- **Post-merge actions**: update task status and notify stakeholders

## Integration Points

### Project Management System
- **Repository linked** to project record
- **Task assignment** includes GitHub branch references
- **Project milestone updates** triggered by PR merges
- **Project delivery status** updated from GitHub release progress

### Notification System
- **PR notifications** delivered to reviewers and stakeholders
- **Deployment alerts** for staging and production
- **Code review reminders** and overdue task alerts
- **Release announcements** for team visibility

### Authentication and RBAC
- **Single sign-on readiness** through GitHub or platform auth
- **Role mapping** between platform RBAC and GitHub permissions
- **Synchronized access lists** for project teams
- **Audit compliance** through GitHub access logs

## Workflow Diagram

```
1. Project created -> 2. Repo provisioned -> 3. Team added
4. Tasks assigned -> 5. Developers push code -> 6. Code review
7. Merge to develop -> 8. Staging deploy -> 9. Merge to main -> 10. Production deploy
```

## Scalability and Future Enhancements

### Future Improvements
- **GitHub Apps integration** for automated issue-task synchronization
- **Dependency graph analysis** for repository health
- **Advanced branch policies** with status checks and code scanning
- **Multi-repo microservice workflows** for shared platform components
- **Cross-repo change coordination** through GitHub Projects or advanced tooling

The Development Workflow using GitHub ensures MB Tech Labs delivers secure, review-driven code with clear traceability from task assignment to production deployment.