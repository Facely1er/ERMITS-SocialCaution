import { PersonalDataEntry, ExportOptions } from '../../types/personalDataInventory';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToCSV = (entries: PersonalDataEntry[], options: ExportOptions): string => {
  const filteredEntries = filterEntries(entries, options);
  
  const headers = [
    'Category',
    'Data Type',
    'Description',
    'Source',
    'Purpose',
    'Retention Period',
    'Legal Basis',
    'Sensitive Data',
    'Shared Data',
    'Shared With',
    'Created At',
    'Updated At',
    'Notes'
  ];
  
  const csvContent = [
    headers.join(','),
    ...filteredEntries.map(entry => [
      entry.category,
      `"${entry.dataType}"`,
      `"${entry.description}"`,
      `"${entry.source}"`,
      `"${entry.purpose}"`,
      `"${entry.retentionPeriod}"`,
      `"${entry.legalBasis}"`,
      entry.isSensitive ? 'Yes' : 'No',
      entry.isShared ? 'Yes' : 'No',
      `"${entry.sharedWith.join(', ')}"`,
      entry.createdAt.toISOString().split('T')[0],
      entry.updatedAt.toISOString().split('T')[0],
      `"${entry.notes || ''}"`
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

export const exportToExcel = (entries: PersonalDataEntry[], options: ExportOptions): void => {
  const filteredEntries = filterEntries(entries, options);
  
  // Create CSV content (Excel can open CSV files)
  const csvContent = exportToCSV(filteredEntries, options);
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `personal_data_inventory_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (entries: PersonalDataEntry[], options: ExportOptions): void => {
  const filteredEntries = filterEntries(entries, options);
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Personal Data Inventory', 14, 22);
  
  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Prepare table data
  const tableData = filteredEntries.map(entry => [
    entry.category.replace('_', ' ').toUpperCase(),
    entry.dataType,
    entry.description,
    entry.source,
    entry.purpose,
    entry.retentionPeriod,
    entry.legalBasis,
    entry.isSensitive ? 'Yes' : 'No',
    entry.isShared ? 'Yes' : 'No',
    entry.sharedWith.join(', '),
    entry.createdAt.toLocaleDateString(),
    entry.notes || ''
  ]);
  
  // Create table
  doc.autoTable({
    head: [['Category', 'Data Type', 'Description', 'Source', 'Purpose', 'Retention', 'Legal Basis', 'Sensitive', 'Shared', 'Shared With', 'Created', 'Notes']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 15 },
      2: { cellWidth: 25 },
      3: { cellWidth: 15 },
      4: { cellWidth: 20 },
      5: { cellWidth: 15 },
      6: { cellWidth: 15 },
      7: { cellWidth: 10 },
      8: { cellWidth: 10 },
      9: { cellWidth: 20 },
      10: { cellWidth: 12 },
      11: { cellWidth: 20 }
    }
  });
  
  // Save the PDF
  doc.save(`personal_data_inventory_${new Date().toISOString().split('T')[0]}.pdf`);
};

const filterEntries = (entries: PersonalDataEntry[], options: ExportOptions): PersonalDataEntry[] => {
  let filtered = [...entries];
  
  // Filter by date range
  if (options.dateRange) {
    filtered = filtered.filter(entry => 
      entry.createdAt >= options.dateRange!.start && 
      entry.createdAt <= options.dateRange!.end
    );
  }
  
  // Filter by categories
  if (options.categories && options.categories.length > 0) {
    filtered = filtered.filter(entry => options.categories!.includes(entry.category));
  }
  
  // Filter sensitive data
  if (!options.includeSensitive) {
    filtered = filtered.filter(entry => !entry.isSensitive);
  }
  
  return filtered;
};

export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
