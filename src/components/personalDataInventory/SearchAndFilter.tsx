import React from 'react';
import { DataCategory, DataCategoryInfo } from '../../types/personalDataInventory';
import { Search, Filter, X } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: DataCategory | 'all';
  setSelectedCategory: (category: DataCategory | 'all') => void;
  showSensitiveOnly: boolean;
  setShowSensitiveOnly: (show: boolean) => void;
  showSharedOnly: boolean;
  setShowSharedOnly: (show: boolean) => void;
  categories: DataCategoryInfo[];
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  showSensitiveOnly,
  setShowSensitiveOnly,
  showSharedOnly,
  setShowSharedOnly,
  categories
}) => {
  const hasActiveFilters = selectedCategory !== 'all' || showSensitiveOnly || showSharedOnly;

  const clearFilters = () => {
    setSelectedCategory('all');
    setShowSensitiveOnly(false);
    setShowSharedOnly(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Search & Filter</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search data entries..."
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as DataCategory | 'all')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sensitive Data Filter */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="sensitiveFilter"
            checked={showSensitiveOnly}
            onChange={(e) => setShowSensitiveOnly(e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="sensitiveFilter" className="ml-2 block text-sm text-gray-700">
            Sensitive data only
          </label>
        </div>

        {/* Shared Data Filter */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="sharedFilter"
            checked={showSharedOnly}
            onChange={(e) => setShowSharedOnly(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="sharedFilter" className="ml-2 block text-sm text-gray-700">
            Shared data only
          </label>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              <Filter className="w-3 h-3 mr-1" />
              Category: {categories.find(c => c.value === selectedCategory)?.label}
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="ml-2 text-blue-600 hover:text-blue-800"
                aria-label="Clear category filter"
              >
                ×
              </button>
            </span>
          )}
          {showSensitiveOnly && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
              <Filter className="w-3 h-3 mr-1" />
              Sensitive data only
              <button
                onClick={() => setShowSensitiveOnly(false)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </span>
          )}
          {showSharedOnly && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
              <Filter className="w-3 h-3 mr-1" />
              Shared data only
              <button
                onClick={() => setShowSharedOnly(false)}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
