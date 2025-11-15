import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  preventDefault?: boolean;
}

/**
 * Custom hook for keyboard shortcuts
 * @param shortcut - The keyboard shortcut configuration
 * @param callback - Function to call when shortcut is triggered
 * @param enabled - Whether the shortcut is enabled (default: true)
 */
export const useKeyboardShortcut = (
  shortcut: KeyboardShortcutOptions,
  callback: () => void,
  enabled = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if all required modifiers match
      const ctrlMatch = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey;
      const metaMatch = shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey;
      const shiftMatch = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey;
      const altMatch = shortcut.altKey === undefined || event.altKey === shortcut.altKey;
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      // If Cmd+K or Ctrl+K (for search)
      const isSearchShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';

      if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        callback();
      } else if (isSearchShortcut && shortcut.key.toLowerCase() === 'k') {
        // Handle Cmd+K / Ctrl+K specifically for cross-platform compatibility
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcut, callback, enabled]);
};

/**
 * Hook specifically for search shortcut (Cmd+K / Ctrl+K)
 */
export const useSearchShortcut = (onOpen: () => void, enabled = true) => {
  useKeyboardShortcut(
    { key: 'k', ctrlKey: true, metaKey: true },
    onOpen,
    enabled
  );
};

/**
 * Hook for Escape key
 */
export const useEscapeKey = (onEscape: () => void, enabled = true) => {
  useKeyboardShortcut(
    { key: 'Escape' },
    onEscape,
    enabled
  );
};
