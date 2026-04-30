# Task Management

## Purpose

The task management system organizes work into clearly defined units with ownership, deadlines, quality standards, and tracking. Tasks flow through a structured lifecycle from creation through approval and completion, enabling transparent project management and performance measurement.

---

## Task Creation Authority

### Who Can Create Tasks?

| Role | Authority | Scope |
|---|---|---|
| **Admin** | Full | Create any task in system |
| **Executive Officer** | Full | Create any operational task |
| **Project Manager** | Full | Create project-level tasks for assigned projects |
| **Team Lead** | Full | Create team-level subtasks for assigned project |
| **Senior Developer** | Limited | Cannot assign to others; only self-assign (rare) |
| **Junior Developer** | None | Cannot create tasks |
| **Intern** | None | Cannot create tasks |

### Task Hierarchy

```
PROJECT-LEVEL TASK (created by Project Manager)
  └─ TEAM-LEVEL SUBTASK (created by Team Lead)
      └─ DAILY WORK ITEM (assigned to individual developer)
```

**Creator Responsibility**: Whoever creates task ensures:
- Clear, specific definition
- Realistic timeline and effort estimate
- Appropriate priority level
- Clear acceptance criteria
- Correct assignment target

---

## Task Lifecycle

### 1. Create (Planning)
**Who**: Project Manager or Team Lead

**Actions**:
- Define task with complete specifications
- Estimate effort (in hours)
- Set deadline and priority
- Define acceptance criteria
- Link to project or parent task
- Create in system

**Task Data Captured**:
- Title and description
- Project context
- Estimated effort
- Deadline and priority
- Acceptance criteria
- Parent task (if subtask)
- Other metadata

---

### 2. Assign (Allocation)
**Who**: Project Manager or Team Lead (based on task level)

**Process**:
- Assign to appropriate person based on:
  - Skill match
  - Workload and availability
  - Development/learning opportunity
  - Task complexity
- Send notification to assignee
- Assignee acknowledges task
- Task moves to "Assigned" status

---

### 3. Start (Acknowledgment)
**Who**: Developer assigned to task

**Process**:
- Developer receives task notification
- Reviews task details and acceptance criteria
- Asks clarifying questions if needed
- Indicates readiness to start
- May log notes on initial analysis

---

### 4. Work (Execution)
**Who**: Developer assigned to task

**Process**:
- Developer works on task
- Starts timer when work begins
- May stop and restart timer
- Logs time to task
- Updates status periodically
- Communicates blockers or issues

**Expected**:
- Work progresses toward completion
- Time entries logged accurately
- Status updates helpful
- Communication if blocked

---

### 5. Submit (Completion & Review)
**Who**: Developer has completed task

**Process**:
- Developer marks task as complete
- Submits work/deliverable
- Includes submission notes:
  - What was completed
  - Any limitations or known issues
  - Time logged
  - Any questions for reviewer
- Task moved to "Submitted" status
- Reviewer notified

---

### 6. Review (Quality Check)
**Who**: Team Lead (default) or Project Manager (escalation)

**Process**:
- Reviewer examines submitted work
- Checks against acceptance criteria
- Reviews time logs for reasonableness
- Tests functionality (if applicable)
- Evaluates quality and completeness

**Reviewer Decision**:
- **Approve**: Work meets criteria
- **Reject**: Work requires revision
- **Request Changes**: Minor modifications needed

---

### 7. Approve/Reject Decision
**Who**: Reviewer (Team Lead or Project Manager)

**Outcome A: Approved**
- Task marked as "Approved"
- Time entries finalized
- Developer notified
- Task counts toward metrics
- Closed or moved to next phase

**Outcome B: Rejected**
- Task marked as "Rejected"
- Specific feedback provided
- Developer asked to revise
- Task moves back to "In Progress"
- Time entries retained

**Outcome C: Changes Requested**
- Smaller scope than rejection
- Developer makes additional changes
- Resubmitted by developer
- Reviewed again

---

### 8. Close (Completion & Archive)
**Who**: System (automatic) or Team Lead (manual)

**Process**:
- Approved task automatically closed after 24 hours
- Or Team Lead manually closes
- Task moved to completed status
- Final time logged
- Time entries locked
- Task archived but still accessible

---

## Task Fields & Metadata

### Required Fields
- **ID**: Unique task identifier (auto-generated)
- **Title**: Concise task name (< 50 characters)
- **Description**: Full task requirements and context
- **Project**: Associated project link
- **Assignee**: Person responsible for task
- **Team**: Team context (if applicable)
- **Deadline**: Due date and time
- **Priority**: High / Medium / Low
- **Estimated Hours**: Expected effort
- **Status**: Pending → In Progress → Submitted → Approved → Closed
- **Created By**: User who created task
- **Created At**: Timestamp

