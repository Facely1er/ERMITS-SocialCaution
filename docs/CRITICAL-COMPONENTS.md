# Critical UI Components Documentation

This guide documents the essential UI components that complete the Social Caution component library.

## Table of Contents
- [Tooltip Component](#tooltip-component)
- [Modal Component](#modal-component)
- [Dropdown Component](#dropdown-component)
- [Focus Trap Utility](#focus-trap-utility)

---

## Tooltip Component

A contextual help component that displays additional information on hover or focus.

### Location
`src/components/common/Tooltip.tsx`

### Features
- ✅ Four positioning options (top, bottom, left, right)
- ✅ Auto-positioning to stay within viewport
- ✅ Keyboard accessible (shows on focus)
- ✅ Configurable delay
- ✅ Portal rendering for proper z-index
- ✅ Animated entrance/exit
- ✅ Respects disabled state
- ✅ ARIA compliant (aria-describedby)

### Basic Usage

```tsx
import Tooltip from '../components/common/Tooltip';

// Basic tooltip
<Tooltip content="This is helpful information">
  <button>Hover me</button>
</Tooltip>

// With positioning
<Tooltip content="Settings" position="bottom">
  <IconButton icon={<Settings />} />
</Tooltip>

// Custom delay
<Tooltip content="Long delay" delay={500}>
  <span>Wait for it...</span>
</Tooltip>

// Disabled
<Tooltip content="Won't show" disabled={true}>
  <button>No tooltip</button>
</Tooltip>
```

### Advanced Usage

```tsx
// Rich content
<Tooltip
  content={
    <div>
      <strong>Privacy Score</strong>
      <p className="text-xs mt-1">
        Based on your assessment results
      </p>
    </div>
  }
  maxWidth={250}
>
  <span className="cursor-help border-b border-dashed">
    What's this?
  </span>
</Tooltip>

// On icons
<Tooltip content="Delete" position="top">
  <button
    onClick={handleDelete}
    className="p-2 hover:bg-red-100 rounded"
  >
    <Trash2 className="h-4 w-4" />
  </button>
</Tooltip>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string \| React.ReactNode` | required | Tooltip content |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Tooltip position |
| `children` | `React.ReactElement` | required | Trigger element |
| `delay` | `number` | `200` | Delay before showing (ms) |
| `disabled` | `boolean` | `false` | Disable tooltip |
| `maxWidth` | `number` | `300` | Max tooltip width (px) |
| `className` | `string` | `''` | Additional CSS classes |

### Accessibility

- Uses `aria-describedby` to link tooltip to trigger
- Shows on both hover and keyboard focus
- Auto-hides on blur
- High contrast colors for visibility

### Best Practices

✅ **Do:**
- Use for supplementary information
- Keep content concise (1-2 sentences)
- Use on interactive elements
- Provide keyboard access

❌ **Don't:**
- Use for critical information
- Put interactive elements in tooltips
- Use on disabled elements
- Make content too long

---

## Modal Component

A flexible, accessible modal dialog component with focus trapping and body scroll lock.

### Location
`src/components/common/Modal.tsx`

### Features
- ✅ Focus trap (keyboard navigation stays within modal)
- ✅ Body scroll lock
- ✅ Escape key to close
- ✅ Click outside to close (optional)
- ✅ 5 size variants (sm, md, lg, xl, full)
- ✅ Header, body, footer sections
- ✅ Portal rendering
- ✅ Animated entrance/exit
- ✅ ARIA compliant

### Basic Usage

```tsx
import Modal from '../components/common/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        description="Optional description text"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### With Footer

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

### Size Variants

```tsx
// Small (400px)
<Modal size="sm" {...props}>...</Modal>

// Medium (512px) - Default
<Modal size="md" {...props}>...</Modal>

// Large (672px)
<Modal size="lg" {...props}>...</Modal>

// Extra Large (896px)
<Modal size="xl" {...props}>...</Modal>

// Full Screen (with margins)
<Modal size="full" {...props}>...</Modal>
```

### Prevent Outside Click

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  preventOutsideClick={true}
>
  <p>Click the X or press Escape to close</p>
</Modal>
```

### ConfirmModal Variant

Convenience component for confirmation dialogs:

```tsx
import { ConfirmModal } from '../components/common/Modal';

const [showConfirm, setShowConfirm] = useState(false);

<ConfirmModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  message="Are you sure you want to delete this item? This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  variant="danger"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Controls modal visibility |
| `onClose` | `() => void` | required | Close handler |
| `title` | `string` | optional | Modal title |
| `description` | `string` | optional | Subtitle/description |
| `children` | `React.ReactNode` | required | Modal content |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size |
| `showClose` | `boolean` | `true` | Show X button |
| `preventOutsideClick` | `boolean` | `false` | Disable backdrop click |
| `footer` | `React.ReactNode` | optional | Footer content |
| `className` | `string` | `''` | Additional CSS classes |

### ConfirmModal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Controls modal visibility |
| `onClose` | `() => void` | required | Close handler |
| `onConfirm` | `() => void` | required | Confirm action handler |
| `title` | `string` | required | Modal title |
| `message` | `string` | required | Confirmation message |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button text |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button text |
| `variant` | `'danger' \| 'warning' \| 'info'` | `'info'` | Visual style |
| `isLoading` | `boolean` | `false` | Show loading state |

### Accessibility

- Traps focus within modal when open
- First focusable element gets focus on open
- Tab/Shift+Tab cycles through focusable elements
- Escape key closes modal
- ARIA roles and labels
- Body scroll locked when open

---

## Dropdown Component

An accessible dropdown/select component with keyboard navigation.

### Location
`src/components/common/Dropdown.tsx`

### Features
- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Click outside to close
- ✅ Custom trigger support
- ✅ Icon support in items
- ✅ Divider support
- ✅ Disabled items
- ✅ Auto-positioning
- ✅ Selected state with checkmark
- ✅ Form-styled Select variant
- ✅ ARIA compliant

### Basic Usage

```tsx
import Dropdown from '../components/common/Dropdown';

const items = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
];

function MyComponent() {
  const [selected, setSelected] = useState('option1');

  return (
    <Dropdown
      items={items}
      value={selected}
      onSelect={setSelected}
      placeholder="Choose an option"
    />
  );
}
```

### With Icons

```tsx
import { User, Settings, LogOut } from 'lucide-react';

const menuItems = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <User className="h-4 w-4" />
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: <Settings className="h-4 w-4" />
  },
  { divider: true, value: 'divider-1', label: '' },
  {
    value: 'logout',
    label: 'Logout',
    icon: <LogOut className="h-4 w-4" />
  }
];

<Dropdown
  items={menuItems}
  value={selected}
  onSelect={handleSelect}
/>
```

### Custom Trigger

```tsx
<Dropdown
  trigger={
    <button className="flex items-center gap-2">
      <User className="h-4 w-4" />
      <span>Account</span>
      <ChevronDown className="h-4 w-4" />
    </button>
  }
  items={items}
  onSelect={handleSelect}
/>
```

### Disabled Items

```tsx
const items = [
  { value: 'active', label: 'Active Option' },
  { value: 'disabled', label: 'Disabled Option', disabled: true },
  { value: 'another', label: 'Another Option' }
];
```

### Positioning

```tsx
// Bottom left (default)
<Dropdown position="bottom-left" {...props} />

// Bottom right
<Dropdown position="bottom-right" {...props} />

// Top left
<Dropdown position="top-left" {...props} />

// Top right
<Dropdown position="top-right" {...props} />
```

### Select Variant (Form Style)

```tsx
import { Select } from '../components/common/Dropdown';

<Select
  label="Choose Privacy Level"
  items={privacyLevels}
  value={level}
  onSelect={setLevel}
  placeholder="Select level"
  required
  helperText="Select your desired privacy level"
  error={errors.level}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `DropdownItem[]` | required | Menu items |
| `value` | `string` | optional | Selected value |
| `onSelect` | `(value: string) => void` | required | Selection handler |
| `trigger` | `React.ReactNode` | optional | Custom trigger element |
| `position` | `'bottom-left' \| 'bottom-right' \| 'top-left' \| 'top-right'` | `'bottom-left'` | Menu position |
| `placeholder` | `string` | `'Select option'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable dropdown |
| `fullWidth` | `boolean` | `false` | Full width trigger |
| `className` | `string` | `''` | Additional CSS classes |

### DropdownItem Interface

```typescript
interface DropdownItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean; // Renders a divider instead of item
}
```

### Select Props

All Dropdown props plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | optional | Form label |
| `error` | `string` | optional | Error message |
| `helperText` | `string` | optional | Helper text |
| `required` | `boolean` | `false` | Required field indicator |

### Keyboard Navigation

- **Arrow Down**: Move to next item
- **Arrow Up**: Move to previous item
- **Enter/Space**: Select highlighted item
- **Escape**: Close dropdown
- **Tab**: Move focus (closes dropdown)

### Accessibility

- ARIA role `listbox` for menu
- ARIA role `option` for items
- `aria-selected` for current selection
- `aria-expanded` for trigger
- Keyboard navigation fully supported

---

## Focus Trap Utility

Hooks for managing focus and scroll behavior in modals and dialogs.

### Location
`src/hooks/useFocusTrap.ts`

### useFocusTrap

Traps keyboard focus within a container element.

```tsx
import { useFocusTrap } from '../../hooks/useFocusTrap';

