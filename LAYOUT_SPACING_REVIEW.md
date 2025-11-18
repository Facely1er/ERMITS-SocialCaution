# Layout Spacing Review & Options

## Current Implementation

### Container Padding
```typescript
container: {
  maxWidth: 'max-w-7xl',
  padding: 'px-4 sm:px-6 lg:px-8',
}
```

**Applied to:**
- All page content areas
- Both centered and default layouts

**Spacing:**
- Mobile (<640px): 16px (1rem) on each side
- Tablet (640px-1024px): 24px (1.5rem) on each side
- Desktop (>1024px): 32px (2rem) on each side

---

## Issues Identified

1. **Side padding on all pages** creates visual constraint
2. **Content doesn't reach edges** even on mobile
3. **Inconsistent with modern full-bleed designs**

---

## Options to Fix

### Option 1: Edge-to-Edge Content (Full Bleed)
**Best for:** Modern, spacious feel
```typescript
container: {
  maxWidth: 'max-w-7xl',
  padding: '', // No horizontal padding
}
```

### Option 2: Mobile Edge-to-Edge, Desktop Padding
**Best for:** Mobile-first, balanced approach
```typescript
container: {
  maxWidth: 'max-w-7xl',
  padding: 'sm:px-6 lg:px-8', // Only padding on larger screens
}
```

### Option 3: Minimal Padding
**Best for:** Subtle constraint, more content visible
```typescript
container: {
  maxWidth: 'max-w-7xl',
  padding: 'px-2 sm:px-4 lg:px-6', // Reduced padding (8px → 16px → 24px)
}
```

### Option 4: Custom Per-Page Control
**Best for:** Flexibility, different needs per page
```typescript
// Add fullWidth prop to PageLayout
interface PageLayoutProps {
  fullWidth?: boolean; // New prop
  // ... other props
}

// Usage:
<PageLayout fullWidth={true}> // No padding
<PageLayout fullWidth={false}> // Normal padding
```

---

## Recommended Solution

**Option 2 + Option 4** (Hybrid Approach)

1. **Default:** Edge-to-edge on mobile, padding on desktop
2. **Override:** Individual pages can specify fullWidth

This gives:
- ✅ Better mobile experience (more screen real estate)
- ✅ Comfortable desktop reading (contained content)
- ✅ Flexibility for special cases
- ✅ Modern design aesthetic

---

## Impact Analysis

### Option 1 (Full Bleed)
- **Pros:** Maximum content area, modern look
- **Cons:** Content touches edges on mobile, harder to read long text
- **Best for:** Dashboard with cards, visual-heavy pages

### Option 2 (Mobile Edge-to-Edge)
- **Pros:** Balance of space and readability
- **Cons:** Requires careful card design
- **Best for:** Most pages, best overall UX

### Option 3 (Minimal Padding)
- **Pros:** More subtle, easier transition
- **Cons:** Still has side spacing
- **Best for:** Conservative change

### Option 4 (Per-Page Control)
- **Pros:** Maximum flexibility
- **Cons:** More complex, requires decisions per page
- **Best for:** Mixed content needs

---

## Which option would you like to implement?