### Optional Fields
- **Parent Task**: Link to parent (if subtask)
- **Acceptance Criteria**: How to judge completion
- **Subtasks**: Child tasks (if parent)
- **Tags**: For categorization
- **Attachments**: Files or references
- **Comments**: Thread for discussion

### Tracker Fields
- **Time Logged**: Total hours spent
- **Actual Hours**: Final effort spent
- **Variance**: Estimated vs. actual
- **Started At**: When work began
- **Completed At**: When submitted
- **Reviewed By**: Reviewer name
- **Review Notes**: Feedback and decisions
- **Revision Count**: Number of revisions
- **Revision History**: Previous versions

---

## Task Status Definitions

### Pending
- **State**: Task created, awaiting work to begin
- **Assignee Action**: Acknowledge and plan
- **Duration**: Usually 0-1 days
- **Status Indicator**: Waiting

### In Progress
- **State**: Developer actively working on task
- **Evidence**: Timer running or manual time entries being logged
- **Duration**: Expected effort hours
- **Status Indicator**: Active work

### Submitted
- **State**: Developer completed work and submitted for review
- **Deliverable**: Work committed to system
- **Duration**: Time for review (usually 24-48 hours)
- **Status Indicator**: Waiting for reviewer

### Approved
- **State**: Reviewer accepted the work as complete
- **Criteria Met**: Satisfies acceptance criteria
- **Visible To**: User marked complete, metrics updated
- **Status Indicator**: Closed / Done

### Rejected
- **State**: Reviewer identified issues, task returned for work
- **Reason**: Specific feedback provided
- **Developer Action**: Revise and resubmit
- **Status Indicator**: Back to In Progress

### Closed
- **State**: Task complete and archived
- **Finality**: No further changes
- **Access**: Visible in history but locked
- **Duration**: Permanent (searchable)

---

## Priority Levels & Guidelines

### High Priority
**Characteristics**:
- Critical path item
- Blocking other tasks
- Client-facing deliverable
- Business-critical
- Time-sensitve

**Guidelines**:
- Complete before Medium/Low
- May require additional resources
- Escalate if blocked
- User reassign if person busy

**Example**: Core feature for delivery,  blocking other tasks

### Medium Priority
**Characteristics**:
- Standard project work
- Important but not critical
- No blocking dependencies
- Can be scheduled flexibly
- Normal effort

**Guidelines**:
- Complete after High, before Low
- Schedule when capacity available
- Normal review timeline
- Standard effort estimate

**Example**: Secondary feature, UI refinement, documentation

### Low Priority
**Characteristics**:
- Enhancement or nice-to-have
- Optional or improvement
- No blocking dependencies
- Could be deferred
- Lower risk if delayed

**Guidelines**:
- Complete after High/Medium
- Can be deferred if needed
- Assign to learning developers
- Flexible timeline

**Example**: UI polish, minor optimization, future enhancement

---

## Task Assignment Rules

### Assignment Principles
1. **Skill Match**: Assign to person with relevant skills
2. **Workload Balance**: Don't overload one person
3. **Learning Opportunity**: Stretch assignments for growth
4. **Complexity vs. Experience**: Match complexity to capability
5. **Diversity**: Variety of task types prevents boredom

### Assignment Examples

**Task Type → Who to Assign**:
- Core/Complex Feature → Senior Developer
- Standard Feature → Junior Developer or Senior
- Learning Opportunity → Intern with mentoring
- Urgent/Blocking → Available Senior Developer
- Routine Work → Any available developer
- Risky Task → Experienced person

---

## Escalation & Escalation

### When to Escalate Task

| Situation | Escalate To | Reason |
|---|---|---|
| Blocked (dependency) | Team Lead | Resolve dependency |
| Over effort budget | Team Lead | Discuss scope reduction |
| Quality concerns | Project Manager | Guidance on standard |
| Timeline risk | Project Manager | Adjust deadline |
| Skill mismatch | Team Lead | Reassign to better match |
| Dispute (deserved work) | Project Manager | Arbitrate |
| Policy violation | HR Manager | Compliance issue |

### Escalation Process
1. Developer notifies Team Lead of issue
2. Team Lead assesses and attempts resolution
3. If unresolved: Escalate to Project Manager
4. Project Manager makes decision
5. Decision communicated and implemented

---

## Subtask & Breakdown Strategy

