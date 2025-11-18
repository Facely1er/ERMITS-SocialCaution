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
  BarChart3,
  Database,
  Smartphone,
  DollarSign,
  UserX,
  Globe,
  Lock,
  Mail,
  Scale,
  AlertOctagon,
  Share2,
  Eye,
  FileText,
  CheckCircle
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { designSystem, getSeverityConfig } from '../styles/design-system';

// Category icon mapping
const categoryIcons: Record<string, any> = {
  'data-breach': Database,
  'device-security': Smartphone,
  'financial-fraud': DollarSign,
  'identity-theft': UserX,
  'online-safety': Globe,
  'parental-controls': Lock,
  'phishing': Mail,
  'privacy-laws': Scale,
  'scams': AlertOctagon,
  'social-media': Share2,
};

// Privacy rights icon mapping
const privacyRightIcons = [Shield, Eye, FileText, CheckCircle];

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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading your dashboard...</p>
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
          className={`${designSystem.buttons.primary} transform hover:scale-105`}
        >
          View All Cautions →
        </button>
      }
    >
      {/* Stats Grid */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${designSystem.grid.stats} ${designSystem.spacing.section}`}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <span className="text-4xl font-bold">{stats.totalActive}</span>
            </div>
            <h3 className="text-sm font-semibold text-indigo-100">Total Active Alerts</h3>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <span className="text-4xl font-bold">{stats.recentCount}</span>
            </div>
            <h3 className="text-sm font-semibold text-green-100">New (Last 7 Days)</h3>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <AlertTriangle className="h-7 w-7 text-white" />
              </div>
              <span className="text-4xl font-bold">
                {stats.bySeverity.find(s => s._id === 'critical')?.count || 0}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-red-100">Critical Alerts</h3>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <span className="text-4xl font-bold">
                {stats.bySeverity.find(s => s._id === 'high')?.count || 0}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-orange-100">High Priority</h3>
          </motion.div>
        </motion.div>
      )}

      {/* Category Breakdown */}
      {stats && stats.byCategory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card} ${designSystem.spacing.card} ${designSystem.spacing.section} border border-gray-200`}
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-7 w-7 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Alerts by Category</h2>
          </div>
          <div className={designSystem.grid.categories}>
            {stats.byCategory.map((cat, index) => {
              const IconComponent = categoryIcons[cat._id] || Shield;
              return (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.08, y: -4 }}
                  className="text-center p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-100 cursor-pointer hover:border-indigo-300 hover:shadow-lg transition-all"
                >
                  <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <IconComponent className="h-7 w-7 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-bold text-indigo-600 mb-1">{cat.count}</p>
                  <p className="text-sm font-semibold text-gray-700 capitalize leading-tight">
                    {cat._id.replace(/-/g, ' ')}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recent Cautions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.card} ${designSystem.spacing.card} border border-gray-200`}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Clock className="h-7 w-7 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Cautions</h2>
          </div>
          <button
            onClick={() => navigate('/cautions')}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 hover:gap-2"
          >
            View All
            <span className="text-lg">→</span>
          </button>
        </div>

        <div className="space-y-3">
          {recentCautions.map((caution, index) => {
            const severityConfig = getSeverityConfig(caution.severity as any);
            return (
              <motion.div
                key={caution._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ scale: 1.02 }}
                className={`border-2 border-gray-200 ${designSystem.borderRadius.card} p-4 hover:border-indigo-300 hover:shadow-md ${designSystem.transitions.default} cursor-pointer bg-gradient-to-r from-white to-gray-50/50`}
                onClick={() => window.open(caution.link, '_blank')}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-3 h-3 mt-1.5 rounded-full ${severityConfig.dot} ring-2 ring-white shadow-sm`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-3 py-1 ${designSystem.borderRadius.badge} text-xs font-bold ${severityConfig.bg} ${severityConfig.text} border ${severityConfig.border}`}>
                        {severityConfig.icon} {caution.severity}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full capitalize">
                        {caution.category.replace('-', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{caution.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">{caution.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(caution.publishedDate).toLocaleDateString()}
                      </span>
                      <span className="hidden sm:inline">{caution.source.name}</span>
                    </div>
                  </div>
                  {caution.link && (
                    <ExternalLink className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-1" />
                  )}
                </div>
              </motion.div>
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
          className={`${designSystem.gradients.card} ${designSystem.borderRadius.card} ${designSystem.shadow.large} ${designSystem.spacing.card} mt-8 border border-indigo-100`}
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo-200">
            <Shield className="h-8 w-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Your Privacy Rights as {currentPersona.displayName}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentPersona.privacyRights.slice(0, 4).map((right: any, index: number) => {
              const RightIcon = privacyRightIcons[index % privacyRightIcons.length];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className={`bg-white ${designSystem.borderRadius.card} p-5 border-l-4 border-indigo-500 shadow-md hover:shadow-xl transition-all cursor-pointer`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                      <RightIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-1 flex-wrap">
                        {right.title}
                        {right.actionable && (
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold border border-green-200">
                            ✓ Actionable
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-11">{right.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </PageLayout>
  );
}
