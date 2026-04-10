

## Fix build errors in process-email-queue

The build errors are TypeScript implicit `any` type errors on lines 125 and 130 of `supabase/functions/process-email-queue/index.ts`. The fix is simple type annotations:

### Changes

**File: `supabase/functions/process-email-queue/index.ts`**

- Line 125: `.map((msg)` → `.map((msg: any)`
- Line 130: `.filter((id)` → `.filter((id: any)`

This adds explicit `any` types to satisfy Deno's strict type checking without changing any logic.

