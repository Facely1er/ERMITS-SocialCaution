import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit, Trash2, Eye, Shield, Database, AlertTriangle, CheckCircle, X, Download, Upload, FileDown } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { exportPersonalDataInventoryToPDF, exportPersonalDataInventoryToCSV, exportPersonalDataInventoryToJSON } from '../../utils/toolsExport';
interface DataItem {
  id: string;
  category: 'personal_info' | 'financial' | 'health' | 'social' | 'location' | 'biometric';
  name: string;
  description: string;
  sensitivity: 'low' | 'medium' | 'high';
  storedBy: string[];
  purpose: string;
  retention: string;
  sharedWith: string[];
  lastUpdated: string;
}

interface DataCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const PersonalDataInventory: React.FC = () => {
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const categories: DataCategory[] = [
    {
      id: 'personal_info',
      name: 'Personal Information',
      description: 'Name, age, address, phone number',
      icon: FileText,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      id: 'financial',
      name: 'Financial Data',
      description: 'Bank accounts, credit cards, income',
      icon: Database,
      color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      id: 'health',
      name: 'Health Data',
      description: 'Medical records, prescriptions, conditions',
      icon: Shield,
      color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    },
    {
      id: 'social',
      name: 'Social Media',
      description: 'Profiles, posts, friends, photos',
      icon: Eye,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      id: 'location',
      name: 'Location Data',
      description: 'GPS, addresses, travel history',
      icon: Eye,
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    },
    {
      id: 'biometric',
      name: 'Biometric Data',
      description: 'Fingerprints, facial recognition',
      icon: Shield,
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
    }
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    const loadDataFromStorage = () => {
      try {
        const stored = localStorage.getItem('personalDataInventory');
        if (stored) {
          const parsed = JSON.parse(stored);
          setDataItems(parsed);
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadDataFromStorage();
  }, []);

  // Save data to localStorage whenever dataItems changes
  useEffect(() => {
    if (dataItems.length > 0 || localStorage.getItem('personalDataInventory')) {
      try {
        localStorage.setItem('personalDataInventory', JSON.stringify(dataItems));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  }, [dataItems]);

  const getSensitivityColor = (sensitivity: 'low' | 'medium' | 'high') => {
    switch (sensitivity) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
    }
  };

  const getSensitivityIcon = (sensitivity: 'low' | 'medium' | 'high') => {
    switch (sensitivity) {
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? dataItems 
    : dataItems.filter(item => item.category === selectedCategory);

  const getCategoryStats = () => {
    const stats = categories.map(category => {
      const count = dataItems.filter(item => item.category === category.id).length;
      const highSensitivity = dataItems.filter(item => 
        item.category === category.id && item.sensitivity === 'high'
      ).length;
      return { ...category, count, highSensitivity };
    });
    return stats;
  };

  const [formData, setFormData] = useState<Partial<DataItem>>({
    name: '',
    description: '',
    category: 'personal_info',
    sensitivity: 'medium',
    storedBy: [],
    purpose: '',
    retention: '',
    sharedWith: []
  });

  const [storedByInput, setStoredByInput] = useState('');
  const [sharedWithInput, setSharedWithInput] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
      setStoredByInput(editingItem.storedBy.join(', '));
      setSharedWithInput(editingItem.sharedWith.join(', '));
      setShowAddForm(true);
    } else if (showAddForm) {
      setFormData({
        name: '',
        description: '',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: [],
        purpose: '',
        retention: '',
        sharedWith: []
      });
      setStoredByInput('');
      setSharedWithInput('');
    }
  }, [editingItem, showAddForm]);

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: 'personal_info',
      sensitivity: 'medium',
      storedBy: [],
      purpose: '',
      retention: '',
      sharedWith: []
    });
    setStoredByInput('');
    setSharedWithInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const storedByArray = storedByInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const sharedWithArray = sharedWithInput.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const newItem: DataItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name || '',
      description: formData.description || '',
      category: formData.category || 'personal_info',
      sensitivity: formData.sensitivity || 'medium',
      storedBy: storedByArray,
      purpose: formData.purpose || '',
      retention: formData.retention || '',
      sharedWith: sharedWithArray,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (editingItem) {
      setDataItems(prev => prev.map(i => i.id === editingItem.id ? newItem : i));
    } else {
      setDataItems(prev => [...prev, newItem]);
    }

