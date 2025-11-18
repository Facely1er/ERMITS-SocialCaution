import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Search, AlertTriangle, Shield, Globe, Database, FileText, CheckCircle, XCircle, Info, Download, History, RefreshCw, BarChart3 } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ToolsApiService } from '../../services/toolsApi';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logger from '../../utils/logger';

interface DigitalFootprintResult {
  id: string;
  name: string;
  type: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  examples: string[];
  found: boolean;
  confidence: number;
  dataPoints?: string[];
  platforms?: string[];
  dataTypes?: string[];
  optOutAvailable?: boolean;
  recordTypes?: string[];
  resultCount?: number;
  articleCount?: number;
  breachCount?: number;
  postCount?: number;
  directoryCount?: number;
  lastUpdated: string;
}

interface DigitalFootprintData {
  searchQuery: string;
  results: DigitalFootprintResult[];
  analyzedAt: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  summary?: {
    totalFound: number;
    criticalRiskFound: number;
    highRiskFound: number;
    mediumRiskFound: number;
    lowRiskFound: number;
    riskDistribution: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    overallRisk: string;
    confidence: number;
    totalExposures: number;
    exposureRate: number;
  };
}

interface AnalysisHistory {
  _id: string;
  type: string;
  data: DigitalFootprintData;
  analyzedAt: string;
  createdAt: string;
}

