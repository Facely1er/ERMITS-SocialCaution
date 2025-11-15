import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Eye, Globe, Moon, Sun, Smartphone, Laptop } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';


const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [devicePreference, setDevicePreference] = useState<'mobile' | 'desktop'>(() => {
    const stored = localStorage.getItem('device-preference');
    return (stored as 'mobile' | 'desktop') || 'desktop';
  });

  useEffect(() => {
    localStorage.setItem('device-preference', devicePreference);
  }, [devicePreference]);

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your privacy preferences and account settings"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Settings', path: '/dashboard/settings' }
      ]}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Privacy Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-accent mr-3" />
                    <div>
                      <label htmlFor="automatic-privacy-scans" className="font-medium">Automatic Privacy Scans</label>
                      <p className="text-sm text-gray-600">Regularly check for privacy vulnerabilities</p>
                    </div>
                  </div>
                  <label htmlFor="automatic-privacy-scans" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="automatic-privacy-scans" name="automatic-privacy-scans" className="sr-only peer" defaultChecked aria-label="Automatic Privacy Scans" title="Automatic Privacy Scans" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-accent mr-3" />
                    <div>
                      <label htmlFor="privacy-alerts" className="font-medium">Privacy Alerts</label>
                      <p className="text-sm text-gray-600">Get notified about privacy threats</p>
                    </div>
                  </div>
                  <label htmlFor="privacy-alerts" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="privacy-alerts" name="privacy-alerts" className="sr-only peer" defaultChecked aria-label="Privacy Alerts" title="Privacy Alerts" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-accent mr-3" />
                    <div>
                      <label htmlFor="data-collection" className="font-medium">Data Collection</label>
                      <p className="text-sm text-gray-600">Allow anonymous usage data collection</p>
                    </div>
                  </div>
                  <label htmlFor="data-collection" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="data-collection" name="data-collection" className="sr-only peer" aria-label="Data Collection" title="Data Collection" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-accent mr-3" />
                    <div>
                      <label htmlFor="regional-settings" className="font-medium">Regional Settings</label>
                      <p className="text-sm text-gray-600">Customize for your location</p>
                    </div>
                  </div>
                  <select id="regional-settings" name="regional-settings" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block p-2.5" aria-label="Regional Settings" title="Regional Settings">
                    <option value="US">United States</option>
                    <option value="EU">European Union</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-6">Assessment Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="assessment-frequency" className="font-medium">Assessment Frequency</label>
                    <p className="text-sm text-gray-600">How often to run privacy assessments</p>
                  </div>
                  <select id="assessment-frequency" name="assessment-frequency" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block p-2.5" aria-label="Assessment Frequency" title="Assessment Frequency">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="report-detail-level" className="font-medium">Report Detail Level</label>
                    <p className="text-sm text-gray-600">Customize assessment report depth</p>
                  </div>
                  <select id="report-detail-level" name="report-detail-level" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block p-2.5" aria-label="Report Detail Level" title="Report Detail Level">
                    <option value="basic">Basic</option>
                    <option value="detailed">Detailed</option>
                    <option value="comprehensive">Comprehensive</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="privacy-score-visibility" className="font-medium">Privacy Score Visibility</label>
                    <p className="text-sm text-gray-600">Who can see your privacy score</p>
                  </div>
                  <select id="privacy-score-visibility" name="privacy-score-visibility" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent focus:border-accent block p-2.5" aria-label="Privacy Score Visibility" title="Privacy Score Visibility">
                    <option value="private">Only Me</option>
                    <option value="friends">Friends</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Appearance</h3>
              <div className="space-y-6">
                <div>
                  <p className="font-medium mb-3">Theme</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${
                        theme === 'light' 
                          ? 'border-accent bg-accent/10' 
                          : 'border-gray-200 hover:border-accent'
                      }`}
                      onClick={() => setTheme('light')}
                      aria-label="Switch to light theme"
                    >
                      <Sun className="h-6 w-6 mb-2" />
                      <span className="text-sm">Light</span>
                    </button>
                    <button 
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${
                        theme === 'dark' 
                          ? 'border-accent bg-accent/10' 
                          : 'border-gray-200 hover:border-accent'
                      }`}
                      onClick={() => setTheme('dark')}
                      aria-label="Switch to dark theme"
                    >
                      <Moon className="h-6 w-6 mb-2" />
                      <span className="text-sm">Dark</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium mb-3">Device Preference</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${
                        devicePreference === 'mobile' 
                          ? 'border-accent bg-accent/10' 
                          : 'border-gray-200 hover:border-accent'
                      }`}
                      onClick={() => setDevicePreference('mobile')}
                      aria-label="Set mobile device preference"
                    >
                      <Smartphone className="h-6 w-6 mb-2" />
                      <span className="text-sm">Mobile</span>
                    </button>
                    <button 
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${
                        devicePreference === 'desktop' 
                          ? 'border-accent bg-accent/10' 
                          : 'border-gray-200 hover:border-accent'
                      }`}
                      onClick={() => setDevicePreference('desktop')}
                      aria-label="Set desktop device preference"
                    >
                      <Laptop className="h-6 w-6 mb-2" />
                      <span className="text-sm">Desktop</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-6">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="email-notifications" className="text-sm">Email Notifications</label>
                  <label htmlFor="email-notifications" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="email-notifications" name="email-notifications" className="sr-only peer" defaultChecked aria-label="Email Notifications" title="Email Notifications" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="browser-notifications" className="text-sm">Browser Notifications</label>
                  <label htmlFor="browser-notifications" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="browser-notifications" name="browser-notifications" className="sr-only peer" defaultChecked aria-label="Browser Notifications" title="Browser Notifications" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="privacy-alerts-notifications" className="text-sm">Privacy Alerts</label>
                  <label htmlFor="privacy-alerts-notifications" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="privacy-alerts-notifications" name="privacy-alerts-notifications" className="sr-only peer" defaultChecked aria-label="Privacy Alerts" title="Privacy Alerts" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="marketing-communications" className="text-sm">Marketing Communications</label>
                  <label htmlFor="marketing-communications" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="marketing-communications" name="marketing-communications" className="sr-only peer" aria-label="Marketing Communications" title="Marketing Communications" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        </div>
        </Section>
      </motion.div>
    </DashboardLayout>
  );
};

export default SettingsPage;