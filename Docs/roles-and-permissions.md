# Roles & Permissions

## Overview

MB Tech Labs operates with a clear, hierarchical role structure. Each role has defined responsibilities, specific permissions, and appropriate visibility levels. This document details all roles and their system access.

---

## Role Hierarchy

```
LEVEL 1 (Executive)
├── Admin (Founder)
└── Executive Officer (COO)

LEVEL 2 (Management)
├── Project Manager
├── HR Manager
└── Marketing Manager

LEVEL 3 (Execution)
├── Team Lead
├── Senior Developer
├── Junior Developer
└── Intern
```

---

## LEVEL 1: Executive Authority

### Admin (Founder / CEO)

**Primary Responsibility**: Full system control, strategic oversight, final authority on all decisions

**Key Responsibilities**:
- Strategic direction and long-term planning
- Final authority on all business decisions
- Oversight of all operations and projects
- User management and role assignments
- Financial oversight and budget approval
- Policy creation and enforcement
- Escalation and dispute resolution (final authority)
- Performance and risk management

**System Permissions**:
- View all system data (complete visibility)
- Create, edit, delete any user account
- Assign and change all roles
- Create/edit/delete projects, teams, tasks
- View all time entries and can edit/override
- Approve or reject any task
- Override any system decision
- Generate all reports including audit logs
- Access complete audit trail
- Export all data
- Modify system-wide policies
- Set organization-wide settings

**Dashboard Access**:
- Organization-wide metrics and analytics
- All teams and project status
- All users and their performance
- Financial and resource allocation
- Risk and compliance alerts
- Complete reporting access

**Visibility Scope**: All data in system

---

### Executive Officer (COO / Co-Founder)

**Primary Responsibility**: Execute Admin decisions, manage day-to-day operations

**Key Responsibilities**:
- Day-to-day operational management
- Project portfolio oversight
- Team and resource management
- Escalation point for critical issues
- Implementation of Admin directives
- Performance monitoring
- Deputy authority when Admin unavailable

**System Permissions**:
- View operational data (most data, filtered appropriately)
- Create and manage projects
- Create and manage teams
- Assign Team Leads
- View all tasks and team performance
- Approve major task submissions
- View time entries for managed teams
- Generate and review reports
- Limited override capability (with Admin consultation)
- Cannot delete users or modify roles
- Cannot access audit logs (Admin-only)

**Dashboard Access**:
- All project and team dashboards
- Performance metrics across organization
- Task completion and progress tracking
- Team reports and analytics
- Resource allocation view

**Visibility Scope**: All operational data except audit logs

---

## LEVEL 2: Operational Management

### Project Manager (Account Manager / Client Director)

**Primary Responsibility**: Client relationships, project delivery, team formation

**Key Responsibilities**:
- Primary client contact and communicator (authorized)
- Project planning and scoping
- Requirements gathering and documentation
- Team creation and resource allocation
- Task creation for projects
- Project timeline and milestone management
- Payment and billing coordination
- Status reporting to Admin/Executive Officer
- Client satisfaction and issue escalation
- Delivery timeline management

**System Permissions**:
- Create projects and define scope
- Create and edit tasks for assigned projects
- Create and manage teams for assigned projects
- Assign Team Leads to projects
- Add/remove team members from assigned teams
- View assigned projects and associated teams
- View team member performance for assigned teams
- Approve task submissions from assigned teams
- View reports for assigned projects/teams
- Generate project status reports
- Communicate with clients (authorized)
- Cannot: See other Project Managers' data, modify user roles, view audit logs, override high-level decisions

**Dashboard Access**:
- Assigned projects and teams
- Project progress and milestones
- Team member performance
- Task completion rates and status
- Client communication history
- Payment and billing status
- Project-level reports

**Visibility Scope**: Only assigned projects, teams, and associated data

---

### HR Manager

**Primary Responsibility**: Personnel management, compliance, hiring/termination

**Key Responsibilities**:
- Recruitment and hiring decisions
- Onboarding and offboarding
- Performance record management
- Disciplinary action coordination
- Compliance monitoring and enforcement
- Legal and regulatory matters
- Personnel file maintenance
- Training and development

**System Permissions**:
- Create and manage user accounts
- Assign initial roles
- Cannot access project or task details
- Cannot view time entries directly
- Can see performance reports for compliance review
- Can access compliance and audit logs
- Cannot modify Project Manager decisions
- Cannot override task approvals

