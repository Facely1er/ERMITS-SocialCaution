import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Card from '../../components/common/Card';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<Card>Default</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-card');
  });

  it('applies bordered variant', () => {
    const { container } = render(<Card variant="bordered">Bordered</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('border-2');
  });

  it('applies ghost variant', () => {
    const { container } = render(<Card variant="ghost">Ghost</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-transparent');
  });

  it('applies elevated variant', () => {
    const { container } = render(<Card variant="elevated">Elevated</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('shadow-lg');
  });

  it('applies padding classes', () => {
    const { container } = render(<Card padding="sm">Small padding</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('p-3');
  });

  it('applies no padding when padding is none', () => {
    const { container } = render(<Card padding="none">No padding</Card>);
    const card = container.firstChild;
    expect(card).not.toHaveClass('p-');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);
    
    const card = screen.getByText('Clickable');
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies hover classes when hover is true', () => {
    const { container } = render(<Card hover>Hoverable</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('cursor-pointer');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Custom</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('renders with animation when animate is true', () => {
    const { container } = render(<Card animate>Animated</Card>);
    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });
});

