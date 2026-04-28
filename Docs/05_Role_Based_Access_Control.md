# 05_Role_Based_Access_Control.md

# MB Tech Labs - Role-Based Access Control (RBAC)

## Overview

The Role-Based Access Control (RBAC) system implements granular permission management across MB Tech Labs platform. It defines user roles with specific capabilities and access levels, ensuring users can only perform actions appropriate to their responsibilities while maintaining system security and data integrity.

## RBAC Architecture

### Core Components
- **Roles**: Defined user categories with associated permissions
- **Permissions**: Granular access rights to specific resources and actions
- **Users**: Platform users assigned to roles
- **Resources**: Protected system components and data

### Permission Model
- **Object-Based**: Permissions tied to specific resources
- **Action-Based**: CRUD operations (Create, Read, Update, Delete)
- **Contextual**: Permissions based on resource ownership or status
- **Hierarchical**: Role inheritance and permission escalation

## User Roles and Permissions

### 1. Admin Role
**Description**: Full system access for platform administrators

**Permissions**:
- **User Management**: Create, read, update, delete all users
- **Role Assignment**: Assign and modify user roles
- **System Configuration**: Modify system settings and configurations
- **Financial Access**: View all billing and financial data
- **Audit Access**: View system logs and audit trails
- **Project Oversight**: Full access to all projects and tasks
- **Communication**: Access to all communication channels

**Scope**: Complete platform access

### Work Management Access
Admins are responsible for all task and time tracking oversight. This includes approving task submissions, reviewing time logs, flagging inactivity, and enforcing monitoring policies.

Key Admin responsibilities:
- Assign and manage tasks across the platform
- Approve or reject completed tasks
- Review daily work logs and activity trails
- Evaluate attendance and productivity under the 9 AM – 5 PM model
- Enforce acceptable use and evaluation policies

### 2. Manager Role
**Description**: Business operations management and team oversight

**Permissions**:
- **Team Management**: View and manage assigned team members
- **Project Management**: Create, update, and oversee projects
- **Financial Oversight**: View project budgets and billing
- **Performance Analytics**: Access team and project analytics
- **Client Communication**: Direct client interaction
- **Resource Allocation**: Assign tasks and resources
- **Work Model Oversight**: Approve WFH/WFO schedules and attendance exceptions
- **GitHub Coordination**: Approve repository access and review branches

**Scope**: Business unit or department level

### 3. Team Leader Role
**Description**: Technical team leadership and project coordination

**Permissions**:
- **Team Supervision**: Monitor team member activities
- **Task Assignment**: Create and assign development tasks
- **Code Review**: Access to team code repositories
- **Project Updates**: Update project status and milestones
- **Quality Assurance**: Review and approve deliverables
- **Team Communication**: Coordinate with team members
- **Work Model Support**: Validate remote work reports and office collaboration sessions

**Scope**: Development team level

### 4. Senior Developer Role
**Description**: Experienced developers with advanced technical capabilities

**Permissions**:
- **Code Development**: Full development access to assigned projects
- **Technical Design**: Contribute to system architecture decisions
- **Mentorship**: Guide junior developers
- **Code Review**: Review pull requests and code quality
- **Deployment**: Deploy code to staging environments
- **Technical Documentation**: Create and maintain documentation

**Scope**: Project-specific with technical leadership

### 5. Junior Developer Role
**Description**: Entry-level developers with supervised access

**Permissions**:
- **Code Development**: Development access to assigned tasks
- **Code Review**: Participate in code review processes
- **Testing**: Execute unit and integration tests
- **Documentation**: Update task and feature documentation
- **Bug Reporting**: Report and track software issues

**Scope**: Task-specific with supervision

### 6. Intern Role
**Description**: Training role for new team members with monitored work responsibilities

**Permissions**:
- **Task Access**: View and execute assigned tasks
- **Time Tracking**: Start/stop timers and submit daily work logs
- **Submission**: Submit completed tasks for review
- **Performance Visibility**: View personal performance reports and task history
- **Guided Access**: Operate under supervisor approval and feedback

**Scope**: Training and task execution with accountability

### 7. HR Role
**Description**: Human resources management and employee administration

**Permissions**:
- **Employee Records**: View and update employee information
- **Recruitment**: Manage job postings and applications
- **Performance Reviews**: Access to performance evaluation data
- **Training Programs**: Manage employee development programs
- **Attendance Tracking**: Monitor employee attendance and time logs
- **Leave Approval**: Approve WFH/WFO leave and exceptions
- **Productivity Review**: Access role-based productivity metrics

**Scope**: Human resources operations

### 8. Marketing Role
**Description**: Marketing content and campaign management

**Permissions**:
- **Content Management**: Create and edit marketing content
- **Campaign Management**: Plan and execute marketing campaigns
- **Analytics Access**: View marketing performance metrics
- **Lead Management**: Access and manage sales leads
- **Brand Assets**: Manage company branding materials

