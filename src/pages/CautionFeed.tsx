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
  Filter,
  ExternalLink,
  TrendingUp,
  Clock,
  ChevronDown,
  AlertCircle
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cautions...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Privacy Cautions"
      currentPersona={currentPersona}
      showPersonaButton={true}
      variant="default"
    >
      {/* Stats */}
      {stats && (
        <div className={`${designSystem.grid.stats} ${designSystem.spacing.section}`}>
          <div className={`bg-white ${designSystem.borderRadius.card} ${designSystem.spacing.card} ${designSystem.shadow.card}`}>
            <p className={`${designSystem.typography.bodySmall} text-gray-600 mb-1`}>Total Alerts</p>
            <p className={`${designSystem.typography.h2}`}>{stats.totalActive}</p>
          </div>
          <div className={`bg-white ${designSystem.borderRadius.card} ${designSystem.spacing.card} ${designSystem.shadow.card}`}>
            <p className={`${designSystem.typography.bodySmall} text-gray-600 mb-1`}>Last 7 Days</p>
            <p className={`${designSystem.typography.h2} flex items-center ${designSystem.spacing.gap.xs}`}>
              {stats.recentCount}
              <TrendingUp className="h-5 w-5 text-green-600" />
            </p>
          </div>
          <div className={`bg-white ${designSystem.borderRadius.card} ${designSystem.spacing.card} ${designSystem.shadow.card}`}>
            <p className={`${designSystem.typography.bodySmall} text-gray-600 mb-1`}>Critical</p>
            <p className={`${designSystem.typography.h2} text-red-600`}>
              {stats.bySeverity.find(s => s._id === 'critical')?.count || 0}
            </p>
          </div>
          <div className={`bg-white ${designSystem.borderRadius.card} ${designSystem.spacing.card} ${designSystem.shadow.card}`}>
            <p className={`${designSystem.typography.bodySmall} text-gray-600 mb-1`}>High Priority</p>
            <p className={`${designSystem.typography.h2} text-orange-600`}>
              {stats.bySeverity.find(s => s._id === 'high')?.count || 0}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card} ${designSystem.spacing.card} ${designSystem.spacing.section}`}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center ${designSystem.spacing.gap.xs} text-gray-700 font-medium`}
        >
          <Filter className="h-5 w-5" />
          Filters
          <ChevronDown className={`h-4 w-4 ${designSystem.transitions.default} ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {showFilters && (
          <div className={`mt-4 ${designSystem.grid.filters}`}>
            <div>
              <label className={`block ${designSystem.typography.bodySmall} font-medium text-gray-700 mb-1`}>Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className={`w-full border border-gray-300 ${designSystem.borderRadius.input} px-3 py-2`}
              >
                <option value="">All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className={`block ${designSystem.typography.bodySmall} font-medium text-gray-700 mb-1`}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className={`w-full border border-gray-300 ${designSystem.borderRadius.input} px-3 py-2`}
              >
                <option value="">All</option>
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
              <label className={`block ${designSystem.typography.bodySmall} font-medium text-gray-700 mb-1`}>From Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className={`w-full border border-gray-300 ${designSystem.borderRadius.input} px-3 py-2`}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className={`w-full ${designSystem.buttons.outline}`}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Caution Items */}
      <div>
        {cautions.length === 0 ? (
          <div className={`text-center py-12 bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card}`}>
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className={`${designSystem.typography.h4} mb-2`}>No cautions found</h3>
            <p className={designSystem.typography.body}>Try adjusting your filters or check back later for new alerts.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cautions.map((caution, index) => {
              const severityConfig = getSeverityConfig(caution.severity as any);
              return (
                <motion.div
                  key={caution._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card} hover:${designSystem.shadow.cardHover} ${designSystem.transitions.default} ${designSystem.spacing.card}`}
                >
                  <div className={`flex items-start ${designSystem.spacing.gap.md}`}>
                    {/* Severity Badge */}
                    <div className={`flex-shrink-0 w-20 h-20 ${designSystem.borderRadius.card} ${severityConfig.bg} flex items-center justify-center text-3xl`}>
                      {severityConfig.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className={`flex items-center ${designSystem.spacing.gap.xs} mb-1`}>
                            <span className={`px-2 py-1 ${designSystem.borderRadius.badge} ${designSystem.typography.caption} font-medium ${severityConfig.bg} ${severityConfig.text}`}>
                              {severityConfig.label}
                            </span>
                            <span className={`px-2 py-1 ${designSystem.borderRadius.badge} ${designSystem.typography.caption} font-medium bg-gray-100 text-gray-700`}>
                              {caution.category.replace('-', ' ')}
                            </span>
                          </div>
                          <h3 className={`${designSystem.typography.h4} mb-2`}>
                            {caution.title}
                          </h3>
                        </div>
                      </div>

                      <p className={`${designSystem.typography.body} mb-4 line-clamp-3`}>{caution.description}</p>

                      <div className="flex items-center justify-between">
                        <div className={`flex items-center ${designSystem.spacing.gap.md} ${designSystem.typography.bodySmall} text-gray-500`}>
                          <span className={`flex items-center ${designSystem.spacing.gap.xs}`}>
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
                            className={`flex items-center ${designSystem.spacing.gap.xs} text-indigo-600 hover:text-indigo-700 font-medium ${designSystem.transitions.default}`}
                          >
                            Read More
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>

                      {/* Tags */}
                      {caution.tags.length > 0 && (
                        <div className={`mt-3 flex flex-wrap ${designSystem.spacing.gap.xs}`}>
                          {caution.tags.map((tag, i) => (
                            <span key={i} className={`px-2 py-1 bg-gray-100 text-gray-600 ${designSystem.typography.caption} ${designSystem.borderRadius.button}`}>
                              {tag}
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
          <div className={`mt-8 flex items-center justify-center ${designSystem.spacing.gap.xs}`}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 border border-gray-300 ${designSystem.borderRadius.button} disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 ${designSystem.transitions.default}`}
            >
              Previous
            </button>
            <span className={`px-4 py-2 ${designSystem.typography.body}`}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 border border-gray-300 ${designSystem.borderRadius.button} disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 ${designSystem.transitions.default}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
