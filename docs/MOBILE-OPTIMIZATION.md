# Mobile Optimization Guide

Complete guide to mobile-optimized components and features for Social Caution.

## Table of Contents
- [Bottom Navigation](#bottom-navigation)
- [Pull to Refresh](#pull-to-refresh)
- [Swipeable Cards](#swipeable-cards)
- [Mobile Gesture Utilities](#mobile-gesture-utilities)
- [Mobile Detection & Utilities](#mobile-detection--utilities)
- [Best Practices](#best-practices)

---

## Bottom Navigation

A mobile-friendly bottom navigation bar that appears on screens smaller than 768px (md breakpoint).

### Location
`src/components/navigation/BottomNav.tsx`

### Features
- ✅ Fixed to bottom of screen
- ✅ Auto-hides on desktop (md+ breakpoints)
- ✅ Active state highlighting
- ✅ Animated indicator
- ✅ Safe area support for notched devices
- ✅ 5-item layout optimized for thumbs
- ✅ Touch-friendly 44px minimum targets
- ✅ ARIA navigation labels

### Usage

```tsx
import BottomNav from '../components/navigation/BottomNav';

// Default navigation items (Home, Dashboard, Resources, Settings, Profile)
<BottomNav />

// Custom items
const customItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/assessment', label: 'Assess', icon: ShieldCheck },
  { path: '/resources', label: 'Learn', icon: BookOpen },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
];

<BottomNav items={customItems} />
```

### Default Items

| Icon | Label | Path |
|------|-------|------|
| Home | Home | `/` |
| LayoutDashboard | Dashboard | `/dashboard` |
| BookOpen | Resources | `/resources` |
| Settings | Settings | `/dashboard/settings` |
| User | Profile | `/dashboard/profile` |

### Hook: useBottomNav

Check if bottom nav should be shown:

```tsx
import { useBottomNav } from '../components/navigation/BottomNav';

function MyComponent() {
  const isMobile = useBottomNav();

  return (
    <div className={isMobile ? 'pb-16' : 'pb-0'}>
      {/* Add padding when bottom nav is shown */}
    </div>
  );
}
```

### Layout Integration

Bottom nav is automatically integrated in `Layout.tsx`:

- Shows on mobile (< 768px)
- Hidden on desktop
- Main content has bottom padding to prevent overlap
- Footer hidden on mobile

### Styling

The component uses:
- `safe-area-inset-bottom` for notched devices
- `pb-safe` utility class for safe bottom padding
- Grid layout for even spacing
- Active state with accent color

---

## Pull to Refresh

Native mobile pull-to-refresh pattern for refreshing content.

### Location
- Component: `src/components/common/PullToRefresh.tsx`
- Hook: `src/hooks/usePullToRefresh.ts`

### Features
- ✅ Native feel with resistance
- ✅ Visual feedback (rotating icon)
- ✅ Threshold-based activation
- ✅ Animated refresh indicator
- ✅ Works only when scrolled to top
- ✅ Prevents accidental triggers
- ✅ Smooth spring animations

### Basic Usage

```tsx
import PullToRefresh from '../components/common/PullToRefresh';

function MyPage() {
  const handleRefresh = async () => {
    await fetchNewData();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div>
        {/* Your content */}
      </div>
    </PullToRefresh>
  );
}
```

### With Custom Threshold

```tsx
<PullToRefresh
  onRefresh={handleRefresh}
  threshold={120}  // Default is 80px
  enabled={true}   // Can disable conditionally
>
  <ContentList />
</PullToRefresh>
```

### Dashboard Example

```tsx
function DashboardPage() {
  const [data, setData] = useState([]);

  const refreshDashboard = async () => {
    const newData = await api.getDashboardData();
    setData(newData);
    hapticFeedback(HapticPatterns.success); // Optional haptic
  };

  return (
    <PullToRefresh onRefresh={refreshDashboard}>
      <div className="space-y-4">
        {data.map(item => (
          <DashboardCard key={item.id} data={item} />
        ))}
      </div>
    </PullToRefresh>
  );
}
```

### Hook API

```tsx
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

const {
  containerRef,    // Attach to container element
  isPulling,       // Is user currently pulling
  isRefreshing,    // Is refresh in progress
  pullDistance,    // Current pull distance in px
  progress         // Progress as 0-1 (for custom indicators)
} = usePullToRefresh({
  onRefresh: async () => { /* ... */ },
  threshold: 80,
  resistance: 2.5,  // Higher = more resistance
  enabled: true
});
```

### Visual States

| State | Icon | Color | Text |
|-------|------|-------|------|
| Pulling (< threshold) | Static RefreshCw | Secondary | - |
| Ready (>= threshold) | Bouncing RefreshCw | Success | "Release to refresh" |
| Refreshing | Spinning RefreshCw | Accent | "Refreshing..." |

---

## Swipeable Cards

Cards with swipe-to-action gestures (delete, archive, approve, etc.).

### Location
- Component: `src/components/common/SwipeableCard.tsx`
- Hook: `src/hooks/useSwipeGesture.ts`

### Features
- ✅ Swipe left/right for actions
- ✅ Visual feedback with colored backgrounds
- ✅ Configurable action icons and colors
- ✅ Threshold-based activation
- ✅ Smooth spring animations
- ✅ Undo-able actions
- ✅ Preset actions (delete, archive, approve, reject)

### Basic Usage

```tsx
import SwipeableCard from '../components/common/SwipeableCard';

<SwipeableCard
  leftAction="delete"
  rightAction="archive"
  onSwipeLeft={() => handleDelete(item.id)}
  onSwipeRight={() => handleArchive(item.id)}
>
  <div className="p-4">
    <h3>{item.title}</h3>
    <p>{item.description}</p>
  </div>
</SwipeableCard>
```

### Preset Actions

| Action | Icon | Color | Use Case |
|--------|------|-------|----------|
| `delete` | Trash2 | Red | Delete items |
| `archive` | Archive | Blue | Archive items |
| `approve` | Check | Green | Approve requests |
| `reject` | X | Red | Reject requests |

### Custom Actions

```tsx
<SwipeableCard
  leftAction={{
    icon: <Star className="h-6 w-6" />,
    color: 'text-white',
    bgColor: 'bg-yellow-500',
    label: 'Favorite',
    threshold: 100
  }}
  rightAction={{
    icon: <Share className="h-6 w-6" />,
    color: 'text-white',
    bgColor: 'bg-blue-500',
    label: 'Share',
    threshold: 80
  }}
  onSwipeLeft={handleFavorite}
  onSwipeRight={handleShare}
>
  <PostCard post={post} />
</SwipeableCard>
```

### List Item Variant

For simple list items:

```tsx
import { SwipeableListItem } from '../components/common/SwipeableCard';

<SwipeableListItem
  onDelete={() => deleteNotification(notification.id)}
  onArchive={() => archiveNotification(notification.id)}
>
  <div className="flex items-center gap-3">
    <Bell className="h-5 w-5" />
    <div>
      <p className="font-medium">{notification.title}</p>
      <p className="text-sm text-text-secondary">{notification.time}</p>
    </div>
  </div>
</SwipeableListItem>
```

### Notifications Example

```tsx
function NotificationsList() {
  const [notifications, setNotifications] = useState([...]);

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    hapticFeedback(HapticPatterns.light);
  };

  const handleArchive = (id: string) => {
    // Archive logic
    hapticFeedback(HapticPatterns.medium);
  };

  return (
    <div className="space-y-2">
      {notifications.map(notification => (
        <SwipeableListItem
          key={notification.id}
          onDelete={() => handleDelete(notification.id)}
          onArchive={() => handleArchive(notification.id)}
        >
          <NotificationContent notification={notification} />
        </SwipeableListItem>
      ))}
    </div>
  );
}
```

---

## Mobile Gesture Utilities

Hooks for handling touch gestures.

### Location
`src/hooks/useSwipeGesture.ts`

### useSwipeGesture

Detect swipe gestures in all directions:

```tsx
import { useSwipeGesture } from '../../hooks/useSwipeGesture';

function ImageGallery() {
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => nextImage(),
    onSwipeRight: () => previousImage(),
    onSwipeUp: () => showDetails(),
    onSwipeDown: () => closeGallery(),
    threshold: 50
  });

  return (
    <div {...swipeHandlers}>
      <img src={currentImage} alt="Gallery" />
    </div>
  );
}
```

### usePanGesture

Track continuous drag/pan gestures:

```tsx
import { usePanGesture } from '../../hooks/useSwipeGesture';

function DraggableCard() {
  const { offset, isPanning, ...handlers } = usePanGesture();

  return (
    <div
      {...handlers}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: isPanning ? 'none' : 'transform 0.3s'
      }}
    >
      Drag me!
    </div>
  );
}
```

---

## Mobile Detection & Utilities

Comprehensive mobile utility functions and hooks.

### Location
`src/utils/mobileUtils.ts`

### Device Detection

```tsx
import {
  isMobile,
  isIOS,
  isAndroid,
  supportsTouch,
  isStandalone
} from '../../utils/mobileUtils';

// Detect mobile device
if (isMobile()) {
  // Show mobile-optimized UI
}

// Platform-specific logic
if (isIOS()) {
  // iOS-specific features
} else if (isAndroid()) {
  // Android-specific features
}

// Check if PWA
if (isStandalone()) {
  // Running as installed PWA
}
```

### React Hooks

```tsx
import { useMobile, useMobileDetection } from '../../utils/mobileUtils';

function ResponsiveComponent() {
  const isMobile = useMobile(); // Reactive to window resize

  const { isMobile, isIOS, isAndroid } = useMobileDetection();

  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

### Haptic Feedback

```tsx
import { hapticFeedback, HapticPatterns } from '../../utils/mobileUtils';

// Simple vibration
hapticFeedback(); // 10ms

// Patterns
hapticFeedback(HapticPatterns.success); // [10, 50, 10]
hapticFeedback(HapticPatterns.error);   // [20, 100, 20, 100, 20]
hapticFeedback(HapticPatterns.warning); // [30, 50, 30]

// Custom pattern
hapticFeedback([50, 100, 50]); // Vibrate-pause-vibrate
```

### Usage in Interactions

```tsx
function ActionButton() {
  const handleClick = () => {
    hapticFeedback(HapticPatterns.light);
    performAction();
  };

  const handleDelete = () => {
    hapticFeedback(HapticPatterns.error);
    deleteItem();
  };

  const handleSuccess = () => {
    hapticFeedback(HapticPatterns.success);
    showSuccessMessage();
  };

  return <button onClick={handleClick}>Action</button>;
}
```

### Screen Size Detection

```tsx
import { getScreenSize, isMobileViewport } from '../../utils/mobileUtils';

const size = getScreenSize(); // 'sm' | 'md' | 'lg' | 'xl'

if (size === 'sm') {
  // Mobile phone
} else if (size === 'md') {
  // Large phone / small tablet
} else if (size === 'lg') {
  // Tablet
} else {
  // Desktop
}

// Simple mobile check
if (isMobileViewport()) {
  // Width < 768px
}
```

### Scroll Locking

```tsx
import { lockBodyScroll, unlockBodyScroll } from '../../utils/mobileUtils';

function Modal({ isOpen }) {
  useEffect(() => {
    if (isOpen) {
      lockBodyScroll(); // Prevents background scrolling
    } else {
      unlockBodyScroll();
    }

    return () => unlockBodyScroll();
  }, [isOpen]);

  return <div>Modal content</div>;
}
```

### Safe Area Insets

```tsx
import { getSafeAreaInsets } from '../../utils/mobileUtils';

const insets = getSafeAreaInsets();
// { top: 44, right: 0, bottom: 34, left: 0 } on iPhone X+

// Use in styling
<div style={{ paddingTop: insets.top }}>
  Content safe from notch
</div>
```

### Initialize Mobile Utils

Add to your app initialization:

```tsx
import { initMobileUtils } from '../../utils/mobileUtils';

// In App.tsx or main.tsx
useEffect(() => {
  initMobileUtils();
}, []);
```

This adds:
- Safe area CSS variables
- Viewport meta tag
- Theme color meta tag
- Overscroll behavior

---

## Best Practices

### 1. Touch Targets

Always ensure interactive elements are at least 44x44px:

```tsx
// ✅ Good
<button className="p-3 min-h-[44px] min-w-[44px]">
  <Icon className="h-5 w-5" />
</button>

// ❌ Bad
<button className="p-1">
  <Icon className="h-3 w-3" />
</button>
```

### 2. Bottom Spacing

Account for bottom navigation on mobile:

```tsx
// Add padding to content
<main className="pb-16 md:pb-0">
  {content}
</main>

// Or use hook
const isMobile = useBottomNav();

<div className={isMobile ? 'pb-16' : 'pb-0'}>
  {content}
</div>
```

### 3. Safe Areas

Use safe area utilities for notched devices:

```tsx
// In CSS
.header {
  padding-top: max(env(safe-area-inset-top), 1rem);
}

// In React
<div className="safe-area-inset-top">
  Header content
</div>

<div className="pb-safe">
  Bottom content
</div>
```

### 4. Gesture Conflicts

Prevent conflicts between gestures:

```tsx
// Pull-to-refresh + Swipe cards
<PullToRefresh onRefresh={refresh}>
  <div className="space-y-2">
    {/* Swipe cards work independently */}
    {items.map(item => (
      <SwipeableCard key={item.id} {...props}>
        {item.content}
      </SwipeableCard>
    ))}
  </div>
</PullToRefresh>
```

### 5. Performance

Optimize for mobile devices:

```tsx
// Use will-change for animated elements
<motion.div
  className="will-change-transform"
  drag="x"
>
  Swipeable content
</motion.div>

// Debounce resize events
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const handleResize = debounce(() => {
    setIsMobile(window.innerWidth < 768);
  }, 150);

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### 6. Testing

Test on real devices:

- iPhone SE (small screen)
- iPhone 14 Pro (notch)
- Samsung Galaxy S21 (Android)
- iPad (tablet)

Use Chrome DevTools mobile emulation during development.

---

## Complete Example: Mobile-Optimized List

```tsx
import PullToRefresh from '../components/common/PullToRefresh';
import { SwipeableListItem } from '../components/common/SwipeableCard';
import EmptyState from '../components/common/EmptyState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { hapticFeedback, HapticPatterns } from '../../utils/mobileUtils';
import { useLoadingState } from '../../hooks/useLoadingState';

function MobileNotificationsList() {
  const { data: notifications, isLoading, execute } = useLoadingState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    execute(fetchNotifications());
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await execute(fetchNotifications());
    hapticFeedback(HapticPatterns.success);
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    hapticFeedback(HapticPatterns.light);
    toast.success('Notification deleted');
  };

  const handleArchive = (id: string) => {
    archiveNotification(id);
    hapticFeedback(HapticPatterns.medium);
    toast.success('Notification archived');
  };

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        <SkeletonLoader variant="list" lines={5} />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        illustration="inbox"
        title="No notifications"
        description="You're all caught up!"
        size="md"
      />
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="divide-y divide-border">
        {notifications.map(notification => (
          <SwipeableListItem
            key={notification.id}
            onDelete={() => handleDelete(notification.id)}
            onArchive={() => handleArchive(notification.id)}
          >
            <div className="flex items-start gap-3 py-3">
              <Bell className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text truncate">
                  {notification.title}
                </p>
                <p className="text-sm text-text-secondary line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {formatTime(notification.createdAt)}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          </SwipeableListItem>
        ))}
      </div>
    </PullToRefresh>
  );
}
```

---

## Browser/Device Support

### Bottom Navigation
- iOS Safari 12+
- Chrome Android 90+
- Samsung Internet 14+

### Pull to Refresh
- iOS Safari 12+
- Chrome Android 90+
- All modern mobile browsers with touch support

### Swipeable Cards
- iOS Safari 12+
- Chrome Android 90+
- Requires touch support

### Haptic Feedback
- iOS Safari 13+ (limited)
- Chrome Android 90+
- Vibration API required

---

## Performance Impact

| Component | Bundle Size | Performance |
|-----------|-------------|-------------|
| BottomNav | ~1.5KB gzipped | Minimal (fixed position) |
| PullToRefresh | ~2KB gzipped | Low (touch events only) |
| SwipeableCard | ~2.5KB gzipped | Medium (Framer Motion) |
| Mobile Utils | ~1KB gzipped | Minimal |

**Total**: ~7KB gzipped

---

## Next Steps

Mobile optimization is now complete! Consider:

1. **Add more gestures** (long press, pinch-to-zoom)
2. **Offline support** (Service Worker improvements)
3. **Native app features** (Share API, File System Access)
4. **Performance monitoring** (Core Web Vitals tracking)
5. **A/B testing** (Mobile vs Desktop conversion rates)

---

All mobile components are production-ready and integrated into the app!