**Dashboard Access**:
- User roster and role assignments
- Performance metrics (for compliance purposes)
- Compliance alerts and violations
- Hiring and onboarding status
- Termination and offboarding checklist

**Visibility Scope**: Personnel and compliance data only

---

### Marketing Manager (Marketing Lead)

**Primary Responsibility**: Lead generation, business development, business development strategy

**Key Responsibilities**:
- Lead generation, prospect identification, and outreach campaigns
- Sales and client acquisition strategy
- Brand management and marketing communications
- Routing qualified leads to Project Managers with context
- Market analysis, competitive positioning, and intelligence
- Lead qualification and pipeline management
- Marketing metrics and ROI analysis
- Collaborate with Project Managers on client feedback

**System Permissions**:
- View project completion and delivery metrics
- Cannot access detailed project information
- Cannot see team structure or task details
- Cannot view time entries or performance data
- Cannot create projects, teams, or assign resources
- View high-level project status and timelines
- Generate leads, pipeline reports, and marketing analytics
- Cannot communicate directly with clients (exception: routing leads)

**Dashboard Access**:
- Project completion and delivery metrics
- Lead pipeline and conversion tracking
- Market and competitive intelligence
- Lead routing history and conversion rates
- Marketing performance and ROI analysis

**Visibility Scope**: Lead generation and project completion metrics only (minimal system access)

---

## LEVEL 3: Execution & Development

### Team Lead (Technical Lead / Engineering Lead)

**Primary Responsibility**: Technical execution, team management

**Key Responsibilities**:
- Technical leadership of assigned team
- Project task breakdown and planning
- Task assignment to team members
- Code quality and technical standards
- Task submission review and approval/rejection
- Team member performance monitoring
- Daily team coordination
- Issue escalation to Project Manager
- Team collaboration facilitation
- Mentoring and knowledge sharing

**System Permissions**:
- Create and assign tasks within assigned project
- View team member assignments
- Approve or reject task submissions from team
- View team member time entries
- View team performance metrics
- Cannot: Create projects, create teams, assign new team members, override Project Manager decisions, view other teams
- Cannot: Communicate with clients (except if explicitly authorized)

**Dashboard Access**:
- Team overview and member assignments
- Task board (Kanban view)
- Task submissions awaiting review
- Team performance metrics
- Individual team member performance
- Team time tracking summary

**Visibility Scope**: Own team and assigned project only

---

### Senior Developer

**Primary Responsibility**: Core technical work, mentoring

**Key Responsibilities**:
- Execute assigned tasks
- Mentor Junior Developers and Interns
- Technical problem-solving
- Code quality contributions
- Review and approve Junior work (informal)
- Knowledge sharing and best practices
- Task submission and revision management
- Professional development

**System Permissions**:
- View assigned tasks
- Submit completed tasks
- Start/stop timers for own tasks
- View own time entries
- Cannot: Assign tasks, approve submissions, view other team members' details (except in team context)
- Cannot: Create projects or teams

**Dashboard Access**:
- Own assigned tasks
- Own task submissions
- Own time tracking
- Own performance report
- Team member list (read-only)
- Team performance summary

**Visibility Scope**: Own tasks and basic team information

---

### Junior Developer

**Primary Responsibility**: Supervised task execution, learning

**Key Responsibilities**:
- Execute assigned tasks
- Seek feedback and mentoring
- Learn best practices and standards
- Submit completed work for review
- Professional development
- Ask for clarification and guidance

**System Permissions**:
- View own assigned tasks
- Submit completed tasks
- Start/stop timers for own tasks
- View own time entries
- Cannot: Assign tasks, approve work, modify task descriptions
- Cannot: See other developers' tasks (except team summary)

**Dashboard Access**:
- Own assigned tasks
- Task submission interface
- Own time tracking
- Own performance report
- Feedback and comments on submissions
- Team communication channels

**Visibility Scope**: Own tasks and project context only

---

### Intern

**Primary Responsibility**: Supervised learning and task execution

**Key Responsibilities**:
- Execute assigned tasks under supervision
- Learning and skill development
- Support team projects
- Ask for guidance regularly
- Build professional experience
- Follow policies and guidelines

**System Permissions**:
- View own assigned tasks only
- Submit completed tasks
- Start/stop timers for own tasks
- View own time entries
- Cannot: Assign tasks, modify descriptions, see other team members' data
- Cannot: Create projects or teams

