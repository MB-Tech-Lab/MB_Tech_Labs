# Roles and Hierarchy

## Overview
The Work Management System operates with a clear hierarchical structure. Each role has defined responsibilities, permissions, and visibility levels.

## Role Hierarchy Model
```
Admin (Owner)
  └─ Manager (Multiple)
      └─ Team Lead (One per Team)
          └─ Intern / Employee (Multiple)
```

## 1. Admin (Owner)
**Primary Responsibility**: Full system control, oversight, and final authority on all decisions.

**Primary Responsibilities**:
- Oversee all teams, projects, and operations
- Review and approve high-level business decisions
- Evaluate overall performance and trends
- Make final stipend and refund decisions
- Manage role assignments and system access
- Set company-wide policies and standards

**System Permissions**:
- Full visibility into all users, teams, projects, tasks, and activity logs
- View all time logs and performance data
- Approve or reject any task submission
- Create, modify, or delete any system entity
- Generate system-wide reports and analytics
- Manage admin and manager role assignments
- Override any decision within the system
- Access audit trails and compliance records

**Dashboard**:
- System-wide performance metrics
- All teams and their status
- All users and their performance
- Financial and operational analytics
- Risk and compliance alerts

---

## 2. Manager
**Primary Responsibility**: Bridge between Admin and teams. Manage client relationships, gather requirements, create teams, and distribute work.

**Primary Responsibilities**:
- Communicate with clients to understand project requirements
- Create teams for assigned projects
- Assign Team Leads and team members
- Break down project work into manageable components
- Assign tasks to Team Leads or directly to team members
- Monitor team progress toward project goals
- Report status to Admin on a regular schedule
- Escalate issues and risks to Admin
- Evaluate team performance for reporting

**System Permissions**:
- Create and edit teams assigned to them
- Assign and remove team members
- Create project tasks and assign to teams or Team Leads
- View reports and performance data for assigned teams only
- Approve or reject task submissions from assigned teams
- Communicate with clients on behalf of MB Tech Labs
- Access team dashboards and analytics
- Submit reports to Admin

**Client Interaction**:
- Manager is the primary point of contact for clients
- Manager gathers and documents requirements
- Manager communicates project status and updates
- Manager is responsible for client satisfaction and communication

**Dashboard**:
- Assigned teams and their status
- Project progress and milestones
- Team member workload and performance
- Task completion and deadline metrics
- Reports ready for Admin submission

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
