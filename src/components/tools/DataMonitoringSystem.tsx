import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Settings,
  Database,
  Activity,
  BarChart3
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

interface MonitoringRule {
  id: string;
  brokerId: string;
  brokerName: string;
  searchTerms: string[];
  isActive: boolean;
  lastChecked: string;
  nextCheck: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  alertEmail: string;
  alertPhone?: string;
}

interface MonitoringResult {
  id: string;
  brokerId: string;
  brokerName: string;
  found: boolean;
  confidence: number;
  dataTypes: string[];
  lastSeen: string;
  url: string;
  screenshot?: string;
}

interface MonitoringAlert {
  id: string;
  type: 'data_found' | 'data_removed' | 'check_failed';
  brokerId: string;
  brokerName: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  acknowledged: boolean;
}

const DataMonitoringSystem: React.FC = () => {
  const [monitoringRules, setMonitoringRules] = useState<MonitoringRule[]>([]);
  const [monitoringResults, setMonitoringResults] = useState<MonitoringResult[]>([]);
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newRule, setNewRule] = useState<Partial<MonitoringRule>>({
    frequency: 'weekly',
    isActive: true
  });

  useEffect(() => {
    loadMonitoringData();
  }, []);

  const loadMonitoringData = () => {
    // Load from localStorage (in real app, this would be from backend)
    const savedRules = localStorage.getItem('monitoringRules');
    const savedResults = localStorage.getItem('monitoringResults');
    const savedAlerts = localStorage.getItem('monitoringAlerts');

    if (savedRules) {
      setMonitoringRules(JSON.parse(savedRules));
    }
    if (savedResults) {
      setMonitoringResults(JSON.parse(savedResults));
    }
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  };

  const saveMonitoringData = () => {
    localStorage.setItem('monitoringRules', JSON.stringify(monitoringRules));
    localStorage.setItem('monitoringResults', JSON.stringify(monitoringResults));
    localStorage.setItem('monitoringAlerts', JSON.stringify(alerts));
  };

  const addMonitoringRule = () => {
    if (!newRule.brokerId || !newRule.searchTerms?.length) return;

    const rule: MonitoringRule = {
      id: `rule-${Date.now()}`,
      brokerId: newRule.brokerId,
      brokerName: newRule.brokerName || '',
      searchTerms: newRule.searchTerms || [],
      isActive: newRule.isActive || true,
      lastChecked: new Date().toISOString(),
      nextCheck: calculateNextCheck(newRule.frequency || 'weekly'),
      frequency: newRule.frequency || 'weekly',
      alertEmail: newRule.alertEmail || '',
      alertPhone: newRule.alertPhone
    };

    setMonitoringRules(prev => [...prev, rule]);
    setNewRule({
      frequency: 'weekly',
      isActive: true
    });
    setShowSettings(false);
    saveMonitoringData();
  };

  const calculateNextCheck = (frequency: string) => {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const runMonitoringCheck = async () => {
    setIsMonitoring(true);
    
    // Simulate monitoring check (in real implementation, this would use web scraping)
    setTimeout(() => {
      const newResults: MonitoringResult[] = monitoringRules.map(rule => ({
        id: `result-${Date.now()}-${rule.id}`,
        brokerId: rule.brokerId,
        brokerName: rule.brokerName,
        found: Math.random() > 0.7, // 30% chance of finding data
        confidence: Math.random() * 100,
        dataTypes: ['Name', 'Email', 'Phone'].slice(0, Math.floor(Math.random() * 3) + 1),
        lastSeen: new Date().toISOString(),
        url: `https://${rule.brokerId}.com/search`
      }));

      setMonitoringResults(prev => [...prev, ...newResults]);

      // Generate alerts for new findings
      newResults.forEach(result => {
        if (result.found) {
          const alert: MonitoringAlert = {
            id: `alert-${Date.now()}-${result.id}`,
            type: 'data_found',
            brokerId: result.brokerId,
            brokerName: result.brokerName,
            message: `Data found on ${result.brokerName} with ${result.confidence.toFixed(0)}% confidence`,
            timestamp: new Date().toISOString(),
            severity: result.confidence > 80 ? 'high' : result.confidence > 50 ? 'medium' : 'low',
            acknowledged: false
          };
          setAlerts(prev => [...prev, alert]);
        }
      });

      setIsMonitoring(false);
      saveMonitoringData();
    }, 3000);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    saveMonitoringData();
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'data_found':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'data_removed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'check_failed':
        return <XCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  // Severity color function (currently unused but kept for future features)
  // const getSeverityColor = (severity: string) => {
  //   switch (severity) {
  //     case 'high':
  //       return 'text-red-600 dark:text-red-400';
  //     case 'medium':
  //       return 'text-yellow-600 dark:text-yellow-400';
  //     case 'low':
  //       return 'text-blue-600 dark:text-blue-400';
  //     default:
  //       return 'text-gray-600 dark:text-gray-400';
  //   }
  // };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text dark:text-white flex items-center">
            <Eye className="h-6 w-6 mr-2" />
            Data Monitoring System
          </h2>
          <p className="text-text-secondary dark:text-gray-300">
            Monitor for data reappearance across broker sites
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            className="flex items-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            onClick={runMonitoringCheck}
            disabled={isMonitoring || monitoringRules.length === 0}
            className="flex items-center"
          >
            {isMonitoring ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Activity className="h-4 w-4 mr-2" />
            )}
            {isMonitoring ? 'Checking...' : 'Run Check'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {monitoringRules.length}
          </div>
          <p className="text-sm text-text-secondary dark:text-gray-300">Active Rules</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {alerts.filter(a => !a.acknowledged).length}
          </div>
          <p className="text-sm text-text-secondary dark:text-gray-300">Unread Alerts</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {monitoringResults.filter(r => r.found).length}
          </div>
          <p className="text-sm text-text-secondary dark:text-gray-300">Data Found</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {monitoringResults.filter(r => !r.found).length}
          </div>
          <p className="text-sm text-text-secondary dark:text-gray-300">Clean Results</p>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text dark:text-white mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getSeverityBgColor(alert.severity)} ${
                  alert.acknowledged ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <p className="font-medium text-text dark:text-white">
                        {alert.message}
                      </p>
                      <p className="text-sm text-text-secondary dark:text-gray-300">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      onClick={() => acknowledgeAlert(alert.id)}
                      size="sm"
                      variant="outline"
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Monitoring Rules */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text dark:text-white mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Monitoring Rules
        </h3>
        {monitoringRules.length === 0 ? (
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-text-secondary dark:text-gray-300 mb-4">
              No monitoring rules configured. Set up rules to monitor for data reappearance.
            </p>
            <Button onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Configure Monitoring
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {monitoringRules.map((rule) => (
              <div key={rule.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text dark:text-white">{rule.brokerName}</h4>
                    <p className="text-sm text-text-secondary dark:text-gray-300">
                      Search terms: {rule.searchTerms.join(', ')}
                    </p>
                    <p className="text-sm text-text-secondary dark:text-gray-300">
                      Frequency: {rule.frequency} • Next check: {new Date(rule.nextCheck).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Results */}
      {monitoringResults.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text dark:text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Recent Results
          </h3>
          <div className="space-y-3">
            {monitoringResults.slice(0, 10).map((result) => (
              <div key={result.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text dark:text-white">{result.brokerName}</h4>
                    <p className="text-sm text-text-secondary dark:text-gray-300">
                      {result.found ? 'Data found' : 'No data found'} • 
                      Confidence: {result.confidence.toFixed(0)}% • 
                      {new Date(result.lastSeen).toLocaleString()}
                    </p>
                    {result.found && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.dataTypes.map((type, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {result.found ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text dark:text-white">
                  Configure Monitoring Rule
                </h3>
                <Button onClick={() => setShowSettings(false)} variant="outline" size="sm">
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text dark:text-white mb-2">
                    Broker Name
                  </label>
                  <input
                    type="text"
                    value={newRule.brokerName || ''}
                    onChange={(e) => setNewRule(prev => ({ ...prev, brokerName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter broker name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-white mb-2">
                    Search Terms (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newRule.searchTerms?.join(', ') || ''}
                    onChange={(e) => setNewRule(prev => ({ 
                      ...prev, 
                      searchTerms: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                    placeholder="name, email, phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-white mb-2">
                    Check Frequency
                  </label>
                  <select
                    value={newRule.frequency || 'weekly'}
                    onChange={(e) => setNewRule(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-white mb-2">
                    Alert Email
                  </label>
                  <input
                    type="email"
                    value={newRule.alertEmail || ''}
                    onChange={(e) => setNewRule(prev => ({ ...prev, alertEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newRule.isActive || false}
                    onChange={(e) => setNewRule(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm text-text dark:text-white">
                    Enable monitoring for this rule
                  </label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button onClick={() => setShowSettings(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={addMonitoringRule}>
                    Add Rule
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DataMonitoringSystem;