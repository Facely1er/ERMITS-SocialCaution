import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getCautionStats,
  getCautionItems,
  getCurrentUserPersona,
  type CautionStats,
  type CautionItem
} from '../services/cautionApi';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Clock,
  Settings,
  ExternalLink,
  BarChart3
} from 'lucide-react';

export default function SimpleDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<CautionStats | null>(null);
  const [recentCautions, setRecentCautions] = useState<CautionItem[]>([]);
  const [currentPersona, setCurrentPersona] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [persona, statsData, cautionsData] = await Promise.all([
        getCurrentUserPersona(),
        getCautionStats(),
        getCautionItems({ limit: 5 })
      ]);

      if (!persona) {
        navigate('/persona-selection');
        return;
      }

      setCurrentPersona(persona);
      setStats(statsData);
      setRecentCautions(cautionsData.data);
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
      if (err.response?.status === 400) {
        navigate('/persona-selection');
      }
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'red',
      high: 'orange',
      medium: 'yellow',
      low: 'blue'
    };
    return colors[severity as keyof typeof colors] || 'gray';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Privacy Dashboard</h1>
              {currentPersona && (
                <p className="text-indigo-100">
                  Welcome back, <span className="font-semibold">{currentPersona.displayName}</span> {currentPersona.icon}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/persona-selection')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Change Persona
              </button>
              <button
                onClick={() => navigate('/cautions')}
                className="px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              >
                View All Cautions
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.totalActive}</span>
              </div>
              <h3 className="text-gray-600 font-medium">Total Active Alerts</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.recentCount}</span>
              </div>
              <h3 className="text-gray-600 font-medium">New (Last 7 Days)</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {stats.bySeverity.find(s => s._id === 'critical')?.count || 0}
                </span>
              </div>
              <h3 className="text-gray-600 font-medium">Critical Alerts</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-2xl font-bold text-orange-600">
                  {stats.bySeverity.find(s => s._id === 'high')?.count || 0}
                </span>
              </div>
              <h3 className="text-gray-600 font-medium">High Priority</h3>
            </motion.div>
          </div>
        )}

        {/* Category Breakdown */}
        {stats && stats.byCategory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Alerts by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats.byCategory.map((cat) => (
                <div key={cat._id} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">{cat.count}</p>
                  <p className="text-sm text-gray-600 mt-1 capitalize">
                    {cat._id.replace('-', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Cautions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Cautions</h2>
            <button
              onClick={() => navigate('/cautions')}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {recentCautions.map((caution) => (
              <div
                key={caution._id}
                className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer"
                onClick={() => window.open(caution.link, '_blank')}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-${getSeverityColor(caution.severity)}-500`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${getSeverityColor(caution.severity)}-100 text-${getSeverityColor(caution.severity)}-800`}>
                        {caution.severity}
                      </span>
                      <span className="text-xs text-gray-500">{caution.category.replace('-', ' ')}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{caution.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{caution.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(caution.publishedDate).toLocaleDateString()}
                      </span>
                      <span>{caution.source.name}</span>
                    </div>
                  </div>
                  {caution.link && (
                    <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Your Privacy Rights */}
        {currentPersona && currentPersona.privacyRights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 mt-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Privacy Rights as {currentPersona.displayName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPersona.privacyRights.slice(0, 4).map((right: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    {right.title}
                    {right.actionable && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Actionable
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{right.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
