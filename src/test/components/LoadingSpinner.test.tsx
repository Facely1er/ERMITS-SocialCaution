import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '../../components/common/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders spinner', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('div');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('applies small size classes', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector('div');
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('applies medium size classes by default', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('div');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('applies large size classes', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('div');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    const spinner = container.querySelector('div');
    expect(spinner).toHaveClass('custom-class');
  });

  it('has rounded-full class', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('div');
    expect(spinner).toHaveClass('rounded-full');
  });
});

