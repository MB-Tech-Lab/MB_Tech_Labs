# Team Management

## Purpose

Team Management handles the creation, organization, and lifecycle of teams. Teams are operational units formed around specific projects and are managed by **Project Managers** with **Team Leads** responsible for execution.

---

## Team Concept

A **team** is a structured group organized around a specific project or client engagement. Teams:
- Are temporary to medium-term organizational units
- Have defined members with specific roles
- Report through Team Lead to Project Manager
- Execute project work under defined scope
- Maintain clear accountability and performance tracking

---

## Team Structure

Each team has a defined composition:

```
Project Manager
  └─ Team (Specific Project)
      ├─ 1 Team Lead (Technical Leadership)
      ├─ 1-2 Senior Developers (Core Development)
      ├─ 1-3 Junior Developers (Task Execution)
      └─ 1-2 Interns (Learning + Execution)
```

**Size Guidelines**:
- **Small Project**: 1 Team Lead + 1-2 Developers (3 total)
- **Medium Project**: 1 Team Lead + 2-3 Developers (3-4 total)
- **Large Project**: 1 Team Lead + 1 Senior Dev + 2-3 Junior Devs + 1 Intern (5-6 total)
- **Maximum Team Size**: 8 members (to maintain manageability)

---

## Team Lifecycle

### 1. Team Creation

**Who**: Project Manager (creates), Executive Officer (approves if significant)

**When**: During Project Phase 4 (Team Assignment)

**Process**:
- Project Manager identifies team needed
- Project Manager defines:
  - Team name (tied to project)
  - Team scope and duration
  - Skills required
  - Team size estimate
  - Start and end dates
- Team created in system
- Configuration and settings established

**Team Fields**:
- Team Name: `[ProjectName_Team]` or similar
- Project Link: Reference to associated project
- Start Date: When team begins work
- End Date: Expected or actual completion
- Team Lead: Assigned Team Lead
- Members: List of team members
- Skills: Required technical skills
- Description: Project context for team
- Status: Active, Paused, Completed

**Deliverable**: Team created and configured in system

---

### 2. Team Member Assignment

**Who**: Project Manager (assigns), Team Lead (confirms)

**When**: Immediately after team creation

**Process**:
- Project Manager identifies needed skills and experience mix
- Project Manager recruits team members from available pool
- Executive Officer approves major team allocations
- Team members notified of assignment
- Assignments recorded in system
- Team Lead meets with all members

**Assignment Considerations**:
- **Skills Match**: Assign people with right skills for project
- **Experience Balance**: Mix senior and junior for knowledge transfer
- **Workload**: Don't overload people across multiple teams
- **Growth**: Opportunity for skill development
- **Personality**: Team dynamics and communication
- **Availability**: Resource allocation and capacity

**Rules**:
- One person = One primary team (cannot split focus)
- Senior Devs may mentor multiple interns informally
- Team Lead manages only one team (focus requirement)
- Cross-team needs must be approved by Project Managers

**Deliverable**: Team members assigned and confirmed

---

### 3. Team Execution

**Who**: Team Lead (manages), Team Members (execute)

**When**: Throughout project lifecycle

**Process**:
- Team Lead communicates project context and timeline
- Tasks broken down by Team Lead
- Team members execute daily work
- Project Manager monitors progress
- Regular check-ins (1:1 and team level)
- Issues escalated promptly
- Status reported to Project Manager

**Team Responsibilities**:
- Follow project plan and timeline
- Complete assigned tasks to quality standards
- Log time accurately
- Communicate issues and blockers
- Maintain professional collaboration
- Support team members

**Deliverable**: Consistent project progress execution

---

### 4. Team Performance Eval & Completion

**Who**: Team Lead (evaluation) + Project Manager (review)

**When**: Throughout execution + at project completion

**Process**:
- Team Lead evaluates team member performance
- Team performance metrics tracked
- Project Manager reviews team performance
- Individual performance ratings assigned
- Feedback provided to team members
- Lessons learned documented
- Team performance roll-up to project reporting

**Evaluation Criteria**:
- Task completion rate
- Quality of deliverables
- On-time submissions
- Collaboration and communication
- Problem-solving
- Growth and learning

**Deliverable**: Performance evaluations completed

---

### 5. Team Completion / Reassignment

**Who**: Project Manager

**When**: Project completion or team reassignment

**Process**:
- Project Manager determines if team dissolves or reassigns
- Final team report submitted
- Team members thanked and recognized
- Team members released to other projects
- Team archived in system