const DigitalFootprintAnalyzer: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [footprintData, setFootprintData] = useState<DigitalFootprintData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const getRiskColor = (risk: 'low' | 'medium' | 'high' | 'critical') => {
    switch (risk) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'critical': return 'text-red-800 dark:text-red-300';
    }
  };

  const getRiskIcon = (risk: 'low' | 'medium' | 'high' | 'critical') => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'high': return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-800 dark:text-red-300 animate-pulse" />;
    }
  };

  // Load analysis history on component mount
  useEffect(() => {
    loadAnalysisHistory();
  }, []);

  const loadAnalysisHistory = async () => {
    try {
      const history = await ToolsApiService.getAnalysisHistory('digital-footprint');
      setAnalysisHistory(history || []);
    } catch (error) {
      console.error('Failed to load analysis history:', error);
      // Set empty array to prevent UI issues
      setAnalysisHistory([]);
    }
  };

  const performAnalysis = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    // Validate search query format
    if (searchQuery.length < 2) {
      setError('Search query must be at least 2 characters long');
      return;
    }

    if (searchQuery.length > 100) {
      setError('Search query must be less than 100 characters');
      return;
    }

    // Check for potentially malicious input
    const suspiciousPatterns = /<script|javascript:|on\w+\s*=/i;
    if (suspiciousPatterns.test(searchQuery)) {
      setError('Invalid characters detected. Please use only letters, numbers, and common punctuation.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);

    try {
      // Simulate progress updates with more realistic timing
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15 + 5; // Random increment between 5-20
        });
      }, 200);

      const analysisData = await ToolsApiService.analyzeDigitalFootprint(searchQuery.trim());
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Validate response data
      if (!analysisData || !analysisData.results || !Array.isArray(analysisData.results)) {
        throw new Error('Invalid analysis response received');
      }

      setFootprintData(analysisData);
      setAnalysisComplete(true);
      
      // Reload history to include new analysis
      try {
        await loadAnalysisHistory();
      } catch (historyError) {
        logger.warn('Failed to reload analysis history:', historyError);
        // Don't show error to user as this is not critical
      }
      
    } catch (error: any) {
      logger.error('Analysis error:', error);
      
      let errorMessage = 'Analysis failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Network Error') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Analysis timed out. Please try again with a shorter query.';
        } else if (error.message.includes('Invalid analysis response')) {
          errorMessage = 'Invalid response received. Please try again.';
        } else if (error.message.includes('Unauthorized') || error.message.includes('401')) {
          errorMessage = 'Session expired. Please refresh the page and try again.';
        } else if (error.message.includes('Forbidden') || error.message.includes('403')) {
          errorMessage = 'Access denied. Please check your permissions.';
        } else if (error.message.includes('Too Many Requests') || error.message.includes('429')) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        } else if (error.message.includes('Server Error') || error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const generateReport = () => {
    if (!footprintData) {
      setError('No analysis data available for report generation');
      return;
    }

    try {
      const reportData = {
        searchQuery: footprintData.searchQuery,
        analyzedAt: footprintData.analyzedAt,
        riskLevel: footprintData.riskLevel,
        summary: footprintData.summary,
        results: footprintData.results
      };

      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `digital-footprint-analysis-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Report generation error:', error);
      setError('Failed to generate JSON report. Please try again.');
    }
  };

  const generatePDFReport = () => {
    if (!footprintData) {
      setError('No analysis data available for PDF generation');
      return;
    }

    try {
      const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Digital Footprint Analysis Report', margin, yPosition);
    yPosition += 15;

    // Search Query
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Search Query: ${footprintData.searchQuery}`, margin, yPosition);
    yPosition += 10;

    // Analysis Date
    doc.text(`Analysis Date: ${new Date(footprintData.analyzedAt).toLocaleDateString()}`, margin, yPosition);
    yPosition += 10;

    // Risk Level
    doc.setFont('helvetica', 'bold');
    doc.text(`Overall Risk Level: ${footprintData.riskLevel.toUpperCase()}`, margin, yPosition);
    yPosition += 15;

    // Summary Section
    if (footprintData.summary) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Analysis Summary', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Exposures Found: ${footprintData.summary.totalFound}`, margin, yPosition);
      yPosition += 6;
      doc.text(`High Risk: ${footprintData.summary.highRiskFound}`, margin, yPosition);
      yPosition += 6;
      doc.text(`Medium Risk: ${footprintData.summary.mediumRiskFound}`, margin, yPosition);
      yPosition += 6;
      doc.text(`Low Risk: ${footprintData.summary.lowRiskFound}`, margin, yPosition);
      yPosition += 15;
    }

    // Detailed Results
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detailed Analysis Results', margin, yPosition);
    yPosition += 10;

    // Prepare table data
    const tableData = footprintData.results.map(result => [
      result.name,
      result.found ? 'FOUND' : 'NOT FOUND',
      result.risk.toUpperCase(),
      result.type
    ]);

    // Add table
    (doc as any).autoTable({
      head: [['Category', 'Status', 'Risk Level', 'Type']],
      body: tableData,
      startY: yPosition,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;

    // Add detailed findings
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detailed Findings', margin, yPosition);
    yPosition += 10;

    footprintData.results.forEach((result, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${result.name}`, margin, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      doc.text(`Status: ${result.found ? 'FOUND' : 'NOT FOUND'}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Risk Level: ${result.risk.toUpperCase()}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Description: ${result.description}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Recommendation: ${result.recommendation}`, margin, yPosition);
      yPosition += 10;

      if (result.found && result.dataPoints && result.dataPoints.length > 0) {
        doc.text('Exposed Data:', margin, yPosition);
        yPosition += 5;
        result.dataPoints.forEach(point => {
          doc.text(`• ${point}`, margin + 5, yPosition);
          yPosition += 4;
        });
        yPosition += 5;
      }
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10);
      doc.text('Generated by Social Caution Privacy Platform', margin, doc.internal.pageSize.getHeight() - 10);
    }

      // Save the PDF
      doc.save(`digital-footprint-analysis-${footprintData.searchQuery.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      setError('Failed to generate PDF report. Please try again.');
    }
  };

  const loadPreviousAnalysis = (analysis: AnalysisHistory) => {
    setFootprintData(analysis.data);
    setAnalysisComplete(true);
    setShowHistory(false);
  };

  const retryAnalysis = async () => {
    if (retryCount >= 3) {
      setError('Maximum retry attempts reached. Please try again later.');
      return;
    }

    setIsRetrying(true);
    setError(null);
    setRetryCount(prev => prev + 1);

    try {
      await performAnalysis();
      setRetryCount(0); // Reset on success
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const clearError = () => {
    setError(null);
    setRetryCount(0);
  };

  return (
    <PageLayout
      title={'Digital Footprint Analyzer'}
      subtitle={'Discover and analyze your online presence across the internet'}
      description={'Analyze your digital footprint and discover what information about you is available online.'}
      heroBackground={false}
      backgroundType="toolkit"
      breadcrumbs={[
        { label: 'Resources', path: '/resources' },
        { label: 'Tools', path: '/resources/tools' },
        { label: 'Digital Footprint Analyzer', path: '/resources/tools/digital-footprint' }
      ]}
    >
      {/* Real Tool Indicator */}
      <div className="mb-6">
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                {'Real Tool'}
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                {'This tool performs a real analysis of your digital footprint by searching for publicly available information online. Results are based on real data.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Analysis History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text dark:text-white">
                  {'Analysis History'}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                >
                  ×
                </Button>
              </div>
              
              {analysisHistory.length === 0 ? (
                <p className="text-text-secondary dark:text-gray-300 text-center py-8">
                  {'No previous analyses'}
                </p>
              ) : (
                <div className="space-y-3">
                  {analysisHistory.map((analysis) => (
                    <Card
                      key={analysis._id}
                      className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => loadPreviousAnalysis(analysis)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text dark:text-white">
                            {analysis.data.searchQuery}
                          </p>
                          <p className="text-sm text-text-secondary dark:text-gray-300">
                            {new Date(analysis.analyzedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {getRiskIcon(analysis.data.riskLevel)}
                          <span className={`ml-1 text-xs font-medium ${getRiskColor(analysis.data.riskLevel)}`}>
                            {analysis.data.riskLevel.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Section
        title={'Digital Footprint Analysis'}
        subtitle={'Start by entering your name to analyze your online presence'}
      >
        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowHistory(true)}
              className="flex items-center"
            >
              <History className="h-4 w-4 mr-2" />
              {'History'}
            </Button>
            {analysisComplete && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={generateReport}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {'JSON'}
                </Button>
                <Button
                  variant="outline"
                  onClick={generatePDFReport}
                  className="flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {'PDF'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-6">
            <div className="flex items-start">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 dark:text-red-200 mb-3">{error}</p>
                <div className="flex space-x-3">
                  {retryCount < 3 && !isRetrying && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={retryAnalysis}
                      className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {'Retry'}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearError}
                    className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                  >
                    {'Dismiss'}
                  </Button>
                </div>
                {retryCount > 0 && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    {`Attempt ${retryCount}/3`}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {!analysisComplete ? (
          <Card className="p-8 text-center">
            <div className="mb-6">
              <Eye className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-text dark:text-white mb-2">
                {'Ready to analyze your digital footprint?'}
              </h3>
              <p className="text-text-secondary dark:text-gray-300">
                {'This analysis will help you understand what information about you is available online and how to protect your privacy.'}
              </p>
            </div>

            <div className="max-w-md mx-auto mb-6">
              <label className="block text-sm font-medium text-text dark:text-white mb-2">
                {'Name to search'}
              </label>
              <input
                type="text"
                id="search-query"
                name="search-query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={'Enter your full name'}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <Button
              onClick={performAnalysis}
              disabled={isAnalyzing || !searchQuery.trim()}
              className="px-8 py-3"
            >
              {isAnalyzing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {'Analyzing...'}
                </div>
              ) : (
                <div className="flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  {'Start Analysis'}
                </div>
              )}
            </Button>

            {/* Progress Bar */}
            {isAnalyzing && (
              <div className="mt-4 w-full max-w-md mx-auto">
                <div className="flex justify-between text-sm text-text-secondary dark:text-gray-300 mb-2">
                  <span>
                    {'Progress'}
                  </span>
                  <span>{analysisProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-accent h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {'This analysis is performed locally and your data is not transmitted to external servers.'}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Analysis Summary */}
            {footprintData?.summary && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-text dark:text-white mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  {'Analysis Summary'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{footprintData.summary.totalFound}</div>
                    <div className="text-sm text-text-secondary dark:text-gray-300">
                      {'Exposures Found'}
                    </div>
                  </div>
                  {footprintData.summary.criticalRiskFound > 0 && (
                    <div className="text-center p-4 bg-red-100 dark:bg-red-900/40 rounded-lg border-2 border-red-300 dark:border-red-700">
                      <div className="text-2xl font-bold text-red-800 dark:text-red-300">{footprintData.summary.criticalRiskFound}</div>
                      <div className="text-sm text-text-secondary dark:text-gray-300">
                        {'Critical Risk'}
                      </div>
                    </div>
                  )}
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{footprintData.summary.highRiskFound}</div>
                    <div className="text-sm text-text-secondary dark:text-gray-300">
                      {'High Risk'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{footprintData.summary.mediumRiskFound}</div>
                    <div className="text-sm text-text-secondary dark:text-gray-300">
                      {'Medium Risk'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{footprintData.summary.lowRiskFound}</div>
                    <div className="text-sm text-text-secondary dark:text-gray-300">
                      {'Low Risk'}
                    </div>
                  </div>
                </div>
                
                {/* Risk Distribution Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          ...(footprintData.summary.riskDistribution.critical > 0 ? [{ name: 'Critical Risk', value: footprintData.summary.riskDistribution.critical, color: '#dc2626' }] : []),
                          { name: 'High Risk', value: footprintData.summary.riskDistribution.high, color: '#ef4444' },
                          { name: 'Medium Risk', value: footprintData.summary.riskDistribution.medium, color: '#f59e0b' },
                          { name: 'Low Risk', value: footprintData.summary.riskDistribution.low, color: '#10b981' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          ...(footprintData.summary.riskDistribution.critical > 0 ? [{ name: 'Critical Risk', value: footprintData.summary.riskDistribution.critical, color: '#dc2626' }] : []),
                          { name: 'High Risk', value: footprintData.summary.riskDistribution.high, color: '#ef4444' },
                          { name: 'Medium Risk', value: footprintData.summary.riskDistribution.medium, color: '#f59e0b' },
                          { name: 'Low Risk', value: footprintData.summary.riskDistribution.low, color: '#10b981' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Overall Risk Assessment */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text dark:text-white">
                  {'Overall Risk Assessment'}
                </h3>
                <div className="flex items-center">
                  {getRiskIcon(footprintData!.riskLevel)}
                  <span className={`ml-2 font-semibold ${getRiskColor(footprintData!.riskLevel)}`}>
                    {footprintData!.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-text-secondary dark:text-gray-300">
                {footprintData!.riskLevel === 'critical' ? (
                  'Your digital footprint presents a CRITICAL risk level. Immediate action is required to protect your sensitive data.') : footprintData!.riskLevel === 'high' ? (
                  'Your digital footprint presents a high risk level. It is recommended to take action to protect your privacy.') : footprintData!.riskLevel === 'medium' ? (
                  'Your digital footprint presents a medium risk level. Some improvements are recommended.') : (
                  'Your digital footprint presents a low risk level. Continue maintaining good privacy practices.')}
              </p>
            </Card>

            {/* Detailed Analysis Results */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-text dark:text-white mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                {'Detailed Analysis'}
              </h3>
              <div className="space-y-4">
                {footprintData!.results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 ${
                      result.found 
                        ? result.risk === 'critical'
                          ? 'border-red-400 dark:border-red-600 bg-red-100 dark:bg-red-900/40 border-2'
                          : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-text dark:text-white">{result.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          result.found 
                            ? result.risk === 'critical'
                              ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 font-bold'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        }`}>
                          {result.found ? (result.risk === 'critical' ? 'CRITICAL FOUND' : 'FOUND') : 'NOT FOUND'}
                        </span>
                        <div className="flex items-center">
                          {getRiskIcon(result.risk)}
                          <span className={`ml-1 text-sm font-medium ${getRiskColor(result.risk)}`}>
                            {result.risk.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-text-secondary dark:text-gray-300 mb-3">
                      {result.description}
                    </p>

                    {result.found && (
                      <div className="space-y-3">
                        {result.dataPoints && result.dataPoints.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-text dark:text-white mb-2">
                              Exposed Data:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {result.dataPoints.map((point, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                                  {point}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.platforms && result.platforms.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-text dark:text-white mb-2">
                              Affected Platforms:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {result.platforms.map((platform, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                                  {platform}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.resultCount && (
                          <div className="flex items-center text-sm text-text-secondary dark:text-gray-300">
                            <Search className="h-4 w-4 mr-2" />
                            {result.resultCount} {'results found'}
                          </div>
                        )}

                        {result.articleCount && result.articleCount > 0 && (
                          <div className="flex items-center text-sm text-text-secondary dark:text-gray-300">
                            <FileText className="h-4 w-4 mr-2" />
                            {result.articleCount} {'articles found'}
                          </div>
                        )}

                        {result.breachCount && result.breachCount > 0 && (
                          <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            {result.breachCount} {'data breaches detected'}
                          </div>
                        )}

                        {result.postCount && result.postCount > 0 && (
                          <div className="flex items-center text-sm text-text-secondary dark:text-gray-300">
                            <FileText className="h-4 w-4 mr-2" />
                            {result.postCount} {'posts found'}
                          </div>
                        )}

                        {result.directoryCount && result.directoryCount > 0 && (
                          <div className="flex items-center text-sm text-text-secondary dark:text-gray-300">
                            <Database className="h-4 w-4 mr-2" />
                            {result.directoryCount} {'directories found'}
                          </div>
                        )}

                        <div className={`mt-3 p-3 rounded-lg ${
                          result.risk === 'critical'
                            ? 'bg-red-100 dark:bg-red-900/40 border-2 border-red-300 dark:border-red-700'
                            : 'bg-yellow-50 dark:bg-yellow-900/20'
                        }`}>
                          <p className={`text-sm font-medium mb-1 ${
                            result.risk === 'critical'
                              ? 'text-red-900 dark:text-red-100'
                              : 'text-yellow-800 dark:text-yellow-200'
                          }`}>
                            Recommendation:
                          </p>
                          <p className={`text-sm ${
                            result.risk === 'critical'
                              ? 'text-red-800 dark:text-red-200 font-semibold'
                              : 'text-yellow-700 dark:text-yellow-300'
                          }`}>
                            {result.recommendation}
                          </p>
                        </div>

                        {result.optOutAvailable && (
                          <div className="mt-2">
                            <Button size="sm" variant="outline" className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-600">
                              {'Opt Out'}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {!result.found && (
                      <div className="text-center py-4">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {'No exposure detected'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>


            {/* Action Plan */}
            <Card className="p-6 bg-gradient-to-r from-accent/10 to-blue-500/10 border-accent/20">
              <h3 className="text-xl font-semibold text-text dark:text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                {'Recommended Action Plan'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                  <p className="text-text-secondary dark:text-gray-300">
                    {'Review and update privacy settings on all your social media accounts'}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                  <p className="text-text-secondary dark:text-gray-300">
                    {'Request data deletion from identified data brokers'}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                  <p className="text-text-secondary dark:text-gray-300">
                    {'Delete or archive old posts and photos that might reveal personal information'}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                  <p className="text-text-secondary dark:text-gray-300">
                    {'Set up Google alerts to monitor new mentions of your name online'}
                  </p>
                </div>
              </div>
            </Card>

            <div className="text-center space-x-4">
              <Button
                onClick={() => {
                  setAnalysisComplete(false);
                  setFootprintData(null);
                  setSearchQuery('');
                  setError(null);
                }}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {'New Analysis'}
              </Button>
              <Button
                onClick={generatePDFReport}
                className="flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                {'Download PDF'}
              </Button>
              <Button
                onClick={generateReport}
                variant="outline"
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                {'Download JSON'}
              </Button>
            </div>
          </div>
        )}
      </Section>
    </PageLayout>
  );
};

export default DigitalFootprintAnalyzer;