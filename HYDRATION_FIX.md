# Hydration Mismatch Fix

## Problem
The application was showing a hydration mismatch error because:
- The `dark` class was being added to `<html>` on the client side (via localStorage)
- During server-side rendering (SSR), the `dark` class wasn't present
- This caused React to detect a mismatch between server and client HTML

## Solution Applied

### 1. Added `suppressHydrationWarning` to `<html>` and `<body>`
This tells React to ignore hydration mismatches for these elements, which is safe for the dark mode class since it's a client-side preference.

```tsx
<html lang="en" suppressHydrationWarning>
  ...
  <body ... suppressHydrationWarning>
```

### 2. Added Inline Script to Prevent FOUC
Added a blocking script in `<head>` that runs before React hydrates. This script:
- Reads the dark mode preference from localStorage
- Applies the `dark` class immediately if needed
- Prevents the "flash of unstyled content" when page loads

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      try {
        const stored = localStorage.getItem('ui-storage');
        if (stored) {
          const { state } = JSON.parse(stored);
          if (state?.isDarkMode) {
            document.documentElement.classList.add('dark');
          }
        }
      } catch (e) {}
    `,
  }}
/>
```

## Benefits

1. **No More Hydration Warnings**: The console error is eliminated
2. **No Flash**: Dark mode is applied instantly on page load
3. **Smooth Experience**: Users don't see a flash from light to dark mode
4. **SSR Compatible**: Works correctly with Next.js server-side rendering

## How It Works

1. **Server renders** the page without the `dark` class
2. **Browser receives** HTML and immediately runs the inline script
3. **Script checks** localStorage for dark mode preference
4. **Applies `dark` class** before React hydrates (if needed)
5. **React hydrates** and sees the `suppressHydrationWarning` flag
6. **No mismatch error** because we told React to expect differences

## Testing

1. Refresh the page in light mode - should stay light
2. Toggle to dark mode - should switch immediately
3. Refresh the page - should stay in dark mode without flashing
4. Check console - no hydration warnings

## Files Modified

- `frontend/src/app/layout.tsx` - Added suppressHydrationWarning and inline script
