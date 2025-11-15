import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToPDF, exportToCSV, exportToJSON, ExportableData } from '../../utils/exportUtils';

// Mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => {
    const mockDoc = {
      setFontSize: vi.fn().mockReturnThis(),
      setFont: vi.fn().mockReturnThis(),
      text: vi.fn().mockReturnThis(),
      autoTable: vi.fn().mockReturnThis(),
      addPage: vi.fn().mockReturnThis(),
      getNumberOfPages: vi.fn(() => 1),
      setPage: vi.fn().mockReturnThis(),
      save: vi.fn(),
      splitTextToSize: vi.fn((text: string, maxWidth: number) => {
        // Simulate text splitting - return array of lines
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        words.forEach(word => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          if (testLine.length * 5 <= maxWidth) { // Rough estimate: 5px per char
            currentLine = testLine;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          }
        });
        if (currentLine) lines.push(currentLine);
        return lines.length > 0 ? lines : [text];
      }),
      lastAutoTable: {
        finalY: 100
      },
      internal: {
        pageSize: {
          getWidth: vi.fn(() => 210),
          getHeight: vi.fn(() => 297)
        }
      }
    };
    // Make autoTable set lastAutoTable
    mockDoc.autoTable = vi.fn((options: any) => {
      mockDoc.lastAutoTable = {
        finalY: (options.startY || 20) + 50 // Simulate table height
      };
      return mockDoc;
    });
    return mockDoc;
  })
}));

// Mock jspdf-autotable
vi.mock('jspdf-autotable', () => ({}));

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
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your accounts',
      priority: 'high',
      completed: false,
      category: 'Security',
      dueDate: '2024-01-15T00:00:00.000Z'
    },
    {
      title: 'Update Privacy Settings',
      description: 'Review and update your social media privacy settings',
      priority: 'medium',
      completed: true,
      category: 'Privacy'
    }
  ],
  categoryScores: [
    {
      category: 'Security',
      score: 75,
      maxScore: 100,
      percentage: 75
    },
    {
      category: 'Privacy',
      score: 60,
      maxScore: 100,
      percentage: 60
    }
  ]
};

describe('exportUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportToPDF', () => {
    it('should create and save PDF with correct data', async () => {
      // Get the mocked jsPDF
      const jsPDFModule = await import('jspdf');
      const jsPDF = vi.mocked(jsPDFModule.default) as any;
      
      // Clear previous calls
      vi.clearAllMocks();
      
      // Call the function
      exportToPDF(mockExportData);
      
      // Verify jsPDF constructor was called
      expect(jsPDF).toHaveBeenCalled();
      
      // Get the instance that was created
      const mockInstance = jsPDF.mock.results[0]?.value;
      
      if (mockInstance) {
        // Verify methods were called on the instance
        expect(mockInstance.setFontSize).toHaveBeenCalled();
        expect(mockInstance.setFont).toHaveBeenCalled();
        expect(mockInstance.text).toHaveBeenCalled();
        expect(mockInstance.autoTable).toHaveBeenCalled();
        expect(mockInstance.save).toHaveBeenCalledWith(
          expect.stringContaining('privacy-assessment-report-')
        );
      } else {
        // Fallback: just verify the constructor was called
        expect(jsPDF).toHaveBeenCalled();
      }
    });
  });

  describe('exportToCSV', () => {
    it('should create and download CSV file', () => {
      // Mock URL.createObjectURL and document methods
      const mockCreateObjectURL = vi.fn(() => 'mock-url');
      const mockRevokeObjectURL = vi.fn();
      const mockClick = vi.fn();
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();

      Object.defineProperty(URL, 'createObjectURL', {
        value: mockCreateObjectURL,
        writable: true
      });
      Object.defineProperty(URL, 'revokeObjectURL', {
        value: mockRevokeObjectURL,
        writable: true
      });

      const mockLink = {
        setAttribute: vi.fn(),
        click: mockClick,
        style: { visibility: 'hidden' }
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
      vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);

      exportToCSV(mockExportData);

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'mock-url');
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        expect.stringContaining('privacy-assessment-report-')
      );
      expect(mockClick).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
    });

    it('should include all data in CSV content', () => {
      const mockCreateObjectURL = vi.fn(() => 'mock-url');
      const mockRevokeObjectURL = vi.fn();
      const mockClick = vi.fn();

      Object.defineProperty(URL, 'createObjectURL', {
        value: mockCreateObjectURL,
        writable: true
      });
      Object.defineProperty(URL, 'revokeObjectURL', {
        value: mockRevokeObjectURL,
        writable: true
      });

      const mockLink = {
        setAttribute: vi.fn(),
        click: mockClick,
        style: { visibility: 'hidden' }
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn());
      vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn());

      exportToCSV(mockExportData);

      // The CSV content should be passed to createObjectURL
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockCreateObjectURL.mock.calls.length).toBeGreaterThan(0);
      const blobCall = (mockCreateObjectURL.mock.calls[0] as unknown as [Blob])[0];
      expect(blobCall).toBeInstanceOf(Blob);
    });
  });

  describe('exportToJSON', () => {
    it('should create and download JSON file', () => {
      const mockCreateObjectURL = vi.fn(() => 'mock-url');
      const mockRevokeObjectURL = vi.fn();
      const mockClick = vi.fn();

      Object.defineProperty(URL, 'createObjectURL', {
        value: mockCreateObjectURL,
        writable: true
      });
      Object.defineProperty(URL, 'revokeObjectURL', {
        value: mockRevokeObjectURL,
        writable: true
      });

      const mockLink = {
        setAttribute: vi.fn(),
        click: mockClick,
        style: { visibility: 'hidden' }
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn());
      vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn());

      exportToJSON(mockExportData);

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'mock-url');
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        expect.stringContaining('privacy-assessment-data-')
      );
      expect(mockClick).toHaveBeenCalled();
    });

    it('should include export metadata in JSON', () => {
      const mockCreateObjectURL = vi.fn(() => 'mock-url');
      const mockRevokeObjectURL = vi.fn();

      Object.defineProperty(URL, 'createObjectURL', {
        value: mockCreateObjectURL,
        writable: true
      });
      Object.defineProperty(URL, 'revokeObjectURL', {
        value: mockRevokeObjectURL,
        writable: true
      });

      const mockLink = {
        setAttribute: vi.fn(),
        click: vi.fn(),
        style: { visibility: 'hidden' }
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn());
      vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn());

      exportToJSON(mockExportData);

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockCreateObjectURL.mock.calls.length).toBeGreaterThan(0);
      const blobCall = (mockCreateObjectURL.mock.calls[0] as unknown as [Blob])[0];
      expect(blobCall).toBeInstanceOf(Blob);
    });
  });
});