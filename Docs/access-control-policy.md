# Access Control Policy

## Purpose

This policy establishes the Role-Based Access Control (RBAC) framework for MB Tech Labs. It defines how users are authenticated, how roles are assigned, and what system access each role receives.

---

## Authentication Framework

### Login Requirements
- **Username/Email**: Unique user identifier
- **Password**: Minimum 12 characters, complex (uppercase, lowercase, number, symbol)
- **Two-Factor Authentication (2FA)**: Optional but recommended for Admin/Executive Officer
- **Session Timeout**: 30 days for persistent login, or manual logout
- **Password Reset**: Email-based reset with expiring token

### Authentication Methods
1. **Email/Password**: Primary authentication method
2. **Social Login** (future): Google, GitHub optional integration
3. **API Keys**: For developer/system integrations (if applicable)

### Session Management
- JWT tokens with encoded role information
- Token expiration: 48 hours
- Refresh token: 30 days
- Single session per user at a time (logout other sessions on new login)
- Session data stored securely in HTTP-only cookies or secure storage

---

## Role Definitions & Hierarchy

### Role Levels (Hierarchical)

```
LEVEL 1 (Executive)
├── Admin (Full Access)
└── Executive Officer (Operations Authority)

LEVEL 2 (Management)
├── Project Manager (Client & Project Authority)
├── HR Manager (Personnel Authority)
└── Marketing Manager (Business Development Authority)

LEVEL 3 (Execution)
├── Team Lead (Technical Authority)
├── Senior Developer (Technical Contributor)
├── Junior Developer (Technical Contributor)
└── Intern (Learning & Execution)
```

---

## Role-Based Data Access Matrix

### Admin
- **System Access**: All data and systems
- **User Management**: Create, modify, delete any user
- **Project Access**: View/edit all projects
- **Task Access**: View/edit all tasks
- **Team Access**: View/manage all teams
- **Time Entry Access**: View/edit all time entries
- **Report Access**: View all reports
- **Audit Access**: View complete audit logs
- **Override**: Can override any system decision

### Executive Officer
- **System Access**: Operations and management data
- **User Management**: Manage users under their purview
- **Project Access**: View/edit all projects
- **Task Access**: View all tasks, edit high-priority tasks
- **Team Access**: View/manage teams
- **Time Entry Access**: View team time entries
- **Report Access**: View all reports
- **Override**: Limited override on operational decisions

### Project Manager
- **System Access**: Assigned project/client data only
- **User Management**: Cannot manage users (HR Manager handles)
- **Project Access**: View/edit only assigned projects
- **Task Access**: Create and view tasks for assigned projects
- **Team Access**: Create teams, assign members, view assigned teams
- **Time Entry Access**: View time entries for assigned teams
- **Report Access**: View reports for assigned teams
- **Client Communication**: Authorized to communicate with clients
- **Limitations**: Cannot see other Project Managers' data

### Team Lead
- **System Access**: Own team and project data
- **User Management**: Cannot manage users
- **Project Access**: View assigned project details
- **Task Access**: Create, assign, review tasks for own team
- **Team Access**: View own team only
- **Time Entry Access**: View own team's time entries
- **Report Access**: View own team's reports
- **Task Approval**: Can approve/reject team member submissions
- **Limitations**: Cannot access other teams' data

### Senior Developer
- **System Access**: Own tasks and project data
- **User Management**: Cannot manage users
- **Project Access**: View project context for assigned work
- **Task Access**: View own tasks, create subtasks
- **Team Access**: View own team members (read-only)
- **Time Entry Access**: View own time entries and team summary
- **Report Access**: View own performance reports
- **Limitations**: Cannot approve tasks, cannot see other teams

### Junior Developer
- **System Access**: Own task and project data
- **User Management**: Cannot manage users
- **Project Access**: View project context for assigned work
- **Task Access**: View own assigned tasks
- **Team Access**: Limited team visibility (read-only)
- **Time Entry Access**: View own time entries
- **Report Access**: View own performance reports
- **Limitations**: Cannot modify tasks, cannot see other developers

