# Quick Dark Mode Application Guide

## Step-by-Step Class Replacements

### 1. Sidebar Component (`frontend/src/components/layout/Sidebar.tsx`)

Replace these classes:
- `bg-white` → `bg-white dark:bg-gray-900`
- `border-gray-200` → `border-gray-200 dark:border-gray-800`
- `text-gray-900` → `text-gray-900 dark:text-gray-100`
- `text-gray-700` → `text-gray-700 dark:text-gray-300`
- `text-gray-500` → `text-gray-500 dark:text-gray-400`
- `hover:bg-gray-100` → `hover:bg-gray-100 dark:hover:bg-gray-800`
- `bg-gray-900` (buttons) → `bg-gray-900 dark:bg-gray-100`
- `text-white` (on dark buttons) → `text-white dark:text-gray-900`

### 2. Topbar Component (Already Updated)
The Topbar now includes:
- Dark mode toggle button
- Dark mode classes for all elements
- Proper contrast in both modes

### 3. Dashboard Pages

For each page, apply these patterns:

#### Cards:
```
bg-white → bg-white dark:bg-gray-900
border-gray-200 → border-gray-200 dark:border-gray-800
shadow-sm → shadow-sm dark:shadow-gray-950/20
```

#### Text:
```
text-gray-900 → text-gray-900 dark:text-gray-100
text-gray-600 → text-gray-600 dark:text-gray-400
text-gray-500 → text-gray-500 dark:text-gray-500
```

#### Inputs:
```
bg-white → bg-white dark:bg-gray-900
border-gray-300 → border-gray-300 dark:border-gray-700
```

## Automated Approach

You can use PowerShell to batch replace classes:

```powershell
# Example for a single file
$file = "frontend/src/components/layout/Sidebar.tsx"
$content = Get-Content $file -Raw
$content = $content -replace 'bg-white"', 'bg-white dark:bg-gray-900"'
$content = $content -replace 'border-gray-200"', 'border-gray-200 dark:border-gray-800"'
Set-Content $file $content
```

## Priority Order

1. ✅ Core Layout (Sidebar, Topbar, Main Layout)
2. Dashboard Page
3. Doctor Panel
4. Forms and Inputs
5. Modals and Dropdowns
6. Auth Pages (Login/Register)

## Testing Checklist

After applying dark mode to each component:
- [ ] Toggle dark mode and verify visibility
- [ ] Check text contrast
- [ ] Verify hover states
- [ ] Test interactive elements
- [ ] Check on mobile view