function MyModal({ isOpen }) {
  const focusTrapRef = useFocusTrap(isOpen);

  return (
    <div ref={focusTrapRef}>
      <button>First focusable</button>
      <input type="text" />
      <button>Last focusable</button>
    </div>
  );
}
```

**How it works:**
- Finds all focusable elements in container
- Focuses first element when activated
- Tab wraps from last to first element
- Shift+Tab wraps from first to last element

### useBodyScrollLock

Prevents body scroll when a modal is open.

```tsx
import { useBodyScrollLock } from '../../hooks/useFocusTrap';

function MyModal({ isOpen }) {
  useBodyScrollLock(isOpen);

  return <div>Modal content</div>;
}
```

**How it works:**
- Sets `overflow: hidden` on body when locked
- Adds padding to prevent layout shift
- Restores original state when unlocked

---

## Complete Examples

### Form with Dropdown and Tooltips

```tsx
import { Select } from '../components/common/Dropdown';
import Tooltip from '../components/common/Tooltip';
import FormInput from '../components/common/FormInput';

function SettingsForm() {
  const [privacyLevel, setPrivacyLevel] = useState('medium');

  const privacyLevels = [
    { value: 'low', label: 'Low Privacy' },
    { value: 'medium', label: 'Medium Privacy' },
    { value: 'high', label: 'High Privacy' },
    { value: 'maximum', label: 'Maximum Privacy' }
  ];

  return (
    <form>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Select
            label="Privacy Level"
            items={privacyLevels}
            value={privacyLevel}
            onSelect={setPrivacyLevel}
            required
          />
          <Tooltip content="Choose how much of your data is shared">
            <button type="button" className="text-text-secondary">
              <Info className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>

        <FormInput
          label="Email"
          type="email"
          required
        />
      </div>
    </form>
  );
}
```

### Confirmation Flow

```tsx
import { ConfirmModal } from '../components/common/Modal';
import { useTemporarySuccess } from '../../hooks/useLoadingState';
import SuccessAnimation from '../components/common/SuccessAnimation';