**Options**:
- **Dissolve**: Team members released to other projects
- **Reassign to New Project**: Team moved to another client project
- **Maintenance Mode**: Small team for ongoing support

**Deliverable**: Team completed and archived

---

## Team Lead Role & Responsibilities

### Who is Team Lead?

**Qualification**:
- Senior technical person with leadership capability
- Clear communication and mentoring ability
- Project context understanding
- Ability to manage tasks and timelines
- Team player and collaborative

**Appointment**:
- Recommended by Project Manager
- Approved by Executive Officer
- Confirmed with Team Lead directly

**One Team Per Lead**:
- Team Lead focuses on ONE team (prevents fragmentation)
- Full attention to team success
- Clear accountability

### Team Lead Core Responsibilities

1. **Technical Leadership**
   - Understand project requirements
   - Make technical decisions
   - Set code/work quality standards
   - Participate in code review

2. **Task Management**
   - Break project tasks into daily work
   - Assign tasks appropriately
   - Monitor task progress
   - Escalate blockers

3. **Team Management**
   - Communicate project context
   - Support team member growth
   - Facilitate collaboration
   - Resolve internal conflicts

4. **Quality Oversight**
   - Review task submissions
   - Approve/reject based on criteria
   - Provide constructive feedback
   - Continuous quality improvement

5. **Performance Tracking**
   - Monitor individual performance
   - Track metrics
   - Provide feedback
   - Document for evaluation

6. **Escalation**
   - Escalate issues to Project Manager
   - Escalate risks and risks
   - Escalate disputed decisions
   - Keep Project Manager informed

7. **Reporting**
   - Daily task progress updates
   - Weekly team summaries
   - Performance tracking
   - Issue/risk logs

---

## Team Member Roles

### Senior Developer (Senior Contributor)
- Execute core technical work
- Mentor Junior Developers
- Make technical recommendations
- Code review assistance
- Solve complex problems

### Junior Developer (Core Contributor)
- Execute assigned tasks
- Follow technical standards
- Ask questions and seek help
- Learn from experiences
- Support team goals

### Intern (Learning Focus)
- Execute simple assigned tasks
- Learn professional practices
- Ask many questions
- Gain hands-on experience
- Basic task completion

---

## Team Composition Best Practices

### Skill Mix
- Balance experience levels
- Ensure required skills present
- Avoid all-junior teams
- Plan for knowledge sharing

### Size Appropriateness
- Small projects: Small team (2-3 people)
- Large projects: Larger team (4-6 people)
- Scale with project complexity
- Don't over-staff

### Duration Alignment
- Short projects: Stable team for execution
- Long projects: Room for growth and transitions
- High-risk projects: More senior resources
- Maintenance projects: Smaller teams

### Growth Opportunities
- Include new people for learning
- Rotate people for skill development
- Mix experienced and learning-focused
- Mentor-mentee pairings

---

## Team Communication

### Internal Team Communication
- Daily team standup or status
- Slack or team channel for quick communication
- Weekly team sync meeting
- 1:1s between Team Lead and members

### Project Communication
- Weekly project status to Project Manager
- Any issues or risks escalated immediately
- Alignment on timeline and deliverables
- Change requests communicated early

### External Client Communication
- Project Manager is primary (authorized)
- Team Lead may attend meetings if invited
- Developers support with technical details (indirect)
- No direct developer-client communication

### Documentation
- Project context documented
- Task assignments clear in writing
- Decisions documented
- Changes documented

---

## Multi-Team Dynamics (If Applicable)

### Cross-Team Coordination
- Minimal if teams are isolated by project
- If shared resources needed: Approved by both Project Managers
- Executive Officer mediates priority conflicts
- Shared resources have clear time allocation

### Knowledge Sharing
- Team Leads can share experiences
- Best practices communicated across teams
- Learning from other teams' challenges
- Formal retrospectives (if applicable)

---

## Team Performance Dashboards

**Team Lead* sees**:
- All team members and current status
- Task assignments and progress
- Task submissions and reviews
- Team performance metrics
- Individual team member performance

**Project Manager sees**:
- Team composition and utilization
- Overall team performance
- Major risks or issues
- Team member performance summaries

**Admin sees**:
- All team information
- Comparative team performance
- Resource allocation
- Strategic team insights

---

## Team Dissolution & Member Feedback

### When Team Ends
- Final project deliverables completed
- Client acceptance received
- Team performance evaluated
- Team members released
- Team archived in system

### Feedback Provided
- Team Lead provides individual performance feedback
- Project Manager provides team performance feedback
- Documented in personnel records
- Shared with team members
- Used for future team composition