**Scope**: Marketing and sales operations

### 9. Client Role
**Description**: External clients with project-specific access

**Permissions**:
- **Project Access**: View assigned projects and milestones
- **Communication**: Contact project team and support
- **Billing Access**: View invoices and payment history
- **File Access**: Download project deliverables
- **Feedback Submission**: Provide project feedback and reviews

**Scope**: Client-specific projects only

## Permission Categories

### System Permissions
- **user.create**: Create new user accounts
- **user.read**: View user information
- **user.update**: Modify user details
- **user.delete**: Remove user accounts
- **system.config**: Modify system settings
- **system.logs**: Access system logs

### Project Permissions
- **project.create**: Create new projects
- **project.read**: View project details
- **project.update**: Modify project information
- **project.delete**: Remove projects
- **project.assign**: Assign team members to projects

### Task Permissions
- **task.create**: Create new tasks
- **task.read**: View task details
- **task.update**: Modify task status and details
- **task.assign**: Assign tasks to users
- **task.delete**: Remove tasks

### Financial Permissions
- **billing.create**: Generate invoices
- **billing.read**: View billing information
- **billing.update**: Modify invoice details
- **billing.delete**: Cancel invoices
- **payment.process**: Process payments

### Work Model Permissions
- **attendance.checkin**: Record attendance and work sessions
- **attendance.checkout**: Close work sessions and attendance records
- **leave.approve**: Approve or decline leave requests
- **wfh.request**: Submit remote work requests
- **wfo.schedule**: Manage office attendance schedules
- **activity.view**: View activity logs and work reports

### Development Workflow Permissions
- **repo.create**: Provision new GitHub repositories
- **repo.access**: Manage repository membership
- **repo.review**: Review and approve pull requests
- **repo.deploy**: Trigger deployments from GitHub
- **branch.protect**: Configure branch protection rules

### Communication Permissions
- **message.send**: Send messages
- **message.read**: View messages
- **message.delete**: Delete messages
- **file.upload**: Upload files
- **file.download**: Download files

## Permission Implementation

### Database Schema
```sql
-- Roles table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role permissions junction table
CREATE TABLE role_permissions (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- User roles junction table
CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    assigned_by INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);
```

### Django Implementation
```python
# Permission checking decorator
def permission_required(permission_name):
    def decorator(view_func):
        def wrapper(request, *args, **kwargs):
            if not request.user.has_permission(permission_name):
                return JsonResponse({'error': 'Permission denied'}, status=403)
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator

# Usage in views
@permission_required('project.create')
def create_project(request):
    # Project creation logic
    pass
```

## Access Control Logic

### Permission Checking
1. **User Authentication**: Verify user identity
2. **Role Retrieval**: Get user's assigned roles
3. **Permission Aggregation**: Collect all permissions from roles
4. **Context Evaluation**: Check resource ownership and status
5. **Access Decision**: Grant or deny access

### Hierarchical Permissions
- **Role Inheritance**: Higher roles inherit lower role permissions
- **Permission Escalation**: Temporary permission grants for specific tasks
- **Delegation**: Ability to delegate permissions to subordinates

## Security Considerations

### Principle of Least Privilege
- Users receive minimum permissions required for their duties
- Regular permission audits and cleanup
- Automatic permission revocation for inactive users

### Audit and Monitoring
- Permission change logging
- Access attempt tracking
- Security incident investigation support

### Data Protection
- Sensitive data access restrictions
- Encryption for permission-related data
- Secure permission assignment processes

## Role Management Interface

### Admin Features
- **Role Creation**: Define new roles with custom permissions
- **Permission Assignment**: Assign permissions to roles
- **User Role Management**: Assign roles to users
- **Bulk Operations**: Mass role assignments and updates

### User Interface
- **Role Display**: Show current user roles and permissions
- **Permission Explanation**: Clear descriptions of access rights
- **Role Change Requests**: Workflow for role modification requests

## Integration with Other Systems

### Authentication System
- Role information included in JWT tokens
- Permission validation in authentication middleware
- Session management based on role permissions

### API Access Control
- Permission-based API endpoint access
- Request filtering based on user roles
- Response data filtering for security

### Frontend Components
- UI element visibility based on permissions
- Route protection for role-based navigation
- Action availability in user interfaces

## Future Enhancements

### Advanced RBAC Features
- **Attribute-Based Access Control (ABAC)**: Context-aware permissions
- **Time-Based Permissions**: Temporary access grants
- **Geographic Restrictions**: Location-based access control
- **Device-Based Permissions**: Device-specific access rules

### Workflow Integration
- **Approval Workflows**: Multi-step permission approvals
- **Automated Role Assignment**: Rule-based role assignments
- **Permission Analytics**: Usage pattern analysis and optimization

This RBAC system ensures secure, controlled access to MB Tech Labs platform resources while providing flexibility for business operations and future scalability.