**Dashboard Access**:
- Own assigned tasks
- Task submission interface
- Own time tracking
- Own performance report
- Feedback from Team Lead
- Project overview (context only)

**Visibility Scope**: Own tasks only (maximum data isolation for learning)

---

## Permission Matrix

| Action | Admin | Exec Officer | Project Manager | HR Manager | Marketing Manager | Team Lead | Senior Dev | Junior Dev | Intern |
|---|---|---|---|---|---|---|---|---|---|
| Create Project | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Team | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Task | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Assign Task | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Submit Task | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Approve Task | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| View All Data | ✅ | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| Manage Users | ✅ | ⚠️ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Audit Logs | ✅ | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Override Decision | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Talk to Client | ✅ | ⚠️ | ✅ | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ |

**Legend**: ✅ Full Permission | ⚠️ Limited/Conditional Permission | ❌ No Permission

---

## Data Access Rules

### What Each Role Can See

**Admin**: Everything (no restrictions)

**Executive Officer**: All projects, teams, tasks, and performance data (not audit logs)

**Project Manager**: Only assigned projects, teams, tasks, and team member data

**HR Manager**: User roster, performance metrics (compliance only), personnel data

**Marketing Manager**: Project completion metrics only

**Team Lead**: Only own team members, assigned tasks, team data

**Senior Developer**: Own tasks, team roster (read-only), team performance summary

**Junior Developer**: Own tasks, project context only

**Intern**: Own tasks only

---

## Escalation & Override Authority

### When Decisions Can Be Escalated

**Task Dispute**: Developer disagrees with rejection
- Team Lead tries to resolve
- If unresolved: Escalate to Project Manager
- If unresolved: Escalate to Admin

**Performance Dispute**: Disagreement with evaluation
- Team Lead discusses
- Escalate to Project Manager
- Escalate to HR Manager / Admin

**Project Scope**: Disagreement on timeline/deliverables
- Project Manager makes decision
- If critical: Escalate to Executive Officer
- Final authority: Admin

**Client Issue**: Critical client concern
- Project Manager handles
- If serious: Escalate to Executive Officer
- Final authority: Admin

---

## Role Transition & Changes

### Promotion (e.g., Junior → Senior)
- HR Manager coordinates
- Project Manager approves
- Admin confirms
- System role updated
- Old role permissions revoked
- New permissions granted
- Change logged in audit trail

### Demotion or Role Change
- Same approval process as promotion
- Performance improvement plan may apply
- User notified of reason and new permissions
- Change documented

### Termination
- HR Manager initiates
- All access revoked immediately
- Active tasks reassigned
- Final performance report generated
- System access disabled
- Data ownership transferred

---

## Cross-Functional Permissions

### Project Manager + Team Lead (Same Project)
- Project Manager creates high-level tasks
- Team Lead breaks into subtasks
- Communication flows both directions
- Project Manager can override Team Lead decisions
- Both can email/track client

### Senior + Junior Developer (Same Team)
- Senior can informally mentor Junior
- Senior cannot officially assign tasks (Team Lead does)
- Junior can ask Senior for help
- Neither has authority over other
- Both report to Team Lead

### Executive Officer + Project Manager
- Executive Officer supervises Project Managers
- Executive Officer can review/override Project Manager decisions
- Project Manager reports directly to Executive Officer
- Communication protocol: PM → Exec Officer → Admin

---

## Permission Boundaries

### What NO Role Can Do
- Create multiple admin accounts (only Admin)
- Modify another user's role or permissions
- Delete another user (only Admin can)
- Override audit logs or modify them
- Delete tasks or projects permanently (Archive only)
- Access other users' passwords or authentication

### Prohibited Actions
- Developer communicating directly with client (unauthorized)
- Accessing another team's data
- Using another user's login
- Changing own role or permissions
- Circumventing access controls

### Enforcement
- Violations detected through audit logs
- Investigated and documented
- Corrective action applied (warning, suspension, termination)
- Repeat violations result in escalation

---

## Special Permissions

### Emergency Access (Break-Glass)
- **When**: System locked out or critical issue
- **Who**: Admin only (requires approval from 2 executives)
- **Duration**: 4 hours maximum
- **Logging**: Full audit trail
- **Review**: Post-incident required

### Temporary Elevation
- Project Manager can request Team Lead authorization
- Approval by Project Manager required
- Duration specified (e.g., 1 week)
- Automatic reversion after duration
- Audit logged

### Guest / External Access (If Applicable)
- Limited to specific project
- Read-only access to project data
- Cannot access time/performance data
- Limited duration
- HR Manager approval required

