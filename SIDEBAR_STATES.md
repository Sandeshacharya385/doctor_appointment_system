# Sidebar States Guide

## Desktop View

### Expanded State (Default)
```
┌─────────────────────────┬──────────────────────────────┐
│ 🏥 MediBook             │  Dashboard          🔔  👤   │
│    Healthcare System    │                              │
├─────────────────────────┼──────────────────────────────┤
│                         │                              │
│ 👤 John Doe             │                              │
│    Patient              │                              │
├─────────────────────────┤                              │
│                         │                              │
│ 📊 Dashboard            │      Main Content Area       │
│ 📅 Appointments         │                              │
│ 💊 Prescriptions        │                              │
│ 👥 Find Doctors         │                              │
│ 💳 Payments             │                              │
│                         │                              │
│ Quick Actions           │                              │
│ ➕ Book Appointment     │                              │
│ 📋 My Appointments      │                              │
│                         │                              │
│ ☰ More Options ▼        │                              │
│   👤 Profile Settings   │                              │
│   ⚙️ Preferences        │                              │
│                         │                              │
├─────────────────────────┤                              │
│ 🚪 Logout               │                              │
└─────────────────────────┴──────────────────────────────┘
     264px width              Content expands
```

### Collapsed State
```
┌────┬──────────────────────────────────────────┐
│ 🏥 │  ☰ Dashboard          🔔  👤            │
├────┼──────────────────────────────────────────┤
│    │                                          │
│ 👤 │                                          │
│    │                                          │
├────┤                                          │
│    │                                          │
│ 📊 │      Main Content Area (Expanded)       │
│ 📅 │                                          │
│ 💊 │                                          │
│ 👥 │                                          │
│ 💳 │                                          │
│    │                                          │
│    │                                          │
│    │                                          │
│    │                                          │
│    │                                          │
│    │                                          │
├────┤                                          │
│ 🚪 │                                          │
└────┴──────────────────────────────────────────┘
 80px    Content area gains 184px more space
```

## Mobile View (<768px)

### Closed State (Default)
```
┌──────────────────────────────────────┐
│  ☰ Dashboard          🔔  👤         │
├──────────────────────────────────────┤
│                                      │
│                                      │
│      Full Width Content Area         │
│                                      │
│                                      │
└──────────────────────────────────────┘
```

### Open State (Overlay)
```
┌─────────────────────────┬────────────┐
│ 🏥 MediBook             │ [BACKDROP] │
│    Healthcare System    │            │
├─────────────────────────┤            │
│                         │            │
│ 👤 John Doe             │            │
│    Patient              │            │
├─────────────────────────┤            │
│                         │            │
│ 📊 Dashboard            │            │
│ 📅 Appointments         │            │
│ 💊 Prescriptions        │            │
│ 👥 Find Doctors         │            │
│ 💳 Payments             │            │
│                         │            │
│ Quick Actions           │            │
│ ➕ Book Appointment     │            │
│                         │            │
├─────────────────────────┤            │
│ 🚪 Logout               │            │
└─────────────────────────┴────────────┘
   Slides in from left    Dark overlay
   Auto-closes on click   (50% opacity)
```

## Interaction Behaviors

### Desktop
- **Click hamburger** → Toggle between expanded/collapsed
- **Hover icon (collapsed)** → Show tooltip with label
- **Click nav item** → Navigate (sidebar stays in current state)
- **State persists** → Saved to localStorage

### Mobile
- **Click hamburger** → Slide in sidebar as overlay
- **Click backdrop** → Close sidebar
- **Click nav item** → Navigate and auto-close sidebar
- **Resize to desktop** → Sidebar becomes fixed, expanded by default

## Tooltip Behavior (Collapsed State)

When sidebar is collapsed, hovering over icons shows tooltips:

```
┌────┐
│ 📊 │ ← Hover
└────┘
  ↓
┌────┐  ┌───────────┐
│ 📊 │  │ Dashboard │
└────┘  └───────────┘
```

## Animation Timing

- **Width transition**: 300ms ease-in-out
- **Text fade**: Instant (display: none when collapsed)
- **Tooltip fade**: 200ms opacity transition
- **Mobile slide**: 300ms ease-in-out
- **Backdrop fade**: 300ms opacity transition

## State Persistence

The sidebar state is saved to localStorage:
```json
{
  "state": {
    "isSidebarOpen": true
  },
  "version": 0
}
```

This ensures the user's preference is maintained across:
- Page refreshes
- Browser restarts
- Different tabs (synced)
