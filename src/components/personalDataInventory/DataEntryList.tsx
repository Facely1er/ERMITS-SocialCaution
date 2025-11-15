import React from 'react';
import { PersonalDataEntry } from '../../types/personalDataInventory';
import { DATA_CATEGORIES } from '../../utils/personalDataInventory/constants';
import { Edit, Trash2, Calendar, Shield, Share2, AlertTriangle } from 'lucide-react';

interface DataEntryListProps {
  entries: PersonalDataEntry[];
  onEdit: (entry: PersonalDataEntry) => void;
  onDelete: (id: string) => void;
}

export const DataEntryList: React.FC<DataEntryListProps> = ({
  entries,
  onEdit,
  onDelete
}) => {
  const getCategoryInfo = (category: string) => {
    return DATA_CATEGORIES.find(cat => cat.value === category) || {
      label: 'Unknown',
      icon: '❓',
      description: ''
    };
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (entries.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Shield className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data entries found</h3>
        <p className="text-gray-500">
          Start by adding your first personal data entry to begin tracking your information.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Purpose
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Flags
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry) => {
            const categoryInfo = getCategoryInfo(entry.category);
            return (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{categoryInfo.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {categoryInfo.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {entry.retentionPeriod}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {entry.dataType}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.legalBasis}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {entry.description}
                  </div>
                  {entry.notes && (
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {entry.notes}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {entry.source}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {entry.purpose}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {entry.isSensitive && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Sensitive
                      </span>
                    )}
                    {entry.isShared && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Share2 className="w-3 h-3 mr-1" />
                        Shared
                      </span>
                    )}
                  </div>
                  {entry.isShared && entry.sharedWith.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500">
                      {entry.sharedWith.join(', ')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(entry.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(entry)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
