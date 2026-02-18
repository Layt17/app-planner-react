# Planner App - Frontend Documentation

## Overview
Task planner application built with React and TypeScript. Allows users to create, view, and delete tasks organized by days and hours.

## Project Structure

```
src/
├── components/
│   ├── day.c.tsx          # Main day component with task management
│   ├── week.c.tsx         # Week view component
│   └── main.c.tsx         # Main layout component
├── App.tsx                # Root component
├── App.css                # Global styles
└── index.tsx              # Entry point
```

## Key Features

### Task Management
- **Create Tasks**: Add new tasks with description and automatic date/time assignment
- **View Tasks**: Browse tasks by day and hour in modal windows
- **Delete Tasks**: Remove tasks with delete button in task details modal
- **Timezone Support**: Tasks automatically account for device timezone

### UI Components

#### Modal System
Three-layer modal system:
1. **Hour Modal** - Lists tasks for selected hour
2. **Detail Modal** - Shows full task description with delete option
3. **Create Modal** - Form to create new task

#### Buttons
- **Add Task Button** - Green (#4CAF50), creates new task in modal header
- **Delete Button** - Gray (#999999) background, turns red (#d32f2f) on hover
- **Expand Button** - Gray background, only scales on hover (no color change)
- **Save Button** - Green, saves new task

#### Visual Indicators
- **Busy Hour Dots** - Green dots (#33cc33) in left corner indicate hours with tasks
- **+N Indicator** - Shows count of additional tasks if more than 3

## Styling

### Key CSS Classes
- `.day` - Day container with hours
- `.hour` - Individual hour block
- `.modal-overlay` - Semi-transparent overlay
- `.modal-content` - Modal window with animations
- `.busyHour` - Indicator dots for busy hours
- `.delete-task-btn` - Delete button styling
- `.expand-btn` - Details button styling

### Animations
- `slideDownFadeIn/Out` - Hour modal animations
- `slideRightFadeIn/Out` - Detail modal animations
- `slideUpFadeOut` - Create modal animations

## Data Flow

1. **State Management** - Uses React Context (App.tsx state)
2. **Task Data** - Stored in `actionsDataOnCurrentWeek` array
3. **Date Format** - ISO 8601 with timezone info: `YYYY-MM-DDTHH:mm:ss±HH:MM`
4. **Filtering** - Tasks filtered by date and hour for display

## Task Structure

```typescript
{
  date: string;        // ISO date with timezone
  name: string;        // Task description
  // May also have:
  time?: string;       // Alternative date field
  id?: string;         // Unique identifier
  [key: string]: any;  // Other fields from backend
}
```

## Important Functions

### day.c.tsx
- `handleSaveTask()` - Creates new task with timezone info
- `handleDeleteTask()` - Removes task from list
- `openCreateModal()` - Opens task creation form
- `closeDetailModal()` - Closes task details

### App.tsx
- `updateAppState()` - Updates task list across components
- `useEffect()` - Fetches initial data from API

## API Integration

- **Endpoint**: `http://85.239.43.136:8000/api`
- **Method**: GET
- **Response**: Array of tasks with `date` and `name` fields

## Timezone Handling

Device timezone is automatically detected using `getTimezoneOffset()`. Tasks are stored with full timezone information to ensure correct display across different device timezones.

Example:
- Device timezone: UTC+3
- Task time: 15:30
- Stored as: `2026-02-15T15:30:00+03:00`

## Touch Support

- **Swipe Right** - Closes detail modal
- **Swipe Left** - Closes hour modal
- **Requires**: Movement > 50px for detection
