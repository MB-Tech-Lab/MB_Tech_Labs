# System Architecture

## Overview

The MB Tech Labs Work Management & Monitoring Platform is a comprehensive system designed to manage projects, teams, tasks, time tracking, and performance evaluation. The architecture supports the organizational structure and enables role-based workflows.

---

## Technology Stack

### Frontend
- **Framework**: Next.js (React-based, TypeScript)
- **Styling**: Tailwind CSS
- **State Management**: Context API / Redux
- **Hosting**: Vercel (global CDN)
- **Key Features**:
  - Real-time dashboards
  - Component-based UI
  - Responsive design
  - Progressive Web App capabilities

### Backend
- **Framework**: Firebase or Supabase (serverless) OR Node.js + Express (if VPS-based)
- **Authentication**: JWT with role-based access
- **API Design**: RESTful API endpoints
- **Hosting**: Firebase/Supabase (managed) OR Hostinger VPS (self-managed)
- **Key Features**:
  - Scalable data handling
  - Real-time notifications
  - Automated reporting
  - Audit trail logging

### Database
- **Primary**: Firebase Realtime DB / Firestore OR MySQL
- **Caching**: Redis (for performance)
- **File Storage**: Cloud Storage (Firebase/AWS S3) OR VPS file system
- **Backup**: Automated daily backups
- **Key Collections/Tables**:
  - Users (with roles)
  - Teams
  - Projects
  - Tasks
  - TimeEntries
  - Submissions
  - Reports
  - AuditLogs

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    END USERS                             │
│   Admin | Exec Officer | PMs | Team Leads | Developers  │
└────────────┬────────────────────────────────┬────────────┘
             │                                │
     ┌───────┴─────────────┐        ┌────────┴──────────┐
     │                     │        │                   │
┌────▼─────┐         ┌────▼─────┐ ┌┴──────────┐  ┌────▼──────┐
│ Frontend  │         │ Frontend │ │Dashboard │  │   Mobile  │
│(Web)      │         │(SPA)     │ │(Reports) │  │   App*    │
└────┬──────┘         └────┬──────┘ └┬────────┘  └──┬────────┘
     │                     │        │            │
     └─────────┬───────────┴────────┴────────────┘
             │
    ┌────────▼─────────────────┐
    │    API Layer (REST)      │
    │  ├─ Auth endpoints       │
    │  ├─ Task endpoints       │
    │  ├─ Project endpoints    │
    │  ├─ Team endpoints       │
    │  ├─ Time endpoints       │
    │  ├─ Report endpoints     │
    │  └─ User endpoints       │
    └────────┬─────────────────┘
             │
    ┌────────▼──────────────────────┐
    │    Business Logic Layer        │
    │  ├─ Task Management           │
    │  ├─ Time Tracking            │
    │  ├─ Performance Calc          │
    │  ├─ Reporting Engine          │
    │  ├─ Notification Service      │
    │  └─ Audit Logger              │
    └────────┬──────────────────────┘
             │
    ┌────────▼──────────────────┐
    │    Database Layer          │
    │  ├─ Users & Roles          │
    │  ├─ Organizations/Teams    │
    │  ├─ Projects & Tasks       │
    │  ├─ Time Entries           │
    │  ├─ Submissions            │
    │  ├─ Audit Logs             │
    │  └─ Reports                │
    └────────────────────────────┘