### Intern
- **System Access**: Own task data only
- **User Management**: Cannot manage users
- **Project Access**: View project name/context only
- **Task Access**: View own assigned tasks only
- **Team Access**: Limited (know own team only)
- **Time Entry Access**: View own time entries
- **Report Access**: View own performance reports
- **Limitations**: Maximum data isolation for learning purposes

### HR Manager
- **System Access**: Personnel and compliance data
- **User Management**: Manage users (hiring, termination)
- **Project Access**: View project list only
- **Task Access**: Cannot access (operational privacy)
- **Team Access**: View team rosters
- **Time Entry Access**: Cannot access directly
- **Report Access**: View compliance and personnel reports
- **Audit Access**: View security and compliance audit logs

### Marketing Manager
- **System Access**: Business development data
- **User Management**: Cannot manage users
- **Project Access**: View project summary, closed projects
- **Task Access**: Cannot access
- **Team Access**: Cannot access
- **Time Entry Access**: Cannot access
- **Report Access**: View project completion metrics only

---

## Data Access Rules

### Project Data Access
- **Admin**: All projects
- **Exec Officer**: All projects
- **Project Manager**: Only assigned projects
- **Team Lead**: Only assigned project
- **Developers**: Only current project context
- **HR Manager**: Project list metadata only
- **Others**: No access

### Task Data Access
- **Admin**: All tasks
- **Exec Officer**: All tasks
- **Project Manager**: Tasks from assigned projects
- **Team Lead**: Tasks assigned to own team
- **Developers**: Own assigned tasks
- **Others**: No access

### Team Data Access
- **Admin**: All teams
- **Exec Officer**: All teams
- **Project Manager**: Assigned teams
- **Team Lead**: Own team only
- **Developers**: Own team (basic info)
- **HR Manager**: All team rosters (minimal data)
- **Others**: No access

### Time Entry Data Access
- **User**: Own entries (read/create)
- **Team Lead**: Team member entries (read/modify)
- **Project Manager**: Team entries for assigned projects
- **Exec Officer**: All entries (read)
- **Admin**: All entries (read/modify/delete)
- **Others**: No access

### Report Data Access
- **Individual**: Own report
- **Team Lead**: Team reports
- **Project Manager**: Team reports for assigned projects
- **Exec Officer**: All reports
- **Admin**: All reports, including audit
- **HR Manager**: Compliance reports only
- **Others**: No access

---

## API Endpoint Access Control

### Authentication Endpoints
- `POST /auth/login` - Public (requires credentials)
- `POST /auth/logout` - Authenticated users only
- `POST /auth/refresh-token` - Authenticated users only
- `POST /auth/password-reset` - Public (with email verification)

### User Management Endpoints
- `GET /users` - Admin, Exec Officer, HR Manager only
- `GET /users/{id}` - Admin, Exec Officer, HR Manager, User own record
- `POST /users` - Admin, Exec Officer, HR Manager only
- `PUT /users/{id}` - Admin, Exec Officer (limited), HR Manager
- `DELETE /users/{id}` - Admin only

### Project Endpoints
- `GET /projects` - By role visibility rules
- `GET /projects/{id}` - By role visibility rules
- `POST /projects` - Admin, Exec Officer, Project Manager
- `PUT /projects/{id}` - Admin, Exec Officer, Project Manager (owned projects)
- `DELETE /projects/{id}` - Admin, Exec Officer only

### Task Endpoints
- `GET /tasks` - By team/project assignment
- `GET /tasks/{id}` - By task assignment/visibility
- `POST /tasks` - Admin, Exec Officer, Project Manager, Team Lead (appropriate level)
- `PUT /tasks/{id}` - Creator, Team Lead, Project Manager (assignment)
- `POST /tasks/{id}/submit` - Task assignee only

### Team Endpoints
- `GET /teams` - By role (full or limited)
- `GET /teams/{id}` - Admin, Exec Officer, Team Lead (own), Project Manager (assigned)
- `POST /teams` - Admin, Exec Officer, Project Manager
- `PUT /teams/{id}` - Admin, Exec Officer, Project Manager (owned)

---

## Permission Enforcement

