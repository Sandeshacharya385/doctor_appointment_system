# Dark Mode Implementation Guide

## Overview
This application now supports a complete dark mode theme that users can toggle. The theme preference is saved in localStorage and persists across sessions.

## How to Use Dark Mode

### For Users:
1. Click the sun/moon icon in the top navigation bar
2. The theme will toggle between light and dark mode
3. Your preference is automatically saved

### For Developers:

## Implementation Details

### 1. Theme Management (Zustand Store)
Location: `frontend/src/store/useUIStore.ts`

The UI store now includes:
- `isDarkMode`: boolean state
- `toggleDarkMode()`: function to toggle theme
- `setDarkMode(dark: boolean)`: function to set theme explicitly

### 2. Tailwind Configuration
Location: `frontend/tailwind.config.ts`

Dark mode is enabled with `darkMode: ["class"]`, which means dark mode is activated by adding the `dark` class to the `<html>` element.

### 3. Global Styles
Location: `frontend/src/app/globals.css`

CSS variables are defined for both light and dark themes using HSL color values.

## Dark Mode Color Palette

### Light Mode:
- Background: White (#FFFFFF) / Gray-50 (#F9FAFB)
- Text: Gray-900 (#111827)
- Borders: Gray-200 (#E5E7EB)
- Cards: White with subtle shadows

### Dark Mode:
- Background: Gray-950 (#030712) / Gray-900 (#111827)
- Text: Gray-100 (#F3F4F6)
- Borders: Gray-800 (#1F2937)
- Cards: Gray-900 with subtle borders

## Adding Dark Mode to Components

### Basic Pattern:
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  Content
</div>
```

### Common Class Combinations:

#### Backgrounds:
- `bg-white dark:bg-gray-900` - Main backgrounds
- `bg-gray-50 dark:bg-gray-950` - Page backgrounds
- `bg-gray-100 dark:bg-gray-800` - Secondary backgrounds

#### Text:
- `text-gray-900 dark:text-gray-100` - Primary text
- `text-gray-600 dark:text-gray-400` - Secondary text
- `text-gray-500 dark:text-gray-500` - Muted text

#### Borders:
- `border-gray-200 dark:border-gray-800` - Standard borders
- `border-gray-300 dark:border-gray-700` - Emphasized borders

#### Hover States:
- `hover:bg-gray-100 dark:hover:bg-gray-800` - Hover backgrounds
- `hover:text-gray-900 dark:hover:text-gray-100` - Hover text

#### Buttons:
- Primary: `bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900`
- Secondary: `bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100`

## Components Updated for Dark Mode

### Core Layout:
- ✅ Topbar (`frontend/src/components/layout/Topbar.tsx`)
- ✅ Sidebar (`frontend/src/components/layout/Sidebar.tsx`)
- ✅ Dashboard Layout (`frontend/src/app/(dashboard)/layout.tsx`)

### Pages (Need Manual Update):
- Dashboard Page
- Doctor Panel
- Appointments Page
- Profile Page
- Settings Page
- Help Page
- About Page
- Login Page
- Register Page

## Quick Reference for Common Elements

### Cards:
```tsx
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
  <h3 className="text-gray-900 dark:text-gray-100">Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### Inputs:
```tsx
<input 
  className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-gray-500 dark:focus:ring-gray-400"
/>
```

### Dropdowns/Modals:
```tsx
<div className="bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-950/50 border border-gray-200 dark:border-gray-800">
  Content
</div>
```

## Testing Dark Mode

1. Toggle dark mode using the button in the topbar
2. Navigate through all pages to ensure visibility
3. Check form inputs, buttons, and interactive elements
4. Verify modals and dropdowns
5. Test on different screen sizes
6. Refresh the page to ensure persistence

## Best Practices

1. **Always pair background and text colors**: Never change background without updating text color
2. **Test contrast**: Ensure text is readable in both modes
3. **Use semantic colors**: Use gray scale for neutral elements, keep brand colors consistent
4. **Maintain hierarchy**: Dark mode should maintain the same visual hierarchy as light mode
5. **Icons and images**: Ensure icons are visible in both modes (use `dark:text-gray-300` for icons)

## Troubleshooting

### Theme not persisting:
- Check localStorage for 'ui-storage' key
- Verify Zustand persist middleware is working

### Flashing on page load:
- Ensure the dark class is applied before render
- Check the onRehydrateStorage callback in useUIStore

### Some elements not changing:
- Add dark: prefix to all color-related classes
- Check for inline styles that override Tailwind classes

## Future Enhancements

- [ ] System preference detection (prefers-color-scheme)
- [ ] Smooth transition animations between themes
- [ ] Per-page theme overrides
- [ ] High contrast mode option
- [ ] Custom theme colors
