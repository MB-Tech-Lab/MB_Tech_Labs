# Task Management

## Purpose
The task management system organizes work into clearly defined units with ownership, deadlines, and quality standards. Tasks flow through a structured lifecycle from creation to approval and completion.

## Task Creation Authority
- **Admin**: Can create any task in the system
- **Manager**: Can create project-level tasks for assigned teams
- **Team Lead**: Can create team-level subtasks for assigned projects
- **Intern/Employee**: Cannot create tasks

## Task Hierarchy
```
Project-Level Task (created by Manager)
  └─ Team-Level Subtask (created by Team Lead)
      └─ Daily Work Item (assigned to Intern/Employee)
```

Managers create high-level project tasks. Team Leads break these into daily subtasks for team members.

## Task Lifecycle
1. **Create**: Manager/Team Lead defines task with complete specifications
2. **Assign**: Task assigned to a user or team
3. **Start**: User starts work timer and begins execution
4. **Work**: Task progresses with time tracking and status updates
5. **Submit**: User submits completed work for review
6. **Review**: Team Lead or Manager reviews and provides feedback
7. **Approve/Reject**: Task approved for completion or returned for revision
8. **Close**: Approved deliverable is finalized and archived

## Task Fields
- **Title**: Clear, concise task description
- **Description**: Detailed requirements and acceptance criteria
- **Project**: Linked project or client work
- **Assignee**: Responsible user
- **Team**: Team context (if applicable)
- **Priority**: High, Medium, Low
- **Deadline**: Due date and time
- **Estimated Hours**: Expected effort range
- **Status**: Pending → In Progress → Submitted → Approved/Rejected
- **Submission Notes**: User feedback on completion
- **Review Notes**: Reviewer feedback and decisions
- **Created By**: User who created the task
- **Created At**: Timestamp

## Task Status Definitions
- **Pending**: Task created and awaiting work to begin
- **In Progress**: User has started work and timer is active
- **Submitted**: User completed work and submitted for review
- **Approved**: Reviewer approved the submission, task is complete
- **Rejected**: Reviewer identified issues; task returned for revision

## Priority and Deadline Rules
- **High Priority**: Critical path items, client-facing deliverables
- **Medium Priority**: Standard project work
- **Low Priority**: Support and optional enhancements
- Deadlines are mandatory and tracked in performance metrics
- Missed deadlines directly impact individual and team evaluations
- Overdue tasks are flagged in admin and manager dashboards

## Subtask and Breakdown Strategy
- Manager assigns project-level tasks with 2-5 day timelines
- Team Lead breaks these into 4-8 hour daily subtasks
- Each subtask is specific, measurable, and completable in one work session
- Subtasks maintain linkage to parent project task for reporting

## Review Process
- **Team Lead Review** (default): Team Lead reviews submissions from team members
- **Manager Review** (escalation): Manager reviews high-impact or complex submissions
- **Admin Review** (override): Admin can review any submission or override decisions
- Feedback is specific and actionable
- Rejections include clear revision requirements
- Revision history is maintained for audit

## Audit and Tracking
- Every task action is logged with timestamp and user
- Task history includes creation, assignment, status updates, submissions, reviews, and decisions
- Time logs are attached to tasks and visible to authorized reviewers
- Admin can view complete task audit trail for any user at any time
- Rejected tasks retain revision history and all time entries
