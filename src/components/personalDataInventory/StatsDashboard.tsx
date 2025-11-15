import React from 'react';
import { InventoryStats } from '../../types/personalDataInventory';
import { BarChart3, Shield, Share2, AlertTriangle, TrendingUp } from 'lucide-react';

interface StatsDashboardProps {
  stats: InventoryStats;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Entries',
      value: stats.totalEntries,
      icon: BarChart3,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Sensitive Data',
      value: stats.sensitiveDataCount,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      title: 'Shared Data',
      value: stats.sharedDataCount,
      icon: Share2,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Recent Entries',
      value: stats.recentEntries,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    }
  ];

  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      personal_identification: 'Personal ID',
      contact_information: 'Contact Info',
      financial_data: 'Financial',
      health_data: 'Health',
      biometric_data: 'Biometric',
      location_data: 'Location',
      online_activity: 'Online Activity',
      preferences: 'Preferences',
      communication_data: 'Communication',
      other: 'Other'
    };
    return categoryMap[category] || category;
  };

  const topCategories = Object.entries(stats.categoryBreakdown)
    .filter(([_, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-4`}>
            <div className="flex items-center">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${stat.textColor}`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      {topCategories.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Data by Category</h3>
          <div className="space-y-3">
            {topCategories.map(([category, count]) => {
              const percentage = stats.totalEntries > 0 ? (count / stats.totalEntries) * 100 : 0;
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-24">
                      {getCategoryName(category)}
                    </span>
                    <div className="ml-4 flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 ml-4 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Protection Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Data Protection Insights</h3>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          {stats.sensitiveDataCount > 0 && (
            <p>
              • You have <strong>{stats.sensitiveDataCount}</strong> sensitive data entries that require special protection
            </p>
          )}
          {stats.sharedDataCount > 0 && (
            <p>
              • <strong>{stats.sharedDataCount}</strong> data entries are shared with third parties
            </p>
          )}
          {stats.recentEntries > 0 && (
            <p>
              • <strong>{stats.recentEntries}</strong> new entries added in the last 7 days
            </p>
          )}
          {stats.totalEntries === 0 && (
            <p>
              • Start by adding your first data entry to begin tracking your personal information
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
