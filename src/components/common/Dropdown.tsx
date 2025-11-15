import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useKeyboardShortcut';

export interface DropdownItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

type DropdownPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

interface DropdownProps {
  trigger?: React.ReactNode;
  items: DropdownItem[];
  value?: string;
  onSelect: (value: string) => void;
  position?: DropdownPosition;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  value,
  onSelect,
  position = 'bottom-left',
  placeholder = 'Select option',
  disabled = false,
  fullWidth = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEscapeKey(() => {
    if (isOpen) setIsOpen(false);
  }, isOpen);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Update position when opened
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuHeight = Math.min(items.length * 44, 300); // Approximate
      const gap = 8;

      let top = 0;
      let left = rect.left;
      const width = rect.width;

      if (position.startsWith('bottom')) {
        top = rect.bottom + gap;
      } else {
        top = rect.top - menuHeight - gap;
      }

      if (position.endsWith('right')) {
        left = rect.right - width;
      }

      // Keep within viewport
      if (top + menuHeight > window.innerHeight) {
        top = rect.top - menuHeight - gap;
      }
      if (top < 0) {
        top = rect.bottom + gap;
      }

      setCoords({ top, left, width });
    }
  }, [isOpen, position, items.length]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    const selectableItems = items.filter(item => !item.disabled && !item.divider);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => {
          const nextIndex = prev + 1;
          return nextIndex >= selectableItems.length ? 0 : nextIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => {
          const nextIndex = prev - 1;
          return nextIndex < 0 ? selectableItems.length - 1 : nextIndex;
        });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < selectableItems.length) {
          handleSelect(selectableItems[highlightedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (itemValue: string) => {
    onSelect(itemValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const selectedItem = items.find(item => item.value === value);

  const defaultTrigger = (
    <button
      ref={triggerRef}
      onClick={() => !disabled && setIsOpen(!isOpen)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`
        inline-flex items-center justify-between gap-2
        px-4 py-2.5 rounded-lg
        bg-card dark:bg-card
        border border-border dark:border-border
        text-text dark:text-text
        hover:bg-card-hover dark:hover:bg-card-hover
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      <span className="flex items-center gap-2">
        {selectedItem?.icon}
        <span>{selectedItem?.label || placeholder}</span>
      </span>
      <ChevronDown
        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  );

  const menu = createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className="fixed z-[9999] bg-card dark:bg-card border border-border dark:border-border rounded-lg shadow-xl overflow-hidden"
          style={{
            top: coords.top,
            left: coords.left,
            minWidth: coords.width
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          role="listbox"
        >
          <div className="max-h-[300px] overflow-y-auto py-1">
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`divider-${index}`}
                    className="h-px bg-border dark:bg-border my-1"
                    role="separator"
                  />
                );
              }

              const isSelected = item.value === value;
              const isHighlighted = items.filter(i => !i.disabled && !i.divider).indexOf(item) === highlightedIndex;

              return (
                <button
                  key={item.value}
                  onClick={() => !item.disabled && handleSelect(item.value)}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 text-left
                    transition-colors
                    ${isSelected ? 'bg-accent/10 dark:bg-accent/20 text-accent' : 'text-text dark:text-text'}
                    ${isHighlighted && !item.disabled ? 'bg-card-hover dark:bg-card-hover' : ''}
                    ${!item.disabled ? 'hover:bg-card-hover dark:hover:bg-card-hover cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                  `}
                  role="option"
                  aria-selected={isSelected}
                >
                  {item.icon && (
                    <span className="flex-shrink-0">{item.icon}</span>
                  )}
                  <span className="flex-1">{item.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

  return (
    <>
      {trigger ? (
        React.cloneElement(trigger as React.ReactElement, {
          ref: triggerRef,
          onClick: () => !disabled && setIsOpen(!isOpen),
          onKeyDown: handleKeyDown,
          'aria-haspopup': 'listbox',
          'aria-expanded': isOpen
        })
      ) : (
        defaultTrigger
      )}
      {menu}
    </>
  );
};

export default Dropdown;

// Select variant (styled like a form input)
interface SelectProps extends Omit<DropdownProps, 'trigger'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  required,
  ...dropdownProps
}) => {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text dark:text-text mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Dropdown
        {...dropdownProps}
        fullWidth
        className={hasError ? 'border-red-500' : ''}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-text-secondary dark:text-text-secondary">
          {helperText}
        </p>
      )}
    </div>
  );
};
