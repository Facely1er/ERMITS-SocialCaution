import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ExportButton from '../../components/common/ExportButton';
import { ExportableData } from '../../utils/exportUtils';

// Mock the export utilities
vi.mock('../../utils/exportUtils', () => ({
  exportToPDF: vi.fn(),
  exportToCSV: vi.fn(),
  exportToJSON: vi.fn(),
}));

const mockExportData: ExportableData = {
  assessmentResults: {
    score: 75,
    maxScore: 100,
    percentage: 75,
    actionPlan: [],
    userLevel: 'intermediate'
  },
  userLevel: 'intermediate',
  timestamp: '2024-01-01T00:00:00.000Z',
  actionPlan: [
    {
      title: 'Test Action',
      description: 'Test Description',
      priority: 'high',
      completed: false,
      category: 'Security'
    }
  ],
  categoryScores: [
    {
      category: 'Security',
      score: 75,
      maxScore: 100,
      percentage: 75
    }
  ]
};

describe('ExportButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders export button', () => {
    render(<ExportButton data={mockExportData} />);
    
    expect(screen.getByRole('button', { name: /export report/i })).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    render(<ExportButton data={mockExportData} />);
    
    const button = screen.getByRole('button', { name: /export report/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Export as PDF')).toBeInTheDocument();
      expect(screen.getByText('Export as CSV')).toBeInTheDocument();
      expect(screen.getByText('Export as JSON')).toBeInTheDocument();
    });
  });

  it('calls exportToPDF when PDF option is clicked', async () => {
    const { exportToPDF } = await import('../../utils/exportUtils');
    
    render(<ExportButton data={mockExportData} />);
    
    const button = screen.getByRole('button', { name: /export report/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      const pdfButton = screen.getByText('Export as PDF');
      fireEvent.click(pdfButton);
    });
    
    expect(exportToPDF).toHaveBeenCalledWith(mockExportData);
  });

  it('calls exportToCSV when CSV option is clicked', async () => {
    const { exportToCSV } = await import('../../utils/exportUtils');
    
    render(<ExportButton data={mockExportData} />);
    
    const button = screen.getByRole('button', { name: /export report/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      const csvButton = screen.getByText('Export as CSV');
      fireEvent.click(csvButton);
    });
    
    expect(exportToCSV).toHaveBeenCalledWith(mockExportData);
  });

  it('calls exportToJSON when JSON option is clicked', async () => {
    const { exportToJSON } = await import('../../utils/exportUtils');
    
    render(<ExportButton data={mockExportData} />);
    
    const button = screen.getByRole('button', { name: /export report/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      const jsonButton = screen.getByText('Export as JSON');
      fireEvent.click(jsonButton);
    });
    
    expect(exportToJSON).toHaveBeenCalledWith(mockExportData);
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ExportButton data={mockExportData} />
      </div>
    );
    
    const button = screen.getByRole('button', { name: /export report/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Export as PDF')).toBeInTheDocument();
    });
    
    // Click on the backdrop (the fixed inset-0 div)
    const backdrop = document.querySelector('.fixed.inset-0');
    if (backdrop) {
      fireEvent.click(backdrop);
    } else {
      // Fallback: click outside the dropdown
      const outside = screen.getByTestId('outside');
      fireEvent.click(outside);
    }
    
    await waitFor(() => {
      expect(screen.queryByText('Export as PDF')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('applies custom className', () => {
    const { container } = render(
      <ExportButton data={mockExportData} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});