### Team Member Release
- Notification of project completion
- Thank you and recognition
- Next assignment (if known)
- Transition period (if applicable)
- Released to available resource pool

---

## Common Team Scenarios

### Scenario 1: New Team for New Project
- Project Manager creates team
- Assembles mix of experience levels
- Team Lead onboards team
- Clear project kickoff meeting
- Work begins

### Scenario 2: Scaling Existing Team
- Project grows in scope
- Additional team members added
- Workload rebalanced
- New members onboarded
- Timeline adjusted if needed

### Scenario 3: Team Member Replacement
- Member leaves or is reassigned
- Replacement recruited
- New member onboarded
- Knowledge transferred
- Workflow continues

### Scenario 4: Extended Team
- Project continues beyond initial plan
- Team may be reduced (maintenance mode)
- Larger scope: Team maintained
- Ongoing relationship: Stable team

---

## Best Practices

### Team Formation
- Take time to assemble right team
- Consider chemistry and fit
- Plan for growth
- Set expectations early

### Team Leadership
- Clear, consistent communication
- Support team member success
- Remove blockers quickly
- Provide timely feedback

### Team Performance
- Regular check-ins
- Transparent communication
- Celebrate wins
- Learn from challenges

### Team Growth
- Invest in people development
- Rotate roles for learning
- Mentoring culture
- Career pathing

---

## Questions & Support

- **Team Creation**: Contact Project Manager
- **Team Assignment**: Contact Project Manager / HR Manager
- **Team Conflicts**: Contact Team Lead or Project Manager
- **Performance Concerns**: Contact Team Lead or Project Manager

---

**Last Updated**: April 28, 2026  
**Next Review**: July 28, 2026

## Team Structure
Each team consists of:
- **1 Manager**: Primary point of contact, client liaison, task distributor
- **1 Team Lead**: Executes project, manages team members, reports to Manager
- **2+ Interns/Employees**: Execute assigned work under Team Lead supervision

## Team Lifecycle

### 1. Creation
- Manager creates a team in the system
- Team is linked to a specific client, project, or engagement
- Manager defines team name, description, and timeline
- Admin approves significant team allocations

### 2. Assignment
- Manager assigns Team Lead to the team
- Manager adds team members (interns/employees)
- Team Lead begins breaking down project work
- Initial task structure is established

### 3. Execution
- Team Lead assigns daily work to team members
- Team members execute tasks and log time
- Manager monitors progress and communicates with client
- Regular status updates and reviews occur

### 4. Completion
- Tasks are finalized and deliverables submitted
- Team performance is evaluated
- Client deliverables are handed over
- Team is archived or reassigned

## Team Fields
- **Team Name**: Clear descriptive name
- **Project/Client**: Linked project or client entity
- **Manager**: Assigned Manager
- **Team Lead**: Assigned Team Lead
- **Team Members**: List of Interns/Employees
- **Start Date**: Team creation date
- **End Date**: Expected or actual completion date
- **Budget/Allocation**: Resource allocation hours
- **Status**: Active, Paused, Completed
- **Description**: Project context and goals

## Manager Responsibilities (Team Creation)
- Define team structure based on project scope
- Assign qualified Team Lead
- Recruit and assign team members
- Establish project timeline and milestones
- Set up initial task allocation
- Define communication protocols with client

## Team Lead Responsibilities
- Lead team execution against project goals
- Break down project tasks into daily work
- Assign work to team members fairly and efficiently
- Monitor task progress and deadline compliance
- Review team member submissions
- Escalate issues to Manager
- Track team time and productivity
- Maintain team cohesion and communication

## Team Member Assignment Rules
- Team members can be assigned to only one active team at a time
- Team size should align with project scope and timeline
- Mix of experience levels is beneficial for knowledge transfer
- Capacity planning is required before assignment
- Team lead selection is critical to success

## Team Performance Tracking
- Daily task completion rates are tracked by team
- Deadline adherence is measured at team level
- Quality metrics are maintained
- Individual performance within team structure is kept
- Team reports are submitted to Manager for Admin review

## Multi-Team Operations
- Individual team members are assigned to one team
- Managers can oversee multiple teams
- Admin has visibility into all teams
- Cross-team resource sharing requires Manager and Admin coordination
- Team isolation ensures clear accountability

## Team Dashboards
- Team overview with members and current assignments
- Task progress board with status visualization
- Daily time tracking summary
- Performance metrics and trends
- Client communication status
- Risk and issue log