---

## Permission Review & Audit

- **Quarterly**: Admin reviews all role assignments
- **Annual**: Comprehensive permission audit
- **Post-Incident**: Review if breach suspected
- **On Hire/Termination**: Verify appropriate permissions
- **Audit Trail**: All permission changes logged

---

## Policy Violations

If user exceeds their permissions:

**First Violation**: Written warning, retraining on role boundaries

**Repeated Violations**: Escalating warnings, possible suspension

**Serious Violation**: Immediate access revocation, investigation, possible termination

---

## Questions About Permissions

- **General Questions**: Consult this document or ask your manager
- **Access Request**: Submit request to HR Manager with business justification
- **Permission Issue**: Report to HR Manager immediately
- **Appeal Permission Denial**: Submit written appeal to Admin through HR Manager

---

**Last Updated**: April 28, 2026  
**Next Review**: April 28, 2027

---

## 3. Team Lead
**Primary Responsibility**: Execute project work within the team. Manage team members, assign daily tasks, and ensure delivery.

**Primary Responsibilities**:
- Lead the execution of assigned project work
- Break down Manager-assigned tasks into daily subtasks
- Assign daily work to team members
- Review task submissions from team members
- Ensure team meets deadlines and quality standards
- Report progress to Manager
- Mentor and support team members
- Identify and escalate blockers or risks
- Evaluate team member performance

**System Permissions**:
- Assign tasks to team members
- View all team member tasks and time logs
- Approve or reject task submissions
- View team performance dashboards
- Access team reports and activity logs
- Create sub-tasks within assigned project tasks
- Update task status and progress

**Scope**: Full visibility and control within assigned team only. Cannot see other teams or global data.

**Dashboard**:
- Team member assignments and status
- Task progress and deadlines
- Team performance metrics
- Individual task submissions for review
- Daily and weekly team reports

---

## 4. Intern / Employee
**Primary Responsibility**: Execute assigned work, log time accurately, and submit deliverables.

**Primary Responsibilities**:
- Complete assigned tasks within deadlines
- Log working hours accurately between 9 AM and 5 PM
- Maintain quality in all deliverables
- Communicate issues or blockers promptly
- Submit completed work for Team Lead review
- Follow all policies and company standards

**System Permissions**:
- View own assigned tasks
- Start and stop work timer
- Log time entries
- Submit completed tasks
- View own performance and task history
- Access resources and documentation relevant to tasks

**Restrictions**:
- Cannot view other team members' tasks
- Cannot modify other users' time logs
- Cannot communicate directly with clients
- Cannot create or assign tasks
- Cannot approve or reject submissions
- Cannot access other teams' data

**Dashboard**:
- Personal task assignments
- Task timeline and deadlines
- Personal performance metrics
- Submit task deliverables
- View task feedback and reviews

---

## Permission Categories

### Team Management
- `team.create`: Create new teams (Manager)
- `team.edit`: Edit team settings (Manager)
- `team.member.assign`: Assign team members (Manager)
- `team.member.remove`: Remove team members (Manager)

### Task Management
- `task.create`: Create new tasks (Manager, Team Lead)
- `task.assign`: Assign tasks to users (Manager, Team Lead)
- `task.read`: View tasks (based on role and scope)
- `task.update`: Update task details (Manager, Team Lead)
- `task.submit`: Submit completed task (Intern/Employee)
- `task.review`: Approve/reject submission (Manager, Team Lead)

### Time Tracking
- `timer.start`: Start work timer (Intern/Employee)
- `timer.stop`: Stop work timer (Intern/Employee)
- `time.log.view`: View time logs (based on scope)
- `time.log.edit`: Modify time entries (Manager, Admin)

### Client Communication
- `client.communicate`: Direct client contact (Manager, authorized Team Leads)
- `client.requirement`: Document requirements (Manager)
- `client.report`: Send status updates (Manager)

### Reporting
- `report.personal.view`: View own reports (All)
- `report.team.view`: View team reports (Manager, Team Lead)
- `report.system.view`: View system-wide reports (Admin)

---

## Access Control Rules
- **Admin** sees all data across all teams and projects
- **Manager** sees only their assigned teams and team members
- **Team Lead** sees only their assigned team members and tasks
- **Intern/Employee** sees only their own assigned tasks and personal data
- Role elevation requires explicit approval from Admin
- Access is denied by default; permissions must be explicitly granted