### Backend Enforcement (Primary)
1. **Authentication Check**: Verify JWT token validity
2. **Role Extraction**: Extract role from token
3. **Authorization Check**: Verify role has permission
4. **Data Filtering**: Limit data to user's accessible scope
5. **Audit Logging**: Record access attempt

### Frontend Enforcement (Secondary)
1. **Role-Based Routing**: Hide routes user cannot access
2. **UI Component Hiding**: Hide buttons/features user cannot use
3. **Client-Side Validation**: Prevent form submission to unauthorized endpoints

**Note**: Backend enforcement is authoritative. Frontend is for UX only.

---

## Access Request & Escalation

### Access Requests
- If user needs additional access beyond their role, request through HR Manager
- Project Manager can request temporary access elevation for Team Lead
- All access requests require Admin approval
- Requests logged and tracked

### Temporary Access
- Temporary elevated access can be granted for specific duration (e.g., 1 week)
- Requires Admin approval
- Must be justified and documented
- Auto-reverts after expiration
- Audit logged

---

## Access Revocation

### Conditions for Revocation
- Employee termination or resignation
- Role change to lower-privilege role
- Policy violation or misconduct
- System access no longer needed
- Upon request

### Revocation Process
1. HR Manager initiates revocation
2. Admin approves (if not already)
3. System removes/downgrade role
4. Email notification sent to user (optional, by policy)
5. Audit log entry created
6. Immediate effect (or scheduled date)

---

## Password & Credential Management

### Password Requirements
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Not reuse last 5 passwords
- Change every 90 days (optional policy)
- Cannot contain username or email

### Password Reset
- User can self-reset via email link (24-hour expiration)
- Must set new password meeting requirements
- Old password NOT required
- Audit logged

### Credential Sharing
- **Prohibited**: Sharing passwords or login credentials
- **API Keys**: If used, rotated every 90 days
- **Action on Exposure**: Immediate reset and audit review

---

## Multi-Factor Authentication (MFA)

### Recommended For
- Admin users (required)
- Executive Officer (recommended)
- Project Manager (recommended)

### Methods
- Time-based OTP (TOTP) via Authenticator app
- Email-based OTP (if TOTP unavailable)

### Implementation
- Optional but can be mandated by policy
- User can enable in account settings
- Backup codes generated during setup

---

## Access Monitoring & Alerts

### Monitoring Activities
- Failed login attempts (track)
- Unusual access patterns (alert)
- Accessed data outside normal scope (log)
- Time entries edited by non-owner (alert)

### Alert Triggers
- 5+ failed login attempts in 15 minutes → Account lockout for 30 minutes
- Access from unusual location/IP → Notification to user
- Batch data export → Admin notification
- Cross-role data access → Audit alert

### Audit Trail
- All access recorded with timestamp, user, action, data accessed
- Retention: 3 years minimum
- Available for compliance review
- Cannot be modified after creation

---

## Compliance & Governance

### Policy Review
- Annual review of access control policies
- Quarterly audit of access patterns
- Post-incident review of breaches
- Documentation of all reviews

### Training
- New users trained on access policy
- Annual refresher training
- Incident-specific retraining if violations occur

### Legal Compliance
- GDPR compliance for data access
- SOC 2 audit readiness
- Data protection regulations adherence
- Incident notification procedures

---

## Emergency Access

### Break-Glass Procedure
- Emergency Admin access override (if Admin locked out)
- Requires written approval from 2 executives
- Limited to 4-hour duration
- Auto-reverts and fully audit logged
- Post-incident review required

### Disaster Recovery
- Access control data backed up daily
- Role assignments backed up separately
- Can restore to previous state if needed
- Must coordinate with Admin

---

## Termination & Offboarding

### Upon Role Change or Termination
1. HR Manager initiates role removal
2. All access revoked (data, systems, API keys)
3. Active sessions terminated
4. Data ownership transferred if applicable
5. Audit trail finalized
6. Email systems/communication revoked

### Data Handover
- Transfer of project ownership (if applicable)
- Task reassignment
- Report generation for record
- Document all handover actions

---

## Questions & Support

For access-related questions or issues:
- **Access Request**: Contact HR Manager
- **Forgotten Password**: Use self-service reset
- **Technical Issues**: Contact Administrator
- **Policy Questions**: Consult with HR Manager
