import React, { useState, useEffect } from 'react';
import { PersonalDataEntry, DataCategoryInfo } from '../../types/personalDataInventory';
import { LEGAL_BASIS_OPTIONS, RETENTION_PERIOD_OPTIONS } from '../../utils/personalDataInventory/constants';
import { X, Save } from 'lucide-react';

interface DataEntryFormProps {
  entry?: PersonalDataEntry | null;
  onSave: (entry: Omit<PersonalDataEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  categories: DataCategoryInfo[];
}

export const DataEntryForm: React.FC<DataEntryFormProps> = ({
  entry,
  onSave,
  onClose,
  categories
}) => {
  const [formData, setFormData] = useState({
    category: 'personal_identification' as any,
    dataType: '',
    description: '',
    source: '',
    purpose: '',
    retentionPeriod: '1 year',
    legalBasis: 'Consent',
    isSensitive: false,
    isShared: false,
    sharedWith: [] as string[],
    notes: ''
  });

  const [sharedWithInput, setSharedWithInput] = useState('');

  useEffect(() => {
    if (entry) {
      setFormData({
        category: entry.category,
        dataType: entry.dataType,
        description: entry.description,
        source: entry.source,
        purpose: entry.purpose,
        retentionPeriod: entry.retentionPeriod,
        legalBasis: entry.legalBasis,
        isSensitive: entry.isSensitive,
        isShared: entry.isShared,
        sharedWith: entry.sharedWith,
        notes: entry.notes || ''
      });
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleSharedWithAdd = () => {
    if (sharedWithInput.trim()) {
      setFormData(prev => ({
        ...prev,
        sharedWith: [...prev.sharedWith, sharedWithInput.trim()]
      }));
      setSharedWithInput('');
    }
  };

  const handleSharedWithRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sharedWith: prev.sharedWith.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {entry ? 'Edit Entry' : 'Add New Entry'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Type *
                </label>
                <input
                  type="text"
                  value={formData.dataType}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Email address, Phone number"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Describe the data entry..."
                  required
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source *
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Organization or service name"
                  required
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose *
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Purpose for collecting this data"
                  required
                />
              </div>

              {/* Retention Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retention Period *
                </label>
                <select
                  value={formData.retentionPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, retentionPeriod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {RETENTION_PERIOD_OPTIONS.map(period => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>

              {/* Legal Basis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Basis *
                </label>
                <select
                  value={formData.legalBasis}
                  onChange={(e) => setFormData(prev => ({ ...prev, legalBasis: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {LEGAL_BASIS_OPTIONS.map(basis => (
                    <option key={basis} value={basis}>
                      {basis}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkboxes */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSensitive"
                    checked={formData.isSensitive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isSensitive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isSensitive" className="ml-2 block text-sm text-gray-700">
                    Sensitive Data (Special categories of personal data)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isShared"
                    checked={formData.isShared}
                    onChange={(e) => setFormData(prev => ({ ...prev, isShared: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isShared" className="ml-2 block text-sm text-gray-700">
                    Data is shared with third parties
                  </label>
                </div>
              </div>

              {/* Shared With */}
              {formData.isShared && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shared With
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={sharedWithInput}
                      onChange={(e) => setSharedWithInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Organization name"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSharedWithAdd())}
                    />
                    <button
                      type="button"
                      onClick={handleSharedWithAdd}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  {formData.sharedWith.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.sharedWith.map((org, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {org}
                          <button
                            type="button"
                            onClick={() => handleSharedWithRemove(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Additional notes (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {entry ? 'Update Entry' : 'Add Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