```

---

## Core System Modules

### 1. Authentication & Authorization Module
**Purpose**: Secure user access and role-based permissions

**Components**:
- User login/logout
- JWT token generation and validation
- Role verification
- Permission checking
- Multi-level access control

**Data Flows**:
- User credentials → API → JWT token → Frontend token storage
- Each API request includes JWT token
- Backend verifies role and permissions before allowing action

---

### 2. Organization & Team Module
**Purpose**: Manage organizational hierarchy and team structures

**Components**:
- Organization setup
- Role definitions and assignments
- Team creation and management
- Team member assignment
- User profiles and permissions

**Key Entities**:
- Organization
- Roles (Admin, Exec Officer, PM, Team Lead, Developer, Intern)
- Teams
- Team Members
- User Profiles

---

### 3. Project Management Module
**Purpose**: Manage client projects and project lifecycle

**Components**:
- Project creation
- Client information management
- Project timeline and milestones
- Deliverable tracking
- Project status management
- Budget tracking

**Key Entities**:
- Projects
- Clients
- Milestones
- Deliverables
- Project Status History

---

### 4. Task Management Module
**Purpose**: Manage individual tasks and work assignments

**Components**:
- Task creation and hierarchy
- Task assignment
- Status tracking (Pending → In Progress → Submitted → Approved)
- Subtask management
- Task submissions and reviews

**Key Entities**:
- Tasks
- Subtasks
- Task Status
- Task Submissions
- Review Comments

---

### 5. Time Tracking Module
**Purpose**: Track work hours and activity logging

**Components**:
- Timer service (start/stop)
- Manual time entry
- Time aggregation
- Daily/weekly time reports
- Idle detection

**Key Entities**:
- TimeEntries
- TimerSessions
- DailyTimeSummary
- IdleAlerts

---

### 6. Performance & Evaluation Module
**Purpose**: Calculate performance metrics and evaluations

**Components**:
- Metric calculation engine
- Performance scoring
- Stipend eligibility determination
- Performance reports
- Trend analysis

**Key Entities**:
- PerformanceMetrics
- EvaluationRecords
- StipendRecords
- PerformanceTrends

---

### 7. Reporting & Analytics Module
**Purpose**: Generate multi-level reports and analytics

**Components**:
- Daily report generation
- Team reports
- Project reports
- Performance analytics
- Custom report builder
- Export functionality

**Report Types**:
- Individual daily reports
- Team aggregated reports
- Project status reports
- Performance reports
- Compliance reports

---

### 8. Notification & Alert Module
**Purpose**: Alert users to important events

**Components**:
- Email notifications
- In-app notifications
- Real-time alerts
- Notification preferences
- Delivery management

**Alert Types**:
- Task assignment
- Submission notifications
- Performance alerts
- Deadline warnings
- System alerts

---

### 9. Audit & Compliance Module
**Purpose**: Track all system actions for compliance

**Components**:
- Action logging
- Change tracking
- Audit trail generation
- Compliance reporting
- Data retention management

**Logged Events**:
- User login/logout
- Task creation/modification
- Time entry changes
- Task approvals/rejections
- Permission changes
- Report generation

---

## Role-Based Access Control (RBAC)

### Admin Role Permissions
```
✅ View all system data
✅ Create/delete any entity
✅ Override any decision
✅ Generate all reports
✅ Modify system policies
✅ Manage user roles
✅ Access audit logs
```

### Executive Officer Permissions
```
✅ View operations data
✅ Create/manage projects and teams
✅ Approve major changes
✅ View reports
✅ Manage Project Managers
⚠️ Limited override on decisions
```

### Project Manager Permissions
```
✅ View assigned project/team data
✅ Create teams and projects
✅ Communicate with clients
✅ Create project tasks
✅ View team performance
✅ Approve task submissions (from team)
✅ Generate team reports
❌ View other teams' data
❌ Modify user roles
```

### Team Lead Permissions
```
✅ View team member data
✅ Create and assign tasks
✅ Approve task submissions
✅ View team performance
✅ Generate team reports
✅ Modify task descriptions
❌ Create projects
❌ Communicate with clients
❌ View other teams
```

### Developer Permissions
```
✅ View own tasks
✅ Start/stop timer
✅ Submit completed tasks
✅ View own performance
✅ View task feedback
❌ Approve tasks
❌ View other team members' data
❌ Create tasks
```

---

## Data Flow Examples

### Authentication Flow
```
1. User enters credentials
2. Frontend sends POST /auth/login
3. Backend verifies credentials against DB
4. Check user role and permissions
5. Generate JWT token with role info
6. Return token to frontend
7. Frontend stores token in secure storage
8. Future requests include token in header
```

### Task Submission Flow
```
1. Developer marks task complete
2. Developer uploads submission
3. System creates Submission record
4. Notifies Team Lead
5. Team Lead reviews submission
6. Team Lead approves/rejects
7. If approved: Task marked complete, time logged finalized
8. If rejected: Task returned to developer
9. Developer notified with feedback
10. Report metrics updated
```

### Time Tracking Flow
```
1. Developer selects task
2. Developer clicks "Start Timer"
3. Timer records start timestamp
4. Backend records timer session start
5. Developer works...
6. Developer clicks "Stop Timer"
7. Timer calculates duration
8. Backend creates TimeEntry
9. TimeEntry linked to Task
10. Report metrics updated
11. Time visible to Team Lead/Manager/Admin
```

### Performance Calculation Flow
```
1. Each day, system aggregates metrics for user
2. Calculate: completion rate, on-time rate, quality score
3. Generate daily performance record
4. Each week, aggregate daily records
5. Generate weekly performance rating
6. Compare to thresholds for rating (Excellent/Good/Satisfactory/Poor)
7. Update stipend eligibility
8. Generate report
9. Notify relevant users
```

---

## Security & Privacy

### Data Protection
- All API communication over HTTPS
- JWT tokens with expiration
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention measures
- CORS headers properly configured

### Role-Based Security
- Every API endpoint checks user role
- Data queries filtered by user role
- Audit logging of all access attempts
- Permission enforcement at DB level
- Principle of least privilege

### Audit Trail
- All significant actions logged
- Includes user, timestamp, action, data changed
- Immutable audit logs
- Long-term retention (3+ years)
- Available for compliance review

---

## Scalability Considerations

### Current Phase (MVP)
- Single deployment environment
- MySQL or Firebase backend
- Direct API to frontend
- Polling-based notifications

### Medium Term
- Multiple project environments
- Caching layer (Redis) for performance
- WebSocket for real-time updates
- Background job queues (Celery/Bull)

### Long Term
- Microservices architecture
- Multiple deployment regions
- Advanced caching strategies
- Machine learning for predictions
- Mobile app platform

---

## Deployment Architecture

### Development
```
Local dev machines → GitHub repo → Local testing
```

### Staging
```
Frontend: Vercel staging environment
Backend: VPS staging server
Database: Separate staging DB
```

### Production
```
Frontend: Vercel production → CDN → Users
Backend: VPS or Cloud → Load Balanced
Database: MySQL or Firestore → Geo-redundant
```

---

## Future Enhancements

1. **Real-time Collaboration**: WebSocket for live task updates
2. **Mobile Application**: Native iOS/Android apps
3. **Advanced Analytics**: AI-powered insights
4. **Workflow Automation**: Automated task creation and routing
5. **Integration APIs**: Third-party tool integrations
6. **Advanced Reporting**: Custom report builder, data visualization
7. **Resource Planning**: Capacity planning tools
8. **Approval Workflows**: Multi-step approval processes

---

## Technology Recommendations

### Recommended Stack (Firebase-based - fastest to market):
```
Frontend: Next.js + TypeScript + Tailwind CSS → Vercel
Backend: Firebase Cloud Functions
Database: Firestore + Firebase Realtime DB
Auth: Firebase Authentication
Storage: Firebase Storage
Hosting: Vercel (frontend) + Firebase (backend)
```

### Alternative Stack (Self-hosted - maximum control):
```
Frontend: Next.js + TypeScript + Tailwind CSS → Vercel/self-hosted
Backend: Node.js/Express + TypeScript
Database: MySQL + Redis
Auth: JWT custom implementation
Storage: Local filesystem or S3-compatible
Hosting: Hostinger VPS or AWS EC2
```

The Firebase stack enables faster delivery with less infrastructure management. The self-hosted stack provides maximum control and lower ongoing costs at the expense of more operational overhead.
