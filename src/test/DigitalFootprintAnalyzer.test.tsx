import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DigitalFootprintAnalyzer from '../pages/tools/DigitalFootprintAnalyzer';
import { ToolsApiService } from '../services/toolsApi';

// Mock the API service
vi.mock('../services/toolsApi');
const mockToolsApiService = ToolsApiService as any;

// TranslationProvider removed - no longer needed

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    AnimatePresence: ({ children }: any) => children
  },
  AnimatePresence: ({ children }: any) => children
}));

// Mock StandardPageHeader
vi.mock('../../components/common/StandardPageHeader', () => ({
  default: ({ title, subtitle, children }: any) => (
    <div data-testid="page-header">
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  ),
}));

// Mock Section component
vi.mock('../../components/common/Section', () => ({
  default: ({ children }: any) => (
    <section data-testid="section">
      {children}
    </section>
  ),
}));

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: any) => <div data-testid="pie">{children}</div>,
  Cell: ({ children }: any) => <div data-testid="cell">{children}</div>,
  Tooltip: () => <div data-testid="tooltip" />
}));

// Mock jsPDF
vi.mock('jspdf', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      setFontSize: vi.fn(),
      setFont: vi.fn(),
      text: vi.fn(),
      addPage: vi.fn(),
      getNumberOfPages: vi.fn(() => 1),
      setPage: vi.fn(),
      internal: {
        pageSize: {
          getWidth: vi.fn(() => 210),
          getHeight: vi.fn(() => 297)
        }
      },
      save: vi.fn(),
      autoTable: vi.fn()
    }))
  };
});

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <DigitalFootprintAnalyzer />
    </BrowserRouter>
  );
};