### Project-Level Breakdown
- **Task**: Project Manager creates high-level requirement
- **Scope**: 2-5 day timeline to complete
- **Example**: "Build user authentication system"
- **Acceptance**: User can sign up, log in, change password

### Team-Level Subtasks
- **Task**: Team Lead breaks project task into subtasks
- **Scope**: 4-8 hours to complete in one day
- **Example**: "Implement password hashing with bcrypt"
- **Acceptance**: Code reviewed, tests passing

### Daily Assignments
- **Assignment**: Individual developer assigned subtasks
- **Scope**: 1-2 subtasks per developer per day
- **Capacity**: 8 hours per day team member time
- **Example**: "Add password reset email"

### Breakdown Best Practices
- Each subtask independently completable
- No interdependencies if possible
- Clear acceptance criteria
- Realistic effort estimate
- Links maintained to parent task
- Developer can understand quickly

---

## Review Process & Standards

### Team Lead Review
**Responsibility**: Default reviewer for team member submissions

**Review Criteria**:
- Does work meet acceptance criteria?
- Is code quality acceptable?
- Are time entries reasonable?
- Is there any unknown risk?

**Review Time**: 24-48 hours typically

**Team Lead Authority**:
- Approve tasks
- Reject with specific feedback
- Request clarifications
- Can delegate review to Senior Dev

### Project Manager Review
**Responsibility**: Review if:
- Task is high-complexity or high-risk
- Team Lead needs guidance
- Escalated from Team Lead
- Critical client deliverable

**Scope**: Verify Team Lead's review

### Admin Review
**Responsibility**: Override authority if needed
- Final authority on declined task appeals
- Review if policy concern
- Spot-check quality standards

---

## Audit & Tracking

### Complete Audit Trail
Every task action logged with:
- User who performed action
- Timestamp of action
- What changed
- Previous values
- New values
- Reason/notes (if applicable)

### Task History
- Creation time and creator
- All assignments and reassignments
- All status changes
- All submissions and reviews
- All rejections and resubmissions
- All time entries
- All comments and discussion

### Accessibility
- Developer can view own task history
- Team Lead can view team task history
- Project Manager can view project task history
- Admin can view all task history
- Used for performance evaluation
- Used for dispute resolution
- Used for lessons learned

### Retention
- Tasks retained indefinitely
- History searchable
- Accessible for 3+ years

---

## Common Task Scenarios

### Scenario 1: Simple Routine Task
- Clear requirements
- Straightforward to implement
- Assign to Junior/Intern
- Expected approval on first submission

### Scenario 2: Complex/High Risk Task
- Many edge cases
- Potential for bugs
- Assign to Senior Developer
- More thorough review
- May request testing/documentation

### Scenario 3: Learning Opportunity
- Stretch task for growth
- Pair with mentoring support
- Higher revision rate accepted
- Goal is learning, not pure speed

### Scenario 4: Blocked Task
- Waiting for dependency
- Cannot start yet
- Keep in "Pending" status
- Clear block noted
- Escalate to unblock

### Scenario 5: Disputed Work
- Developer thinks should be approved
- Reviewer disagrees
- Discussion and clarification
- Escalate if cannot resolve
- Document decision

---

## Performance Metrics from Tasks

Tasks generate key performance data:
- **Completion Rate**: Percentage of assigned tasks completed
- **Timeliness**: On-time vs. late submissions
- **Quality**: Approval rate (first submission approved)
- **Revision Rate**: Number of revisions needed
- **Effort Accuracy**: Actual vs. estimated hours
- **Task Volume**: Number of tasks handled
- **Consistency**: Steady completion vs. bursts

---

## Best Practices

### Defining Tasks
- Be specific and clear
- Avoid ambiguity
- Include acceptance criteria
- Realistic time estimate
- Appropriate priority
- Correct assignment

### Assigning Tasks
- Right person for the job
- Reasonable workload
- Growth opportunities
- Diverse task types
- Clear communication

### Task Execution
- Start/stop timers accurately
- Update status regularly
- Communicate blockers
- Ask questions early
- Submit quality work

### Task Review
- Timely feedback
- Specific improvement suggestions
- Acknowledge good work
- Fair standards application
- Document decisions

---

## Questions & Support

- **Task Creation**: Consult your Project Manager or Team Lead
- **Task Clarification**: Ask Team Lead or task creator
- **Blocked Task**: Report to Team Lead immediately
- **Dispute**: Discuss with Team Lead or escalate to Project Manager

---

**Last Updated**: April 28, 2026  
**Next Review**: July 28, 2026

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
