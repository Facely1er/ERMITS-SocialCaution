import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCautionItems,
  getCautionStats,
  getCurrentUserPersona,
  type CautionItem,
  type CautionStats
} from '../services/cautionApi';
import {
  Filter,
  ExternalLink,
  TrendingUp,
  Clock,
  ChevronDown,
  AlertCircle,
  Shield,
  BarChart3,
  X,
  Search
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { designSystem, getSeverityConfig } from '../styles/design-system';

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

  const hasActiveFilters = filters.category || filters.severity || filters.startDate;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Validate date
    if (isNaN(date.getTime())) {
      return 'Date unavailable';
    }

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
      <div className={`min-h-screen flex items-center justify-center ${designSystem.gradients.page}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading cautions...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Privacy Cautions"
      subtitle="Stay informed about the latest privacy threats and security alerts"
      currentPersona={currentPersona}
      showPersonaButton={true}
      variant="default"
    >
      {/* Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${designSystem.grid.stats} ${designSystem.spacing.section}`}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br from-white to-indigo-50/30 ${designSystem.borderRadius.card} ${designSystem.spacing.card} ${designSystem.shadow.card} hover:${designSystem.shadow.cardHover} ${designSystem.transitions.default} border border-indigo-100`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalActive}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br from-white to-green-50/30 ${designSystem.borderRadius.card} ${designSystem.spacing.card} ${designSystem.shadow.card} hover:${designSystem.shadow.cardHover} ${designSystem.transitions.default} border border-green-100`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Last 7 Days</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.recentCount}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br from-white to-red-50/30 ${designSystem.borderRadius.card} ${designSystem.spacing.card} ${designSystem.shadow.card} hover:${designSystem.shadow.cardHover} ${designSystem.transitions.default} border border-red-100`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Critical</p>
            </div>
            <p className="text-3xl font-bold text-red-600">
              {stats.bySeverity.find(s => s._id === 'critical')?.count || 0}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br from-white to-orange-50/30 ${designSystem.borderRadius.card} ${designSystem.spacing.card} ${designSystem.shadow.card} hover:${designSystem.shadow.cardHover} ${designSystem.transitions.default} border border-orange-100`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {stats.bySeverity.find(s => s._id === 'high')?.count || 0}
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card} ${designSystem.spacing.card} ${designSystem.spacing.section} border border-gray-200`}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 font-semibold hover:text-indigo-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:outline-none rounded-lg px-3 py-2"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-medium rounded-full">
                Active
              </span>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Clear all
            </button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className={`mt-6 ${designSystem.grid.filters} pt-6 border-t border-gray-200`}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Severity Level
                  </label>
                  <select
                    value={filters.severity}
                    onChange={(e) => handleFilterChange('severity', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors font-medium text-gray-700"
                  >
                    <option value="">All Severities</option>
                    <option value="critical">🚨 Critical</option>
                    <option value="high">⚠️ High</option>
                    <option value="medium">⚡ Medium</option>
                    <option value="low">ℹ️ Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors font-medium text-gray-700 capitalize"
                  >
                    <option value="">All Categories</option>
                    <option value="data-breach">Data Breach</option>
                    <option value="device-security">Device Security</option>
                    <option value="financial-fraud">Financial Fraud</option>
                    <option value="identity-theft">Identity Theft</option>
                    <option value="online-safety">Online Safety</option>
                    <option value="parental-controls">Parental Controls</option>
                    <option value="phishing">Phishing</option>
                    <option value="privacy-laws">Privacy Laws</option>
                    <option value="scams">Scams</option>
                    <option value="social-media">Social Media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors font-medium text-gray-700"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700 hover:border-gray-400"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Caution Items */}
      <div>
        {cautions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-center py-16 bg-gradient-to-br from-white to-gray-50 ${designSystem.borderRadius.card} ${designSystem.shadow.card} border border-gray-200`}
          >
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No cautions found</h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? 'Try adjusting your filters to see more results.'
                  : 'Check back later for new privacy alerts and security threats.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {cautions.map((caution, index) => {
              const severityConfig = getSeverityConfig(caution.severity as any);
              return (
                <motion.div
                  key={caution._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card} hover:shadow-xl ${designSystem.transitions.default} ${designSystem.spacing.card} border-l-4 ${severityConfig.border}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Severity Badge - Reduced from 80x80 to 48x48 */}
                    <div className={`flex-shrink-0 w-12 h-12 ${designSystem.borderRadius.card} ${severityConfig.bg} flex items-center justify-center text-2xl`}>
                      {severityConfig.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-3 py-1 ${designSystem.borderRadius.badge} text-xs font-bold ${severityConfig.bg} ${severityConfig.text} border ${severityConfig.border}`}>
                              {severityConfig.label}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full capitalize">
                              {caution.category.replace('-', ' ')}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                            {caution.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                        {caution.description}
                      </p>

                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="h-4 w-4" />
                            {formatDate(caution.publishedDate)}
                          </span>
                          <span className="hidden sm:inline font-medium">
                            {caution.source.name}
                          </span>
                        </div>

                        {caution.link && (
                          <a
                            href={caution.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors hover:gap-3"
                          >
                            Read Full Article
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>

                      {/* Tags */}
                      {caution.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                          {caution.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 flex items-center justify-center gap-2"
          >
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300 transition-all font-semibold text-gray-700 disabled:hover:bg-white disabled:hover:border-gray-300"
            >
              ← Previous
            </button>
            <div className="flex items-center gap-2 px-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                .map((p, i, arr) => (
                  <div key={p} className="flex items-center gap-2">
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg font-bold transition-all ${
                        page === p
                          ? 'bg-indigo-600 text-white shadow-md scale-110'
                          : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                ))
              }
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300 transition-all font-semibold text-gray-700 disabled:hover:bg-white disabled:hover:border-gray-300"
            >
              Next →
            </button>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
