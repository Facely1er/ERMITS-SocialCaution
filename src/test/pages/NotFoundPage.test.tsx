import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import NotFoundPage from '../../pages/NotFoundPage';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
  },
}));

// Mock StandardPageHeader
vi.mock('../../components/common/StandardPageHeader', () => ({
  default: ({ title, subtitle }: any) => (
    <div data-testid="page-header">
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}
    </div>
  ),
}));

// Mock Section component
vi.mock('../../components/common/Section', () => ({
  default: ({ children, centered }: any) => (
    <section data-testid="section" data-centered={centered}>
      {children}
    </section>
  ),
}));

describe('NotFoundPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders 404 heading', () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByText(/404: Page Not Found/i)).toBeInTheDocument();
  });

  it('renders error message', () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByText(/Oops! The page you're looking for/i)).toBeInTheDocument();
  });

  it('renders return to homepage button', () => {
    renderWithRouter(<NotFoundPage />);
    const button = screen.getByRole('link', { name: /return to homepage/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/');
  });

  it('renders contact support link', () => {
    renderWithRouter(<NotFoundPage />);
    const link = screen.getByRole('link', { name: /contact our support team/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/contact');
  });
});