    handleCloseForm();
  };

  return (
    <PageLayout
      title={'Personal Data Inventory'}
      subtitle={'Inventory and manage your personal data'}
    >
      {/* Real Tool Indicator */}
      <div className="mb-6">
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                {'Real Tool'}
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                {'This tool allows you to create and manage a real inventory of your personal data. Your information is stored locally and is not shared.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Section>
        {/* Category Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {getCategoryStats().map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCategory(category.id);
                    }
                  }}
                >
                  <Card 
                    className="p-4 cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-2" />
                      <h3 className="font-semibold text-text dark:text-white">{category.name}</h3>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${category.color}`}>
                      {category.count}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-300 mb-2">
                    {category.description}
                  </p>
                  {category.highSensitivity > 0 && (
                    <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {category.highSensitivity} {'sensitive data'}
                    </div>
                  )}
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filter, Add Button, and Export/Import */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'primary' : 'outline'}
              size="sm"
            >
              {'All'}
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? 'primary' : 'outline'}
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <input
                type="file"
                accept=".json"
                className="hidden"
                id="import-json"
                aria-label="Import JSON file for personal data inventory"
                ref={(input) => {
                  if (input) {
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const json = JSON.parse(event.target?.result as string);
                            if (json.items && Array.isArray(json.items)) {
                              setDataItems(json.items);
                              alert('Data imported successfully!');
                            } else {
                              alert('Invalid file format. Expected JSON with items array.');
                            }
                          } catch (error) {
                            alert('Error importing file. Please check the file format.');
                          }
                        };
                        reader.readAsText(file);
                      }
                    };
                  }
                }}
              />
              <Button
                onClick={() => document.getElementById('import-json')?.click()}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                {'Import JSON'}
              </Button>
            </div>
            <div className="relative">
              <Button
                onClick={() => setShowExportMenu(!showExportMenu)}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                {'Export'}
              </Button>
              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 min-w-[150px]">
                    <button
                      onClick={() => {
                        exportPersonalDataInventoryToPDF(dataItems);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-sm"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      {'Export PDF'}
                    </button>
                    <button
                      onClick={() => {
                        exportPersonalDataInventoryToCSV(dataItems);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-sm"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      {'Export CSV'}
                    </button>
                    <button
                      onClick={() => {
                        exportPersonalDataInventoryToJSON(dataItems);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-sm"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      {'Export JSON'}
                    </button>
                  </div>
                </>
              )}
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              {'Add Data'}
            </Button>
          </div>
        </div>

        {/* Data Items List */}
        <div className="space-y-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-text dark:text-white mr-3">
                        {item.name}
                      </h3>
                      <div className="flex items-center">
                        {getSensitivityIcon(item.sensitivity)}
                        <span className={`ml-1 text-sm font-medium ${getSensitivityColor(item.sensitivity)}`}>
                          {item.sensitivity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-text-secondary dark:text-gray-300 mb-3">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setEditingItem(item)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setDataItems(prev => prev.filter(i => i.id !== item.id))}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-text dark:text-white mb-1">
                      Stored by:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.storedBy.map((entity, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text dark:text-white mb-1">
                      Purpose:
                    </p>
                    <p className="text-sm text-text-secondary dark:text-gray-300">
                      {item.purpose}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text dark:text-white mb-1">
                      Retention:
                    </p>
                    <p className="text-sm text-text-secondary dark:text-gray-300">
                      {item.retention}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text dark:text-white mb-1">
                      Shared with:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.sharedWith.map((entity, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 text-xs rounded">
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-text-secondary dark:text-gray-300">
                    Last updated: {item.lastUpdated}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text dark:text-white mb-2">
              {'No data found'}
            </h3>
            <p className="text-text-secondary dark:text-gray-300 mb-4">
              {'Start by adding your personal data to the inventory.'}
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              {'Add Data'}
            </Button>
          </Card>
        )}

        {/* Summary Statistics */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-accent/10 to-blue-500/10 border-accent/20">
          <h3 className="text-xl font-semibold text-text dark:text-white mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2" />
            {'Inventory Summary'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {dataItems.length}
              </div>
              <p className="text-sm text-text-secondary dark:text-gray-300">
                {'Total Items'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {dataItems.filter(item => item.sensitivity === 'high').length}
              </div>
              <p className="text-sm text-text-secondary dark:text-gray-300">
                {'Sensitive Data'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {dataItems.filter(item => item.sensitivity === 'medium').length}
              </div>
              <p className="text-sm text-text-secondary dark:text-gray-300">
                {'Medium Data'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {dataItems.filter(item => item.sensitivity === 'low').length}
              </div>
              <p className="text-sm text-text-secondary dark:text-gray-300">
                {'Low Data'}
              </p>
            </div>
          </div>
        </Card>
      </Section>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-text dark:text-white">
                  {editingItem ? 'Edit Data Item' : 'Add Data Item'}
                </h2>
                <Button
                  onClick={handleCloseForm}
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="data-name" className="block text-sm font-medium text-text dark:text-white mb-1">
                    Name *
                  </label>
                  <input
                    id="data-name"
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="data-description" className="block text-sm font-medium text-text dark:text-white mb-1">
                    Description *
                  </label>
                  <textarea
                    id="data-description"
                    required
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="data-category" className="block text-sm font-medium text-text dark:text-white mb-1">
                      Category *
                    </label>
                    <select
                      id="data-category"
                      required
                      value={formData.category || 'personal_info'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as DataItem['category'] })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text dark:text-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="data-sensitivity" className="block text-sm font-medium text-text dark:text-white mb-1">
                      Sensitivity *
                    </label>
                    <select
                      id="data-sensitivity"
                      required
                      value={formData.sensitivity || 'medium'}
                      onChange={(e) => setFormData({ ...formData, sensitivity: e.target.value as DataItem['sensitivity'] })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="data-stored-by" className="block text-sm font-medium text-text dark:text-white mb-1">
                    Stored By (comma-separated)
                  </label>
                  <input
                    id="data-stored-by"
                    type="text"
                    value={storedByInput}
                    onChange={(e) => setStoredByInput(e.target.value)}
                    placeholder="e.g., Facebook, Google, LinkedIn"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="data-purpose" className="block text-sm font-medium text-text dark:text-white mb-1">
                    Purpose *
                  </label>
                  <input
                    id="data-purpose"
                    type="text"
                    required
                    value={formData.purpose || ''}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="data-retention" className="block text-sm font-medium text-text dark:text-white mb-1">
                    Retention *
                  </label>
                  <input
                    id="data-retention"
                    type="text"
                    required
                    value={formData.retention || ''}
                    onChange={(e) => setFormData({ ...formData, retention: e.target.value })}
                    placeholder="e.g., Indefinite, 7 years, 18 months"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="data-shared-with" className="block text-sm font-medium text-text dark:text-white mb-1">
                    Shared With (comma-separated)
                  </label>
                  <input
                    id="data-shared-with"
                    type="text"
                    value={sharedWithInput}
                    onChange={(e) => setSharedWithInput(e.target.value)}
                    placeholder="e.g., Marketing companies, Data brokers"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleCloseForm}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingItem ? 'Update' : 'Add'} Data
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      )}
    </PageLayout>
  );
};

export default PersonalDataInventory;
