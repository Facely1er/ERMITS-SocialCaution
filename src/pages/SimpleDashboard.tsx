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
  ExternalLink,
  BarChart3
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { designSystem, getSeverityConfig } from '../styles/design-system';

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

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${designSystem.gradients.page}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Privacy Dashboard"
      subtitle={currentPersona ? `Welcome back, ${currentPersona.displayName} ${currentPersona.icon}` : ''}
      currentPersona={currentPersona}
      showPersonaButton={true}
      variant="default"
      actions={
        <button
          onClick={() => navigate('/cautions')}
          className={designSystem.buttons.primary}
        >
          View All Cautions
        </button>
      }
    >
      {/* Stats Grid */}
      {stats && (
        <div className={`${designSystem.grid.stats} ${designSystem.spacing.section}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card} ${designSystem.spacing.card}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-indigo-100 ${designSystem.borderRadius.card}`}>
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <span className={`${designSystem.typography.h2}`}>{stats.totalActive}</span>
            </div>
            <h3 className={`${designSystem.typography.body} font-medium`}>Total Active Alerts</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card} ${designSystem.spacing.card}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-green-100 ${designSystem.borderRadius.card}`}>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className={`${designSystem.typography.h2}`}>{stats.recentCount}</span>
            </div>
            <h3 className={`${designSystem.typography.body} font-medium`}>New (Last 7 Days)</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card} ${designSystem.spacing.card}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-red-100 ${designSystem.borderRadius.card}`}>
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <span className={`${designSystem.typography.h2} text-red-600`}>
                {stats.bySeverity.find(s => s._id === 'critical')?.count || 0}
              </span>
            </div>
            <h3 className={`${designSystem.typography.body} font-medium`}>Critical Alerts</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card} ${designSystem.spacing.card}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-orange-100 ${designSystem.borderRadius.card}`}>
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <span className={`${designSystem.typography.h2} text-orange-600`}>
                {stats.bySeverity.find(s => s._id === 'high')?.count || 0}
              </span>
            </div>
            <h3 className={`${designSystem.typography.body} font-medium`}>High Priority</h3>
          </motion.div>
        </div>
      )}

      {/* Category Breakdown */}
      {stats && stats.byCategory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card} ${designSystem.spacing.card} ${designSystem.spacing.section}`}
        >
          <h2 className={`${designSystem.typography.h2} mb-4`}>Alerts by Category</h2>
          <div className={designSystem.grid.categories}>
            {stats.byCategory.map((cat) => (
              <div key={cat._id} className={`text-center ${designSystem.spacing.card} bg-gray-50 ${designSystem.borderRadius.card}`}>
                <p className={`${designSystem.typography.h2} text-indigo-600`}>{cat.count}</p>
                <p className={`${designSystem.typography.bodySmall} mt-1 capitalize`}>
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
        className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card} ${designSystem.spacing.card}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={designSystem.typography.h2}>Recent Cautions</h2>
          <button
            onClick={() => navigate('/cautions')}
            className={`${designSystem.buttons.ghost} text-sm`}
          >
            View All →
          </button>
        </div>

        <div className="space-y-4">
          {recentCautions.map((caution) => {
            const severityConfig = getSeverityConfig(caution.severity as any);
            return (
              <div
                key={caution._id}
                className={`border border-gray-200 ${designSystem.borderRadius.card} ${designSystem.spacing.card} hover:border-indigo-300 ${designSystem.transitions.default} cursor-pointer`}
                onClick={() => window.open(caution.link, '_blank')}
              >
                <div className={`flex items-start ${designSystem.spacing.gap.sm}`}>
                  <div className={`flex-shrink-0 w-2 h-2 mt-2 ${designSystem.borderRadius.badge} ${severityConfig.dot}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className={`flex items-center ${designSystem.spacing.gap.xs} mb-1`}>
                      <span className={`px-2 py-0.5 ${designSystem.borderRadius.badge} ${designSystem.typography.caption} font-medium ${severityConfig.bg} ${severityConfig.text}`}>
                        {caution.severity}
                      </span>
                      <span className={`${designSystem.typography.caption} text-gray-500`}>{caution.category.replace('-', ' ')}</span>
                    </div>
                    <h3 className={`${designSystem.typography.h4} mb-1`}>{caution.title}</h3>
                    <p className={`${designSystem.typography.bodySmall} line-clamp-2 mb-2`}>{caution.description}</p>
                    <div className={`flex items-center justify-between ${designSystem.typography.caption} text-gray-500`}>
                      <span className={`flex items-center ${designSystem.spacing.gap.xs}`}>
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
            );
          })}
        </div>
      </motion.div>

      {/* Your Privacy Rights */}
      {currentPersona && currentPersona.privacyRights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`${designSystem.gradients.card} ${designSystem.borderRadius.card} ${designSystem.shadow.card} ${designSystem.spacing.card} mt-8`}
        >
          <h2 className={`${designSystem.typography.h2} mb-4`}>
            Your Privacy Rights as {currentPersona.displayName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPersona.privacyRights.slice(0, 4).map((right: any, index: number) => (
              <div key={index} className={`bg-white ${designSystem.borderRadius.card} ${designSystem.spacing.card} border-l-4 border-indigo-500`}>
                <h3 className={`${designSystem.typography.h4} mb-1 flex items-center ${designSystem.spacing.gap.xs}`}>
                  {right.title}
                  {right.actionable && (
                    <span className={`${designSystem.typography.caption} bg-green-100 text-green-700 px-2 py-0.5 ${designSystem.borderRadius.badge}`}>
                      Actionable
                    </span>
                  )}
                </h3>
                <p className={designSystem.typography.bodySmall}>{right.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </PageLayout>
  );
}
