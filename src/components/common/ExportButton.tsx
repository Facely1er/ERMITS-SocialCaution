import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, FileJson, ChevronDown } from 'lucide-react';
import { exportToPDF, exportToCSV, exportToJSON, ExportableData } from '../../utils/exportUtils';

interface ExportButtonProps {
  data: ExportableData;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const exportOptions = [
    {
      id: 'pdf',
      label: 'Export as PDF',
      icon: FileText,
      action: () => exportToPDF(data),
      description: 'Download as PDF report'
    },
    {
      id: 'csv',
      label: 'Export as CSV',
      icon: FileSpreadsheet,
      action: () => exportToCSV(data),
      description: 'Download as CSV spreadsheet'
    },
    {
      id: 'json',
      label: 'Export as JSON',
      icon: FileJson,
      action: () => exportToJSON(data),
      description: 'Download raw data as JSON'
    }
  ];

  const handleExport = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Download className="w-4 h-4" />
        <span>Export Report</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-20"
          >
            <div className="p-2">
              {exportOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleExport(option.action)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ExportButton;