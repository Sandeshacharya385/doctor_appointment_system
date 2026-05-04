# Doctor Cards Layout Fix

## Issue
Doctor cards had inconsistent heights and descriptions were displayed in full, causing layout misalignment.

## Solution Implemented

### 1. Fixed Card Heights
- Added `flex flex-col h-full` to Card component to ensure all cards stretch to same height
- Added `flex-1 flex flex-col` to CardContent to make content area flexible
- Used `flex-1` on the info section to push the button to the bottom

### 2. Bio Text Truncation
- Implemented `line-clamp-1` utility class to truncate bio to one line with ellipsis
- Only shows truncation when bio is not expanded

### 3. See More/Less Functionality
- Added state management with `expandedBios` to track which doctor bios are expanded
- Added "See more" button that appears only when bio text is longer than 80 characters
- Button toggles between "See more" and "See less" states
- Clicking expands/collapses the full bio text

### 4. Responsive Layout
- Maintained existing responsive grid:
  - 1 column on mobile
  - 2 columns on tablet (md breakpoint)
  - 3 columns on desktop (lg breakpoint)

## Technical Details

### State Management
```typescript
const [expandedBios, setExpandedBios] = useState<Record<number, boolean>>({});
```

### Toggle Function
```typescript
const toggleBio = (doctorId: number) => {
  setExpandedBios(prev => ({
    ...prev,
    [doctorId]: !prev[doctorId]
  }));
};
```

### CSS Classes Used
- `line-clamp-1` - Tailwind utility for single-line truncation with ellipsis
- `flex flex-col h-full` - Flexbox column layout with full height
- `flex-1` - Flex grow to fill available space

## Result
- All doctor cards now have consistent heights regardless of content length
- Bio descriptions show only one line by default
- Users can expand individual bios with "See more" button
- Layout remains clean and professional
- Dark mode fully supported

## Files Modified
- `frontend/src/app/(dashboard)/doctors/page.tsx`
