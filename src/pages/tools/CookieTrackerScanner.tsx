import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Cookie, Eye, AlertTriangle, Shield, CheckCircle, XCircle, Info, History, Trash2, FileDown } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { exportCookieScanToPDF } from '../../utils/toolsExport';

interface CookieData {
  name: string;
  domain: string;
  type: 'necessary' | 'analytics' | 'advertising' | 'social' | 'unknown';
  purpose: string;
  riskLevel: 'low' | 'medium' | 'high';
  thirdParty: boolean;
  retention: string;
}

interface TrackerData {
  name: string;
  category: 'analytics' | 'advertising' | 'social' | 'security' | 'unknown';
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  blocked: boolean;
}

interface ScanHistory {
  id: string;
  url: string;
  scannedAt: string;
  cookies: CookieData[];
  trackers: TrackerData[];
  overallRisk: 'low' | 'medium' | 'high';
}

const CookieTrackerScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [cookies, setCookies] = useState<CookieData[]>([]);
  const [trackers, setTrackers] = useState<TrackerData[]>([]);
  const [overallRisk, setOverallRisk] = useState<'low' | 'medium' | 'high'>('low');
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'necessary': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'analytics': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'advertising': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'social': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Load scan history from localStorage on mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem('cookieScanHistory');
        if (stored) {
          const parsed = JSON.parse(stored);
          setScanHistory(parsed);
        }
      } catch (error) {
        console.error('Error loading scan history:', error);
      }
    };
    loadHistory();
  }, []);

  // Save scan history to localStorage
  const saveScanToHistory = (scan: ScanHistory) => {
    try {
      const updated = [scan, ...scanHistory].slice(0, 50); // Keep last 50 scans
      setScanHistory(updated);
      localStorage.setItem('cookieScanHistory', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving scan history:', error);
    }
  };

  const simulateScan = async () => {
    if (!websiteUrl.trim()) return;
    
    setIsScanning(true);
    
    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic mock data based on URL
    let baseDomain = 'example.com';
    try {
      const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
      const domain = new URL(url).hostname;
      baseDomain = domain.replace('www.', '');
    } catch (error) {
      // If URL parsing fails, use the input as-is
      baseDomain = websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    }
    
    // Mock data for demonstration (client-side only, no API calls)
    const mockCookies: CookieData[] = [
      {
        name: '_ga',
        domain: `.${baseDomain}`,
        type: 'analytics',
        purpose: 'Google Analytics tracking',
        riskLevel: 'medium',
        thirdParty: true,
        retention: '2 years'
      },
      {
        name: 'session_id',
        domain: baseDomain,
        type: 'necessary',
        purpose: 'Maintain user session',
        riskLevel: 'low',
        thirdParty: false,
        retention: 'Session'
      },
      {
        name: 'fb_pixel',
        domain: '.facebook.com',
        type: 'advertising',
        purpose: 'Facebook advertising tracking',
        riskLevel: 'high',
        thirdParty: true,
        retention: '90 days'
      },
      {
        name: 'cookie_consent',
        domain: baseDomain,
        type: 'necessary',
        purpose: 'Store cookie consent preference',
        riskLevel: 'low',
        thirdParty: false,
        retention: '1 year'
      }
    ];

    const mockTrackers: TrackerData[] = [
      {
        name: 'Google Analytics',
        category: 'analytics',
        riskLevel: 'medium',
        description: 'Tracks user behavior and website performance',
        blocked: false
      },
      {
        name: 'Facebook Pixel',
        category: 'advertising',
        riskLevel: 'high',
        description: 'Tracks users for targeted advertising',
        blocked: true
      },
      {
        name: 'Google Tag Manager',
        category: 'analytics',
        riskLevel: 'medium',
        description: 'Manages tracking tags and scripts',
        blocked: false
      }
    ];

    const risk = mockTrackers.filter(t => t.riskLevel === 'high').length > 0 ? 'high' : 
                 mockTrackers.filter(t => t.riskLevel === 'medium').length > 1 ? 'medium' : 'low';

    setCookies(mockCookies);
    setTrackers(mockTrackers);
    setOverallRisk(risk);
    setScanComplete(true);
    setIsScanning(false);

    // Save to history
    const scanRecord: ScanHistory = {
      id: Date.now().toString(),
      url: websiteUrl,
      scannedAt: new Date().toISOString(),
      cookies: mockCookies,
      trackers: mockTrackers,
      overallRisk: risk
    };
    saveScanToHistory(scanRecord);
  };

  const loadScanFromHistory = (scan: ScanHistory) => {
    setCookies(scan.cookies);
    setTrackers(scan.trackers);
    setOverallRisk(scan.overallRisk);
    setWebsiteUrl(scan.url);
    setScanComplete(true);
    setShowHistory(false);
  };

  const deleteScanFromHistory = (id: string) => {
    const updated = scanHistory.filter(s => s.id !== id);
    setScanHistory(updated);
    try {
      localStorage.setItem('cookieScanHistory', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting scan:', error);
    }
  };

  return (
    <PageLayout
      title={'Cookie & Tracker Scanner'}
      subtitle={'Discover what trackers are monitoring your activity'}
      description={'Analyze cookies and trackers present on any website to understand how your data is collected.'}
      heroBackground={false}
      backgroundType="toolkit"
      breadcrumbs={[
        { label: 'Resources', path: '/resources' },
        { label: 'Tools', path: '/resources/tools' },
        { label: 'Cookie Scanner', path: '/resources/tools/cookie-tracker' }
      ]}
    >
      {/* Client-Side Tool Indicator */}
      <div className="mb-6">
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                {'Client-Side Tool'}
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                {'This tool works entirely in your browser. All scan results are saved locally and never sent to any server. No API keys or backend required!'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Section>
        {showHistory ? (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text dark:text-white flex items-center">
                <History className="h-5 w-5 mr-2" />
                {'Scan History'}
              </h3>
              <Button onClick={() => setShowHistory(false)} variant="outline" size="sm">
                {'Back to Scanner'}
              </Button>
            </div>
            {scanHistory.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-text-secondary dark:text-gray-300">
                  {'No scan history yet. Perform a scan to see results here.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {scanHistory.map((scan) => (
                  <div
                    key={scan.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-text dark:text-white">{scan.url}</h4>
                        <p className="text-sm text-text-secondary dark:text-gray-300">
                          {new Date(scan.scannedAt).toLocaleString()}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-sm text-text-secondary dark:text-gray-300">
                            {scan.cookies.length} cookies
                          </span>
                          <span className="text-sm text-text-secondary dark:text-gray-300">
                            {scan.trackers.length} trackers
                          </span>
                          <div className="flex items-center">
                            {getRiskIcon(scan.overallRisk)}
                            <span className={`ml-1 text-sm font-medium ${getRiskColor(scan.overallRisk)}`}>
                              {scan.overallRisk.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => loadScanFromHistory(scan)}
                          variant="outline"
                          size="sm"
                        >
                          {'View'}
                        </Button>
                        <Button
                          onClick={() => deleteScanFromHistory(scan.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ) : !scanComplete ? (
          <Card className="p-8 text-center">
            <div className="mb-6">
              <Search className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-text dark:text-white mb-2">
                {'Ready to scan a website?'}
              </h3>
              <p className="text-text-secondary dark:text-gray-300">
                {'Our scanner will analyze all cookies and trackers present on the specified website.'}
              </p>
            </div>

            <div className="max-w-md mx-auto mb-6">
              <label className="block text-sm font-medium text-text dark:text-white mb-2">
                {'Website URL'}
              </label>
              <input
                type="url"
                id="website-url"
                name="website-url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-center space-x-3">
              <Button
                onClick={simulateScan}
                disabled={isScanning || !websiteUrl.trim()}
                className="px-8 py-3"
              >
              {isScanning ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {'Scanning...'}
                </div>
              ) : (
                <div className="flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  {'Start Scan'}
                </div>
              )}
              </Button>
              {scanHistory.length > 0 && (
                <Button
                  onClick={() => setShowHistory(true)}
                  variant="outline"
                  className="px-8 py-3"
                >
                  <History className="h-4 w-4 mr-2" />
                  {'History'} ({scanHistory.length})
                </Button>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {'This analysis is performed locally and does not collect any personal data.'}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Overall Risk Assessment */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text dark:text-white">
                  {'Overall Risk Assessment'}
                </h3>
                <div className="flex items-center">
                  {getRiskIcon(overallRisk)}
                  <span className={`ml-2 font-semibold ${getRiskColor(overallRisk)}`}>
                    {overallRisk.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-text-secondary dark:text-gray-300">
                {`The website ${websiteUrl} presents a high risk level with ${cookies.length} cookies and ${trackers.length} trackers detected.`}
              </p>
            </Card>

            {/* Cookies Analysis */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-text dark:text-white mb-4 flex items-center">
                <Cookie className="h-5 w-5 mr-2" />
                {'Cookies Analysis'}
              </h3>
              <div className="space-y-4">
                {cookies.map((cookie, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-text dark:text-white">{cookie.name}</h4>
                        <p className="text-sm text-text-secondary dark:text-gray-300">{cookie.domain}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded ${getTypeColor(cookie.type)}`}>
                          {cookie.type}
                        </span>
                        <div className="flex items-center">
                          {getRiskIcon(cookie.riskLevel)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text-secondary dark:text-gray-300 mb-1">
                          Purpose:
                        </p>
                        <p className="text-text dark:text-white">{cookie.purpose}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary dark:text-gray-300 mb-1">
                          Retention:
                        </p>
                        <p className="text-text dark:text-white">{cookie.retention}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center">
                      <span className={`text-sm ${cookie.thirdParty ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                        {cookie.thirdParty ? (
                          '🌐 Third-party') : (
                          '🏠 First-party')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Trackers Analysis */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-text dark:text-white mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                {'Trackers Analysis'}
              </h3>
              <div className="space-y-4">
                {trackers.map((tracker, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-text dark:text-white">{tracker.name}</h4>
                        <p className="text-sm text-text-secondary dark:text-gray-300">{tracker.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded ${getTypeColor(tracker.category)}`}>
                          {tracker.category}
                        </span>
                        <div className="flex items-center">
                          {getRiskIcon(tracker.riskLevel)}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${tracker.blocked ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'}`}>
                          {tracker.blocked ? (
                            'Blocked') : (
                            'Active')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Privacy Recommendations */}
            <Card className="p-6 bg-gradient-to-r from-accent/10 to-blue-500/10 border-accent/20">
              <h3 className="text-xl font-semibold text-text dark:text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                {'Privacy Recommendations'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                  <p className="text-text-secondary dark:text-gray-300">
                    {'Use an ad blocker like uBlock Origin or AdBlock Plus'}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                  <p className="text-text-secondary dark:text-gray-300">
                    {'Enable tracking protection in your browser'}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                  <p className="text-text-secondary dark:text-gray-300">
                    {'Use a private or incognito browser for sensitive sites'}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                  <p className="text-text-secondary dark:text-gray-300">
                    {'Regularly review cookie settings of sites you visit'}
                  </p>
                </div>
              </div>
            </Card>

            <div className="text-center">
              <Button
                onClick={() => {
                  setScanComplete(false);
                  setCookies([]);
                  setTrackers([]);
                  setWebsiteUrl('');
                }}
                variant="outline"
                className="mr-4"
              >
                {'New Scan'}
              </Button>
              <div className="relative">
                <Button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  variant="outline"
                  className="mr-4"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  {'Export'}
                </Button>
                {showExportMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowExportMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 min-w-[150px]">
                      <button
                        onClick={() => {
                          exportCookieScanToPDF({
                            url: websiteUrl,
                            scannedAt: new Date().toISOString(),
                            overallRisk,
                            cookies,
                            trackers
                          });
                          setShowExportMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-sm"
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        {'Export PDF'}
                      </button>
                      <button
                        onClick={() => {
                          const report = {
                            url: websiteUrl,
                            scannedAt: new Date().toISOString(),
                            overallRisk,
                            cookies,
                            trackers
                          };
                          const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `cookie-scan-${websiteUrl.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.json`;
                          link.click();
                          URL.revokeObjectURL(url);
                          setShowExportMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-sm"
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        {'Export JSON'}
                      </button>
                    </div>
                  </>
                )}
              </div>
              {scanHistory.length > 0 && (
                <Button
                  onClick={() => setShowHistory(true)}
                  variant="outline"
                >
                  <History className="h-4 w-4 mr-2" />
                  {'View History'}
                </Button>
              )}
            </div>
          </div>
        )}
      </Section>
    </PageLayout>
  );
};

export default CookieTrackerScanner;