# Time Tracking

## Purpose
The time tracking system captures accurate work hours and supports performance measurement and billing across teams and projects.

## Daily Working Hours
- Standard work window: **9 AM – 5 PM**
- Total available work time: **8 hours per day**
- Users should start and stop time tracking within this window
- Work sessions outside this window are logged as exceptions

## Timer Workflow

### Start Timer
- User selects an assigned task
- Confirms task details in the system
- Clicks "Start Timer"
- Timer begins tracking the work session

### Work Session Recording
- Timer continues running while user works
- User can view elapsed time
- Real-time synchronization to system

### Stop Timer
- User completes work on task
- Clicks "Stop Timer"
- Duration is calculated and recorded
- Total daily hours updated

## Logged Data Per Time Entry
- **Task ID**: Associated task
- **Start Timestamp**: When work began
- **End Timestamp**: When work ended
- **Duration**: Total time logged
- **Date**: Calendar date
- **Status**: Active, Paused, or Completed
- **User**: Who logged the time
- **Project**: Associated project for billing/reporting
- **Billable Flag**: Yes/No for client billing
- **Notes**: Optional context or work description

## Daily Time Aggregation
- System totals all time entries per user per day
- Total should generally equal 8 hours (less breaks)
- Partial days are tracked and reported
- Non-working days (weekends, holidays) are excluded

## Manual Time Entry
- Users may manually log time if timer wasn't used
- Requires:
  - Task selection
  - Start and end times
  - Duration calculation
  - Justification or context
- Subject to Team Lead or Manager approval
- Creates audit trail for review

## Idle and Inactive Time
The system may track:
- Gaps between timer sessions during work hours
- Time logged to a task but no work action recorded (based on future activity tracking)
- Extended periods without timer activity

**Admin/Manager Review**:
- Idle sessions are flagged for follow-up
- Context is requested from user if needed
- Patterns of idle time affect performance ratings

## Time Tracking by Role

### Intern / Employee
- Can start/stop timer for assigned tasks
- Can view own daily time logs
- Can submit manual time entries with approval
- Cannot edit or delete past entries

### Team Lead
- Can view team member time logs
- Can flag questionable entries for review
- Can request clarification on time entries
- Can override time entries if necessary (with audit note)

### Manager
- Can view team member time logs for assigned teams
- Can analyze time patterns and efficiency
- Can identify resource gaps or concerns
- Can generate time reports for Admin submission

### Admin
- Can view all user time logs across entire system
- Can override time entries with justification
- Can generate system-wide time analytics
- Can audit time data for compliance

## Compliance Rules
- Users must time log all work within the system
- Time entries should be accurate and honest
- Fake or inflated entries are policy violations
- Timers should reflect actual task work
- Gaps without explanation may affect performance

## Billing and Allocation
- Billable flag indicates time to bill to clients
- Non-billable time (training, admin, etc.) is tracked separately
- Projects track billable vs. non-billable hours
- Manager submits billable time for invoicing
- Cost analysis uses time data for project profitability

