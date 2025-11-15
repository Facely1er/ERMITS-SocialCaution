import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getCautionItems,
  getCautionStats,
  getCurrentUserPersona,
  type CautionItem,
  type CautionStats
} from '../services/cautionApi';
import {
  AlertTriangle,
  Shield,
  Filter,
  ExternalLink,
  TrendingUp,
  Clock,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

const severityConfig = {
  critical: { color: 'red', icon: '🚨', label: 'Critical' },
  high: { color: 'orange', icon: '⚠️', label: 'High' },
  medium: { color: 'yellow', icon: '⚡', label: 'Medium' },
  low: { color: 'blue', icon: 'ℹ️', label: 'Low' }
};

export default function CautionFeed() {
  const navigate = useNavigate();
  const [cautions, setCautions] = useState<CautionItem[]>([]);
  const [stats, setStats] = useState<CautionStats | null>(null);
  const [currentPersona, setCurrentPersona] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    severity: '',
    startDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    checkPersona();
  }, []);

  useEffect(() => {
    if (currentPersona) {
      loadCautions();
      loadStats();
    }
  }, [currentPersona, page, filters]);

  const checkPersona = async () => {
    try {
      const persona = await getCurrentUserPersona();
      if (!persona) {
        navigate('/persona-selection');
        return;
      }
      setCurrentPersona(persona);
    } catch (err) {
      navigate('/persona-selection');
    }
  };

  const loadCautions = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 20 };
      if (filters.category) params.category = filters.category;
      if (filters.severity) params.severity = filters.severity;
      if (filters.startDate) params.startDate = filters.startDate;

      const result = await getCautionItems(params);
      setCautions(result.data);
      setTotalPages(result.pagination.pages);
    } catch (err: any) {
      console.error('Failed to load cautions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getCautionStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ category: '', severity: '', startDate: '' });
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cautions...</p>
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
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Privacy Cautions</h1>
              </div>
              {currentPersona && (
                <p className="text-indigo-100">
                  Tailored for: <span className="font-semibold">{currentPersona.displayName}</span> {currentPersona.icon}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/persona-selection')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              Change Persona
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-indigo-100 text-sm">Total Alerts</p>
                <p className="text-2xl font-bold">{stats.totalActive}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-indigo-100 text-sm">Last 7 Days</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  {stats.recentCount}
                  <TrendingUp className="h-4 w-4" />
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-indigo-100 text-sm">Critical</p>
                <p className="text-2xl font-bold text-red-200">
                  {stats.bySeverity.find(s => s._id === 'critical')?.count || 0}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-indigo-100 text-sm">High Priority</p>
                <p className="text-2xl font-bold text-orange-200">
                  {stats.bySeverity.find(s => s._id === 'high')?.count || 0}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 font-medium"
          >
            <Filter className="h-5 w-5" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">All</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">All</option>
                  <option value="data-breach">Data Breach</option>
                  <option value="phishing">Phishing</option>
                  <option value="scams">Scams</option>
                  <option value="social-media">Social Media</option>
                  <option value="privacy-laws">Privacy Laws</option>
                  <option value="identity-theft">Identity Theft</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Caution Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {cautions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cautions found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new alerts.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cautions.map((caution, index) => (
              <motion.div
                key={caution._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Severity Badge */}
                  <div className={`flex-shrink-0 w-20 h-20 rounded-lg bg-${severityConfig[caution.severity].color}-100 flex items-center justify-center text-3xl`}>
                    {severityConfig[caution.severity].icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${severityConfig[caution.severity].color}-100 text-${severityConfig[caution.severity].color}-800`}>
                            {severityConfig[caution.severity].label}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {caution.category.replace('-', ' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {caution.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">{caution.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(caution.publishedDate)}
                        </span>
                        <span>Source: {caution.source.name}</span>
                      </div>

                      {caution.link && (
                        <a
                          href={caution.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Read More
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    {/* Tags */}
                    {caution.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {caution.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
