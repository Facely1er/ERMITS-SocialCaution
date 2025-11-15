# Removing Translations - Progress Guide

## Status
- ✅ i18n system disabled
- ✅ Core pages fixed (PrivacyActionCenter, Features, Toolkit, Resources)
- ⏳ ~250+ translation calls remaining across ~70 files

## Pattern to Follow

For files with `t('key', 'fallback')` pattern:
1. Remove `import { useTranslation } from 'react-i18next';`
2. Remove `const { t } = useTranslation();`
3. Replace `t('key', 'fallback')` with `'fallback'`
4. Replace `t('key')` with appropriate English text

## Files with Most Translation Calls (Priority Order)
1. SearchModal.tsx (~25 calls)
2. ContextualNav.tsx (~23 calls)
3. NavigationProgress.tsx (~22 calls)
4. ContactPage.tsx (~19 calls)
5. ModernDashboardHomePage.tsx (~17 calls)
6. SettingsPage.tsx (~13 calls)
7. BlogPage.tsx (~12 calls)

## Quick Fix Pattern

```typescript
// Before
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
const title = t('some.key', 'English Text');

// After
const title = 'English Text';
```

For files without fallback values, you'll need to provide appropriate English text based on the translation key context.