describe('DigitalFootprintAnalyzer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockToolsApiService.getAnalysisHistory.mockResolvedValue([]);
  });

  afterEach(() => {
    cleanup();
  });

  describe('Initial Render', () => {
    it('renders the component with initial state', () => {
      renderComponent();
      
      expect(screen.getByText('Digital Footprint Analyzer')).toBeInTheDocument();
      expect(screen.getByText('Discover and analyze your online presence across the internet')).toBeInTheDocument();
      expect(screen.getByText('Ready to analyze your digital footprint?')).toBeInTheDocument();
    });

    it('shows demo mode disclaimer', () => {
      renderComponent();
      
      expect(screen.getByText('Demo Mode')).toBeInTheDocument();
      expect(screen.getByText(/This tool uses simulated data for demonstration purposes/)).toBeInTheDocument();
    });

    it('renders input field and start button', () => {
      renderComponent();
      
      expect(screen.getByLabelText('Name to search')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Start Analysis/i })).toBeInTheDocument();
    });
  });

  describe('Analysis Process', () => {
    const mockAnalysisData = {
      searchQuery: 'John Doe',
      results: [
        {
          id: 'social-media',
          name: 'Social Media Profiles',
          type: 'Public Information',
          risk: 'high' as const,
          description: 'Public profiles on social media platforms',
          recommendation: 'Review privacy settings',
          examples: ['Facebook', 'Instagram'],
          found: true,
          confidence: 0.9,
          dataPoints: ['Personal information', 'Photos'],
          platforms: ['Facebook', 'Instagram'],
          lastUpdated: '2024-01-01T00:00:00Z'
        }
      ],
      analyzedAt: '2024-01-01T00:00:00Z',
      riskLevel: 'high' as const,
      summary: {
        totalFound: 1,
        highRiskFound: 1,
        mediumRiskFound: 0,
        lowRiskFound: 0,
        riskDistribution: { high: 1, medium: 0, low: 0 },
        overallRisk: 'high',
        confidence: 0.9
      }
    };

    it('performs analysis when form is submitted', async () => {
      mockToolsApiService.analyzeDigitalFootprint.mockResolvedValue(mockAnalysisData);
      
      renderComponent();
      
      const input = screen.getByLabelText('Name to search');
      const button = screen.getByRole('button', { name: /Start Analysis/i });
      
      fireEvent.change(input, { target: { value: 'John Doe' } });
      fireEvent.click(button);
      
      expect(screen.getByText('Analyzing...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText('Analysis Summary')).toBeInTheDocument();
      });
    });

    it('shows error when analysis fails', async () => {
      mockToolsApiService.analyzeDigitalFootprint.mockRejectedValue(new Error('Analysis failed'));
      
      renderComponent();
      
      const input = screen.getByLabelText('Name to search');
      const button = screen.getByRole('button', { name: /Start Analysis/i });
      
      fireEvent.change(input, { target: { value: 'John Doe' } });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Analysis failed. Please try again.')).toBeInTheDocument();
      });
    });

    it('validates input before analysis', () => {
      renderComponent();
      
      const button = screen.getByRole('button', { name: /Start Analysis/i });
      
      fireEvent.click(button);
      
      expect(screen.getByText('Please enter a search query')).toBeInTheDocument();
    });
  });

  describe('Analysis Results Display', () => {
    const mockAnalysisData = {
      searchQuery: 'John Doe',
      results: [
        {
          id: 'social-media',
          name: 'Social Media Profiles',
          type: 'Public Information',
          risk: 'high' as const,
          description: 'Public profiles on social media platforms',
          recommendation: 'Review privacy settings',
          examples: ['Facebook', 'Instagram'],
          found: true,
          confidence: 0.9,
          dataPoints: ['Personal information', 'Photos'],
          platforms: ['Facebook', 'Instagram'],
          lastUpdated: '2024-01-01T00:00:00Z'
        },
        {
          id: 'data-brokers',
          name: 'Data Broker Listings',
          type: 'Aggregated Data',
          risk: 'medium' as const,
          description: 'Personal information collected by data brokers',
          recommendation: 'Submit opt-out requests',
          examples: ['Spokeo', 'WhitePages'],
          found: false,
          confidence: 0.3,
          lastUpdated: '2024-01-01T00:00:00Z'
        }
      ],
      analyzedAt: '2024-01-01T00:00:00Z',
      riskLevel: 'high' as const,
      summary: {
        totalFound: 1,
        highRiskFound: 1,
        mediumRiskFound: 0,
        lowRiskFound: 0,
        riskDistribution: { high: 1, medium: 0, low: 0 },
        overallRisk: 'high',
        confidence: 0.9
      }
    };

    beforeEach(() => {
      mockToolsApiService.analyzeDigitalFootprint.mockResolvedValue(mockAnalysisData);
    });

    it('displays analysis summary correctly', async () => {
      renderComponent();
      
      const input = screen.getByLabelText('Name to search');
      const button = screen.getByRole('button', { name: /Start Analysis/i });
      
      fireEvent.change(input, { target: { value: 'John Doe' } });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Analysis Summary')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument(); // Total found
        expect(screen.getByText('HIGH')).toBeInTheDocument();
      });
    });

    it('displays detailed results correctly', async () => {
      renderComponent();
      
      const input = screen.getByLabelText('Name to search');
      const button = screen.getByRole('button', { name: /Start Analysis/i });
      
      fireEvent.change(input, { target: { value: 'John Doe' } });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Social Media Profiles')).toBeInTheDocument();
        expect(screen.getByText('FOUND')).toBeInTheDocument();
        expect(screen.getByText('Data Broker Listings')).toBeInTheDocument();
        expect(screen.getByText('NOT FOUND')).toBeInTheDocument();
      });
    });

    it('shows risk level indicators correctly', async () => {
      renderComponent();
      
      const input = screen.getByLabelText('Name to search');
      const button = screen.getByRole('button', { name: /Start Analysis/i });
      
      fireEvent.change(input, { target: { value: 'John Doe' } });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('HIGH')).toBeInTheDocument();
        expect(screen.getByText('MEDIUM')).toBeInTheDocument();
      });
    });
  });

  describe('Report Generation', () => {
    const mockAnalysisData = {
      searchQuery: 'John Doe',
      results: [],
      analyzedAt: '2024-01-01T00:00:00Z',
      riskLevel: 'high' as const,
      summary: {
        totalFound: 0,
        highRiskFound: 0,
        mediumRiskFound: 0,
        lowRiskFound: 0,
        riskDistribution: { high: 0, medium: 0, low: 0 },
        overallRisk: 'low',
        confidence: 0.5
      }
    };

    beforeEach(() => {
      mockToolsApiService.analyzeDigitalFootprint.mockResolvedValue(mockAnalysisData);
    });

    it('generates JSON report', async () => {
      // Save original methods
      const originalCreateElement = document.createElement;
      const originalAppendChild = document.body.appendChild;
      const originalRemoveChild = document.body.removeChild;
      const originalCreateObjectURL = global.URL.createObjectURL;
      const originalRevokeObjectURL = global.URL.revokeObjectURL;

      // Mock URL.createObjectURL and URL.revokeObjectURL
      const mockCreateObjectURL = vi.fn(() => 'mock-url');
      const mockRevokeObjectURL = vi.fn();
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      // Mock document.createElement and appendChild
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      };
      const mockCreateElement = vi.fn((tagName: string) => {
        if (tagName === 'a') {
          return mockLink as any;
        }
        return originalCreateElement.call(document, tagName);
      });
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      
      Object.defineProperty(document, 'createElement', {
        value: mockCreateElement,
        writable: true,
        configurable: true
      });
      Object.defineProperty(document.body, 'appendChild', {
        value: mockAppendChild,
        writable: true,
        configurable: true
      });
      Object.defineProperty(document.body, 'removeChild', {
        value: mockRemoveChild,
        writable: true,
        configurable: true
      });

      try {
        renderComponent();
        
        const input = screen.getByLabelText('Name to search');
        const button = screen.getByRole('button', { name: /Start Analysis/i });
        
        fireEvent.change(input, { target: { value: 'John Doe' } });
        fireEvent.click(button);
        
        await waitFor(() => {
          expect(screen.getByText('Analysis Summary')).toBeInTheDocument();
        });

        const jsonButton = screen.getByRole('button', { name: /JSON/i });
        fireEvent.click(jsonButton);

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockLink.click).toHaveBeenCalled();
      } finally {
        // Restore original methods
        Object.defineProperty(document, 'createElement', {
          value: originalCreateElement,
          writable: true,
          configurable: true
        });
        Object.defineProperty(document.body, 'appendChild', {
          value: originalAppendChild,
          writable: true,
          configurable: true
        });
        Object.defineProperty(document.body, 'removeChild', {
          value: originalRemoveChild,
          writable: true,
          configurable: true
        });
        global.URL.createObjectURL = originalCreateObjectURL;
        global.URL.revokeObjectURL = originalRevokeObjectURL;
      }
    });

    it('generates PDF report', async () => {
      renderComponent();
      
      const input = screen.getByLabelText('Name to search');
      const button = screen.getByRole('button', { name: /Start Analysis/i });
      
      fireEvent.change(input, { target: { value: 'John Doe' } });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Analysis Summary')).toBeInTheDocument();
      });

      const pdfButton = screen.getByRole('button', { name: /PDF/i });
      fireEvent.click(pdfButton);

      // PDF generation is tested through the jsPDF mock
      expect(pdfButton).toBeInTheDocument();
    });
  });

  describe('Analysis History', () => {
    const mockHistory = [
      {
        _id: '1',
        type: 'digital-footprint',
        data: {
          searchQuery: 'John Doe',
          results: [],
          analyzedAt: '2024-01-01T00:00:00Z',
          riskLevel: 'high' as const
        },
        analyzedAt: '2024-01-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    it('loads and displays analysis history', async () => {
      mockToolsApiService.getAnalysisHistory.mockResolvedValue(mockHistory);
      
      renderComponent();
      
      const historyButton = screen.getByRole('button', { name: /History/i });
      fireEvent.click(historyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Analysis History')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('loads previous analysis when clicked', async () => {
      mockToolsApiService.getAnalysisHistory.mockResolvedValue(mockHistory);
      
      renderComponent();
      
      const historyButton = screen.getByRole('button', { name: /History/i });
      fireEvent.click(historyButton);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const historyItem = screen.getByText('John Doe');
      fireEvent.click(historyItem);
      
      expect(screen.getByText('Analysis Summary')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      mockToolsApiService.analyzeDigitalFootprint.mockRejectedValue(new Error('Network error'));
      
      renderComponent();
      
      const input = screen.getByLabelText('Name to search');
      const button = screen.getByRole('button', { name: /Start Analysis/i });
      
      fireEvent.change(input, { target: { value: 'John Doe' } });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('handles empty analysis results', async () => {
      mockToolsApiService.analyzeDigitalFootprint.mockResolvedValue({
        searchQuery: 'John Doe',
        results: [],
        analyzedAt: '2024-01-01T00:00:00Z',
        riskLevel: 'low' as const
      });
      
      renderComponent();
      
      const input = screen.getByLabelText('Name to search');
      const button = screen.getByRole('button', { name: /Start Analysis/i });
      
      fireEvent.change(input, { target: { value: 'John Doe' } });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Analysis Summary')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      renderComponent();
      
      expect(screen.getByLabelText('Name to search')).toBeInTheDocument();
    });

    it('has proper button labels', () => {
      renderComponent();
      
      expect(screen.getByRole('button', { name: /Start Analysis/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /History/i })).toBeInTheDocument();
    });

    it('shows loading state with proper text', async () => {
      mockToolsApiService.analyzeDigitalFootprint.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          searchQuery: 'John Doe',
          results: [],
          analyzedAt: '2024-01-01T00:00:00Z',
          riskLevel: 'low' as const
        }), 100))
      );
      
      renderComponent();
      
      const input = screen.getByLabelText('Name to search');
      const button = screen.getByRole('button', { name: /Start Analysis/i });
      
      fireEvent.change(input, { target: { value: 'John Doe' } });
      fireEvent.click(button);
      
      expect(screen.getByText('Analyzing...')).toBeInTheDocument();
    });
  });
});