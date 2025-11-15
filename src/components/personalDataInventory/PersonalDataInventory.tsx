import React, { useState, useEffect, useCallback } from 'react';
import { PersonalDataEntry, DataCategory, InventoryStats } from '../../types/personalDataInventory';
import { loadFromStorage, addEntry, updateEntry, deleteEntry } from '../../utils/personalDataInventory/storage';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/personalDataInventory/export';
import { loadDemoData } from '../../utils/personalDataInventory/demoData';
import { DATA_CATEGORIES } from '../../utils/personalDataInventory/constants';
import { DataEntryForm } from './DataEntryForm';
import { DataEntryList } from './DataEntryList';
import { ExportModal } from './ExportModal';
import { StatsDashboard } from './StatsDashboard';
import { SearchAndFilter } from './SearchAndFilter';
import { Plus, Download, Database } from 'lucide-react';

export const PersonalDataInventory: React.FC = () => {
  const [entries, setEntries] = useState<PersonalDataEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<PersonalDataEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PersonalDataEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DataCategory | 'all'>('all');
  const [showSensitiveOnly, setShowSensitiveOnly] = useState(false);
  const [showSharedOnly, setShowSharedOnly] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [filterEntries]);

  const loadEntries = () => {
    const loadedEntries = loadFromStorage();
    setEntries(loadedEntries);
  };

  const filterEntries = useCallback(() => {
    let filtered = [...entries];

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.dataType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(entry => entry.category === selectedCategory);
    }

    if (showSensitiveOnly) {
      filtered = filtered.filter(entry => entry.isSensitive);
    }

    if (showSharedOnly) {
      filtered = filtered.filter(entry => entry.isShared);
    }

    setFilteredEntries(filtered);
  }, [entries, searchTerm, selectedCategory, showSensitiveOnly, showSharedOnly]);

  const handleAddEntry = (entryData: Omit<PersonalDataEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry = addEntry(entryData);
    setEntries(prev => [...prev, newEntry]);
    setIsFormOpen(false);
  };

  const handleUpdateEntry = (id: string, updates: Partial<PersonalDataEntry>) => {
    const updatedEntry = updateEntry(id, updates);
    if (updatedEntry) {
      setEntries(prev => prev.map(entry => entry.id === id ? updatedEntry : entry));
      setEditingEntry(null);
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const success = deleteEntry(id);
      if (success) {
        setEntries(prev => prev.filter(entry => entry.id !== id));
      }
    }
  };

  const handleEditEntry = (entry: PersonalDataEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleLoadDemoData = () => {
    if (window.confirm('This will load sample data to demonstrate the tool. Continue?')) {
      loadDemoData();
      loadEntries();
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf', includeSensitive: boolean) => {
    const options = {
      format,
      includeSensitive,
      categories: selectedCategory !== 'all' ? [selectedCategory as DataCategory] : undefined
    };

    switch (format) {
      case 'csv': {
        const csvContent = exportToCSV(filteredEntries, options);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `personal_data_inventory_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        break;
      }
      case 'excel': {
        exportToExcel(filteredEntries, options);
        break;
      }
      case 'pdf': {
        exportToPDF(filteredEntries, options);
        break;
      }
    }
    setIsExportModalOpen(false);
  };

  const stats: InventoryStats = {
    totalEntries: entries.length,
    sensitiveDataCount: entries.filter(e => e.isSensitive).length,
    sharedDataCount: entries.filter(e => e.isShared).length,
    categoryBreakdown: DATA_CATEGORIES.reduce((acc, category) => {
      acc[category.value] = entries.filter(e => e.category === category.value).length;
      return acc;
    }, {} as Record<DataCategory, number>),
    recentEntries: entries.filter(e => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return e.createdAt > weekAgo;
    }).length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Personal Data Inventory</h1>
              <p className="text-gray-600 mt-2">
                Manage and track your personal data across different services and platforms
              </p>
            </div>
            <div className="flex space-x-3">
              {entries.length === 0 && (
                <button
                  onClick={handleLoadDemoData}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Load Demo Data
                </button>
              )}
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </button>
            </div>
          </div>

          {/* Stats Dashboard */}
          <StatsDashboard stats={stats} />
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            showSensitiveOnly={showSensitiveOnly}
            setShowSensitiveOnly={setShowSensitiveOnly}
            showSharedOnly={showSharedOnly}
            setShowSharedOnly={setShowSharedOnly}
            categories={DATA_CATEGORIES}
          />
        </div>

        {/* Data Entries List */}
        <div className="bg-white rounded-lg shadow-sm">
          <DataEntryList
            entries={filteredEntries}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />
        </div>

        {/* Entry Form Modal */}
        {isFormOpen && (
          <DataEntryForm
            entry={editingEntry}
            onSave={editingEntry ? handleUpdateEntry : handleAddEntry}
            onClose={() => {
              setIsFormOpen(false);
              setEditingEntry(null);
            }}
            categories={DATA_CATEGORIES}
          />
        )}

        {/* Export Modal */}
        {isExportModalOpen && (
          <ExportModal
            onExport={handleExport}
            onClose={() => setIsExportModalOpen(false)}
            entryCount={filteredEntries.length}
          />
        )}
      </div>
    </div>
  );
};
