# KanbanBoard: Vite → Next.js Migration Notes

**Date:** January 17, 2026  
**Next.js Version:** 16.1.3  
**Migration Status:** ✅ Complete

---

## Migration Overview

Successfully migrated the KanbanBoard application from Vite to Next.js 16.1.3 with all functionality preserved and all 27 tests passing.

---

## What Was Migrated

### Components

- ✅ Board.tsx (main board component with drag-and-drop)
- ✅ Column.tsx (individual columns: To Do, In Progress, Done)
- ✅ TaskCard.tsx (draggable task cards)
- ✅ TaskModal.tsx (create/edit task modal with overlay)

### State Management

- ✅ boardStore.ts (Zustand store for task state)

### Utilities

- ✅ storage.ts (localStorage helpers with SSR safety checks)

### Types

- ✅ index.ts (Task and Column type definitions)

### Tests

- ✅ All 27 Vitest tests migrated and passing
- ✅ Updated imports and paths for Next.js structure
- ✅ Fixed SSR-related issues in test environment

---

## Key Changes Made

### 1. Project Structure

**Vite:**

```
src/
  components/
  stores/
  utils/
  types/
```

**Next.js:**

```
app/
  page.tsx (root page)
components/
stores/
utils/
types/
```

### 2. Import Path Updates

**Before (Vite):**

```typescript
import { Task } from "../types";
import { useBoardStore } from "../stores/boardStore";
```

**After (Next.js):**

```typescript
import { Task } from "@/types";
import { useBoardStore } from "@/stores/boardStore";
```

### 3. Client Components

Added `"use client"` directive to components using:

- React hooks (useState, useEffect, etc.)
- Browser APIs (localStorage, window, document)
- Event handlers (onClick, onChange, etc.)
- Third-party client libraries (@dnd-kit, zustand)

**Components marked as client:**

- Board.tsx
- Column.tsx
- TaskCard.tsx
- TaskModal.tsx

### 4. SSR Safety for localStorage

**Before:**

```typescript
export const loadTasks = (): Task[] | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  // ...
};
```

**After:**

```typescript
export const loadTasks = (): Task[] | null => {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  // ...
};
```

### 5. TaskModal Styling Fix

**Issue:** Modal overlay had complex opacity state management causing unreliable transitions and black background issues.

**Solution:** Simplified to use direct `isOpen` check with fixed positioning:

```typescript
// Removed complex state
// const [visible, setVisible] = useState(isOpen);
// const [backdropClass, setBackdropClass] = useState(...);

// Simplified render
if (!isOpen) return null;

return (
  <>
    {/* Fixed backdrop covering entire viewport */}
    <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

    {/* Modal container */}
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto">{/* Modal card */}</div>
    </div>
  </>
);
```

**Key learnings:**

- Fixed positioning for overlays (not absolute)
- Simpler state management is more reliable
- Separate backdrop and modal with proper z-index layering

---

## Dependencies

### Installed for Next.js

```json
{
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^8.0.0",
  "zustand": "^5.0.2",
  "lucide-react": "^0.344.0"
}
```

### Development Dependencies

```json
{
  "@testing-library/react": "^14.1.2",
  "@testing-library/jest-dom": "^6.1.5",
  "@vitejs/plugin-react": "^4.2.1",
  "vitest": "^1.1.0",
  "jsdom": "^23.0.1"
}
```

---

## Testing Configuration

### vitest.config.ts

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

### Test Results

```
✓ All 27 tests passing
  ✓ Board component (5 tests)
  ✓ Column component (7 tests)
  ✓ TaskCard component (9 tests)
  ✓ TaskModal component (6 tests)
```

---

## Common Issues & Solutions

### Issue 1: localStorage is not defined

**Error:** `ReferenceError: localStorage is not defined`

**Cause:** localStorage only exists in browser, not during SSR

**Solution:**

```typescript
if (typeof window === "undefined") return null;
```

### Issue 2: Black Modal Background

**Error:** Modal overlay blocking everything with solid black background

**Cause:** Complex opacity state management with absolute positioning in small container

**Solution:**

- Use fixed positioning for backdrop to cover entire viewport
- Simplify state: remove visibility/opacity state, use `isOpen` directly
- Separate backdrop and modal with proper z-index

### Issue 3: Fade Transitions Not Working

**Error:** Modal appears/disappears instantly without smooth transition

**Cause:** Delayed unmounting causing state conflicts, complex requestAnimationFrame logic

**Solution:**

- Remove complex transition state management
- Accept instant show/hide for reliability
- Focus on getting functionality right before adding polish

---

## Performance Considerations

### What Next.js Provides Over Vite

- **Server-Side Rendering:** Initial page load can be rendered on server
- **Automatic Code Splitting:** Each page/component loaded as needed
- **Image Optimization:** Next.js Image component (not used in this app)
- **Built-in Routing:** File-based routing (simple single-page app doesn't benefit much)

### Trade-offs

- **Bundle Size:** Slightly larger due to Next.js runtime
- **Complexity:** Added SSR considerations (typeof window checks)
- **Dev Server:** Similar speed to Vite with Turbopack

**Verdict:** For this simple app, Vite was sufficient. Next.js chosen for learning and portfolio demonstration.

---

## Lessons Learned

1. **Keep It Simple:** Complex state management often causes more problems than it solves
2. **Fixed Positioning:** Use for overlays that need to cover entire viewport
3. **SSR Safety:** Always check `typeof window !== 'undefined'` for browser APIs
4. **Test Early:** Having 27 tests helped catch SSR issues immediately
5. **Iterative Debugging:** Sometimes you need to try multiple approaches before finding the simple solution
6. **Documentation:** Keep notes during migration - helps future debugging

---

## Next Steps

- ✅ Migration complete
- ✅ All tests passing
- ✅ Modal styling fixed
- ⏭️ Continue Week 2: Testing practice and algorithm study
- ⏭️ Explore more Next.js features (Server Actions, API routes, etc.)

---

## Resources Used

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Vitest Documentation](https://vitest.dev/)
- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)

---

**Migration completed by:** AI Assistant with guidance from user  
**Time invested:** ~6 hours (including debugging modal issues)
