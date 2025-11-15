import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';

interface ExportModalProps {
  onExport: (format: 'csv' | 'excel' | 'pdf', includeSensitive: boolean) => void;
  onClose: () => void;
  entryCount: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  onExport,
  onClose,
  entryCount
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [includeSensitive, setIncludeSensitive] = useState(false);

  const exportOptions = [
    {
      format: 'csv' as const,
      name: 'CSV',
      description: 'Comma-separated values, compatible with Excel and Google Sheets',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      format: 'excel' as const,
      name: 'Excel',
      description: 'Microsoft Excel format (.csv)',
      icon: FileSpreadsheet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      format: 'pdf' as const,
      name: 'PDF',
      description: 'Portable Document Format, perfect for reports',
      icon: File,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  const handleExport = () => {
    onExport(selectedFormat, includeSensitive);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Export Data</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Export Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Download className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Exporting {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
                </span>
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Format</h3>
              <div className="space-y-3">
                {exportOptions.map((option) => (
                  <label
                    key={option.format}
                    className={`relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedFormat === option.format
                        ? `${option.borderColor} ${option.bgColor}`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={option.format}
                      checked={selectedFormat === option.format}
                      onChange={(e) => setSelectedFormat(e.target.value as any)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <option.icon className={`w-6 h-6 mr-3 ${option.color}`} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {option.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {option.description}
                        </div>
                      </div>
                    </div>
                    {selectedFormat === option.format && (
                      <div className="absolute top-4 right-4">
                        <div className={`w-4 h-4 rounded-full ${option.bgColor} border-2 ${option.borderColor} flex items-center justify-center`}>
                          <div className={`w-2 h-2 rounded-full ${option.color.replace('text-', 'bg-')}`} />
                        </div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Sensitive Data Option */}
            <div className="border-t pt-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="includeSensitive"
                  checked={includeSensitive}
                  onChange={(e) => setIncludeSensitive(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                />
                <div className="ml-3">
                  <label htmlFor="includeSensitive" className="text-sm font-medium text-gray-700">
                    Include sensitive data
                  </label>
                  <p className="text-sm text-gray-500">
                    This will include entries marked as sensitive data in the export.
                    Only enable if you trust the destination and have proper security measures.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export {exportOptions.find(opt => opt.format === selectedFormat)?.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
