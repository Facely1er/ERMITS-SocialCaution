import React from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  LayoutDashboard,
  Shield,
  BookOpen,
  Target,
  Info,
  Lock,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AssessmentResults } from '../../types/assessment';
// import { questions } from '../../data/assessmentData';

interface ResultsViewProps {
  results: AssessmentResults;
  onReset: () => void;
  onExport: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  onReset,
  onExport: _onExport
}) => {
  const getSafetyLevel = (percentage: number) => {
    if (percentage >= 85) return { label: 'Excellent', color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/20' };
    if (percentage >= 70) return { label: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' };
    if (percentage >= 50) return { label: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' };
    return { label: 'Needs Improvement', color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/20' };
  };

  const safetyLevel = getSafetyLevel(results.percentage);

  const tools = [
    {
      title: "Privacy Dashboard",
      description: "Track your privacy score and monitor your progress over time",
      icon: <LayoutDashboard className="h-6 w-6 text-blue-600" />,
      link: "/dashboard",
      color: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Privacy Toolkit",
      description: "Access essential tools and resources for online privacy protection",
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      link: "/toolkit",
      color: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Privacy Resources",
      description: "Comprehensive guides and educational materials for better privacy practices",
      icon: <BookOpen className="h-6 w-6 text-teal-600" />,
      link: "/resources",
      color: "bg-teal-50 dark:bg-teal-900/20"
    },
    {
      title: "Action Plan",
      description: "Get a personalized roadmap to improve your privacy and security",
      icon: <Target className="h-6 w-6 text-accent" />,
      link: "/dashboard/action-plan",
      color: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Score overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 md:p-10 shadow-lg"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`inline-flex items-center justify-center w-36 h-36 rounded-full ${safetyLevel.bgColor} mb-6 shadow-lg`}
          >
            <span className={`text-5xl font-bold ${safetyLevel.color}`}>
              {results.percentage}%
            </span>
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            {safetyLevel.label}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Your Privacy Assessment Score
          </p>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-center items-center space-x-6 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Score</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {results.score}/{results.maxScore}
                </p>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Level</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                  {results.userLevel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Standards Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8"
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Standards & Regulations Coverage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white">GDPR</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Data minimization principles</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Privacy by design and default</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm text-slate-600 dark:text-slate-400">User consent and rights</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white">NIST</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Risk management approach</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Security controls implementation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Privacy engineering principles</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Lock className="h-6 w-6 text-purple-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white">ISO 27701</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Privacy management systems</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Data protection controls</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Privacy impact assessments</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Additional Regulations</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">CCPA/CPRA (California)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">PIPEDA (Canada)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">LGPD (Brazil)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">PIPL (China)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">PDPA (Singapore)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">APP (Australia)</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action items preview */}
      {results.actionPlan && results.actionPlan.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Actions</h2>
          <Link
            to="/dashboard/action-plan"
            className="text-accent hover:text-accent/90 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {results.actionPlan
            .slice(0, 5)
            .map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start p-5 rounded-lg border-2 ${
                  action.priority === 'high' || (action.criticality && action.criticality >= 4)
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : action.priority === 'medium'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <AlertTriangle className={`h-5 w-5 mt-0.5 mr-4 flex-shrink-0 ${
                  action.priority === 'high' || (action.criticality && action.criticality >= 4)
                    ? 'text-red-600 dark:text-red-400'
                    : action.priority === 'medium'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`} />
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${
                    action.priority === 'high' || (action.criticality && action.criticality >= 4)
                      ? 'text-red-900 dark:text-red-300'
                      : action.priority === 'medium'
                      ? 'text-yellow-900 dark:text-yellow-300'
                      : 'text-blue-900 dark:text-blue-300'
                  }`}>
                    {action.title}
                  </h3>
                  {action.description && (
                    <p className={`text-sm mb-2 ${
                      action.priority === 'high' || (action.criticality && action.criticality >= 4)
                        ? 'text-red-700 dark:text-red-400'
                        : action.priority === 'medium'
                        ? 'text-yellow-700 dark:text-yellow-400'
                        : 'text-blue-700 dark:text-blue-400'
                    }`}>
                      {action.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-xs">
                    <span className={`font-medium ${
                      action.priority === 'high' || (action.criticality && action.criticality >= 4)
                        ? 'text-red-800 dark:text-red-300'
                        : action.priority === 'medium'
                        ? 'text-yellow-800 dark:text-yellow-300'
                        : 'text-blue-800 dark:text-blue-300'
                    }`}>
                      Priority: {action.priority || 'medium'}
                    </span>
                    {action.category && (
                      <span className="text-slate-500 dark:text-slate-400">
                        {action.category}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>
      )}

      {/* Tools Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8"
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Tools You Can Use After Your Checkup
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Explore our suite of privacy tools and resources to help you maintain and improve your online safety
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Link to={tool.link} className="p-6 flex items-start space-x-4">
                <div className={`${tool.color} p-3 rounded-lg`}>
                  {tool.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {tool.title}
                    </h3>
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    {tool.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6"
      >
        <button
          onClick={onReset}
          className="flex items-center px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Retake Assessment
        </button>
        <Link
          to="/dashboard"
          className="flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all shadow-md hover:shadow-lg font-medium"
        >
          <span>View Full Report</span>
          <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </motion.div>
    </div>
  );
};

export default ResultsView;