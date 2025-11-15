import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from '../../components/common/Badge';

describe('Badge', () => {
  it('renders badge with children', () => {
    render(<Badge>Badge text</Badge>);
    expect(screen.getByText('Badge text')).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    const { container } = render(<Badge>Primary</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-accent/20');
  });

  it('applies secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-secondary/20');
  });

  it('applies success variant', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-success/20');
  });

  it('applies warning variant', () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-warning/20');
  });

  it('applies danger variant', () => {
    const { container } = render(<Badge variant="danger">Danger</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-danger/20');
  });

  it('applies accent variant', () => {
    const { container } = render(<Badge variant="accent">Accent</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-accent/10');
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('custom-class');
  });

  it('has base classes', () => {
    const { container } = render(<Badge>Base</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full');
  });
});