function DeleteButton({ itemId, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, triggerSuccess } = useTemporarySuccess();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteItem(itemId);
      setShowConfirm(false);
      triggerSuccess();
      onDelete(itemId);
    } catch (error) {
      toast.error('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </Button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure? This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
      />

      {showSuccess && (
        <SuccessAnimation
          type="check"
          message="Item deleted successfully"
        />
      )}
    </>
  );
}
```

### Dropdown Menu

```tsx
import Dropdown from '../components/common/Dropdown';
import { MoreVertical, Edit, Copy, Trash } from 'lucide-react';

function ActionMenu({ item, onEdit, onCopy, onDelete }) {
  const handleAction = (action: string) => {
    switch (action) {
      case 'edit':
        onEdit(item);
        break;
      case 'copy':
        onCopy(item);
        break;
      case 'delete':
        onDelete(item);
        break;
    }
  };

  const menuItems = [
    {
      value: 'edit',
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />
    },
    {
      value: 'copy',
      label: 'Duplicate',
      icon: <Copy className="h-4 w-4" />
    },
    { divider: true, value: 'div-1', label: '' },
    {
      value: 'delete',
      label: 'Delete',
      icon: <Trash className="h-4 w-4 text-red-600" />
    }
  ];

  return (
    <Dropdown
      trigger={
        <button className="p-2 hover:bg-card-hover rounded">
          <MoreVertical className="h-4 w-4" />
        </button>
      }
      items={menuItems}
      onSelect={handleAction}
      position="bottom-right"
    />
  );
}
```

---

## Testing Checklist

### Tooltip
- [ ] Shows on hover
- [ ] Shows on keyboard focus
- [ ] Hides on mouse leave
- [ ] Hides on blur
- [ ] Respects delay
- [ ] Stays within viewport
- [ ] Respects disabled state
- [ ] Works with screen readers

### Modal
- [ ] Opens and closes correctly
- [ ] Traps focus within modal
- [ ] Closes on Escape key
- [ ] Closes on backdrop click (when enabled)
- [ ] Locks body scroll
- [ ] Focuses first element on open
- [ ] Restores focus on close
- [ ] Works with screen readers

### Dropdown
- [ ] Opens on click
- [ ] Closes on outside click
- [ ] Closes on Escape
- [ ] Arrow keys navigate items
- [ ] Enter/Space selects item
- [ ] Shows selected state
- [ ] Respects disabled items
- [ ] Works with keyboard only
- [ ] Works with screen readers

---

## Performance Considerations

All components use:
- Portal rendering (via createPortal) for proper stacking
- AnimatePresence for smooth exit animations
- Event listener cleanup
- Memoization where appropriate

**Bundle Impact**:
- Tooltip: ~1.2KB gzipped
- Modal: ~2KB gzipped
- Dropdown: ~2.5KB gzipped
- Focus utilities: ~0.5KB gzipped

**Total**: ~6KB gzipped

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Next Steps

With these components complete, you can:
1. Build complex forms with validation
2. Create confirmation flows
3. Add contextual help throughout the app
4. Build dropdown menus and selects
5. Create multi-step wizards with modals

See the full UI/UX roadmap for more enhancements.
