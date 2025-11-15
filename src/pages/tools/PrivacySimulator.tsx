import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Shield, AlertTriangle, CheckCircle, XCircle, Settings, Globe, Database, Smartphone } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
interface PrivacyScenario {
  id: string;
  title: string;
  description: string;
  category: 'social_media' | 'browsing' | 'mobile' | 'email' | 'shopping';
  riskLevel: 'low' | 'medium' | 'high';
  currentSettings: {
    [key: string]: boolean | string;
  };
  recommendedSettings: {
    [key: string]: boolean | string;
  };
  impact: string;
  instructions: string[];
}

const PrivacySimulator: React.FC = () => {
  const [scenarios, setScenarios] = useState<PrivacyScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<PrivacyScenario | null>(null);
  const [currentSettings, setCurrentSettings] = useState<{[key: string]: boolean | string}>({});
  const [showSimulation, setShowSimulation] = useState(false);

  useEffect(() => {
    // Mock data for demonstration
    const mockScenarios: PrivacyScenario[] = [
      {
        id: 'facebook_privacy',
        title: 'Facebook Privacy Settings',
        description: 'Simulate Facebook privacy setting changes to see their impact on your privacy.',
        category: 'social_media',
        riskLevel: 'high',
        currentSettings: {
          profile_visibility: 'public',
          friend_list_visibility: 'public',
          photo_tagging: true,
          location_sharing: true,
          data_sharing: true,
          ad_targeting: true
        },
        recommendedSettings: {
          profile_visibility: 'friends',
          friend_list_visibility: 'friends',
          photo_tagging: false,
          location_sharing: false,
          data_sharing: false,
          ad_targeting: false
        },
        impact: 'Reduces your personal data exposure by 80%',
        instructions: [
          'Go to Settings > Privacy',
          'Change your profile visibility',
          'Disable location sharing',
          'Limit ad targeting']
      },
      {
        id: 'browser_tracking',
        title: 'Browser Tracking Protection',
        description: 'Configure your browser\'s tracking protection settings.',
        category: 'browsing',
        riskLevel: 'medium',
        currentSettings: {
          tracking_protection: false,
          third_party_cookies: true,
          location_access: true,
          camera_access: true,
          microphone_access: true,
          notifications: true
        },
        recommendedSettings: {
          tracking_protection: true,
          third_party_cookies: false,
          location_access: false,
          camera_access: false,
          microphone_access: false,
          notifications: false
        },
        impact: 'Blocks 90% of trackers and reduces data collection',
        instructions: [
          'Open your browser settings',
          'Enable tracking protection',
          'Block third-party cookies',
          'Limit site permissions']
      },
      {
        id: 'mobile_privacy',
        title: 'Mobile Privacy Settings',
        description: 'Optimize your smartphone\'s privacy settings.',
        category: 'mobile',
        riskLevel: 'high',
        currentSettings: {
          location_services: true,
          analytics: true,
          personalized_ads: true,
          app_tracking: true,
          biometric_data: true,
          cloud_backup: true
        },
        recommendedSettings: {
          location_services: false,
          analytics: false,
          personalized_ads: false,
          app_tracking: false,
          biometric_data: false,
          cloud_backup: false
        },
        impact: 'Improves mobile privacy by 75%',
        instructions: [
          'Open privacy settings',
          'Disable location services',
          'Limit app tracking',
          'Disable personalized ads']
      },
      {
        id: 'email_security',
        title: 'Email Security',
        description: 'Configure your email account\'s security and privacy.',
        category: 'email',
        riskLevel: 'medium',
        currentSettings: {
          two_factor: false,
          encryption: false,
          spam_filter: true,
          read_receipts: true,
          auto_forward: false,
          data_scanning: true
        },
        recommendedSettings: {
          two_factor: true,
          encryption: true,
          spam_filter: true,
          read_receipts: false,
          auto_forward: false,
          data_scanning: false
        },
        impact: 'Strengthens email security by 85%',
        instructions: [
          'Enable two-factor authentication',
          'Enable email encryption',
          'Disable read receipts',
          'Limit data scanning']
      }
    ];

    setScenarios(mockScenarios);
  }, []);

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
    }
  };

  const getRiskIcon = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'high': return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social_media': return <Globe className="h-5 w-5" />;
      case 'browsing': return <Eye className="h-5 w-5" />;
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'email': return <Database className="h-5 w-5" />;
      case 'shopping': return <Settings className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const startSimulation = (scenario: PrivacyScenario) => {
    setSelectedScenario(scenario);
    setCurrentSettings({ ...scenario.currentSettings });
    setShowSimulation(true);
  };

  const updateSetting = (key: string, value: boolean | string) => {
    setCurrentSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const calculatePrivacyScore = () => {
    if (!selectedScenario) return 0;
    
    let score = 0;
    const totalSettings = Object.keys(selectedScenario.recommendedSettings).length;
    
    Object.keys(selectedScenario.recommendedSettings).forEach(key => {
      if (currentSettings[key] === selectedScenario.recommendedSettings[key]) {
        score += 1;
      }
    });
    
    return Math.round((score / totalSettings) * 100);
  };

  return (
    <PageLayout
      title={'Privacy Simulator'}
      subtitle={'Test privacy settings before applying them'}
      description={'Simulate different privacy settings to see their impact on your data protection.'}
      heroBackground={false}
      backgroundType="toolkit"
      breadcrumbs={[
        { label: 'Resources', path: '/resources' },
        { label: 'Tools', path: '/resources/tools' },
        { label: 'Privacy Simulator', path: '/resources/tools/privacy-simulator' }
      ]}
    >
      {/* Educational Simulator Indicator */}
      <div className="mb-6">
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                {'Educational Simulator'}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {'This tool is designed for educational purposes to help you understand the impact of privacy settings. It does not modify your actual settings but shows you potential effects.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Section
        title={'Privacy Scenarios'}
        subtitle={'Choose a scenario to start the simulation'}
      >
        {!showSimulation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getCategoryIcon(scenario.category)}
                      <h3 className="text-lg font-semibold text-text dark:text-white ml-2">
                        {scenario.title}
                      </h3>
                    </div>
                    <div className="flex items-center">
                      {getRiskIcon(scenario.riskLevel)}
                      <span className={`ml-1 text-sm font-medium ${getRiskColor(scenario.riskLevel)}`}>
                        {scenario.riskLevel.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-text-secondary dark:text-gray-300 mb-4 flex-grow">
                    {scenario.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-text dark:text-white mb-2">
                      Expected impact:
                    </p>
                    <p className="text-sm text-text-secondary dark:text-gray-300">
                      {scenario.impact}
                    </p>
                  </div>

                  <Button
                    onClick={() => startSimulation(scenario)}
                    className="w-full"
                  >
                    {'Start Simulation'}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Simulation Header */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-text dark:text-white">
                    {selectedScenario?.title}
                  </h3>
                  <p className="text-text-secondary dark:text-gray-300">
                    {selectedScenario?.description}
                  </p>
                </div>
                <Button
                  onClick={() => setShowSimulation(false)}
                  variant="outline"
                >
                  {'Back'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="text-lg font-semibold text-text dark:text-white">
                    Privacy Score:
                  </span>
                </div>
                <div className="text-2xl font-bold text-accent">
                  {calculatePrivacyScore()}%
                </div>
              </div>
            </Card>

            {/* Settings Simulation */}
            <Card className="p-6">
              <h4 className="text-lg font-semibold text-text dark:text-white mb-4">
                {'Privacy Settings'}
              </h4>
              
              <div className="space-y-4">
                {selectedScenario && Object.entries(selectedScenario.currentSettings).map(([key, _value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium text-text dark:text-white mb-1">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h5>
                      <p className="text-sm text-text-secondary dark:text-gray-300">
                        Recommended: {selectedScenario.recommendedSettings[key] ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-text-secondary dark:text-gray-300">
                        Current:
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id={`privacy-setting-${key}`}
                          name={`privacy-setting-${key}`}
                          checked={currentSettings[key] as boolean}
                          onChange={(e) => updateSetting(key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 dark:peer-focus:ring-accent/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Impact Visualization */}
            <Card className="p-6 bg-gradient-to-r from-accent/10 to-blue-500/10 border-accent/20">
              <h4 className="text-lg font-semibold text-text dark:text-white mb-4">
                {'Privacy Impact'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-text dark:text-white mb-2">
                    {'Before (current settings)'}
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary dark:text-gray-300">
                        Data exposure:
                      </span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-text dark:text-white mb-2">
                    {'After (recommended settings)'}
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary dark:text-gray-300">
                        Data exposure:
                      </span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="p-6">
              <h4 className="text-lg font-semibold text-text dark:text-white mb-4">
                {'Application Instructions'}
              </h4>
              
              <div className="space-y-3">
                {selectedScenario?.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-text-secondary dark:text-gray-300">{instruction}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="text-center">
              <Button
                onClick={() => setShowSimulation(false)}
                variant="outline"
                className="mr-4"
              >
                {'New Simulation'}
              </Button>
              <Button>
                {'Apply Settings'}
              </Button>
            </div>
          </div>
        )}
      </Section>
    </PageLayout>
  );
};

export default PrivacySimulator;