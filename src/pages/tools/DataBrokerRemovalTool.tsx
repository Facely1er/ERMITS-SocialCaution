import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  Search, 
  Clock, 
  Mail, 
  Eye, 
  RefreshCw,
  BarChart3,
  CheckSquare,
  Square,
  Scale
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ToolsApiService from '../../services/toolsApi';
import EmailTemplateGenerator from '../../components/tools/EmailTemplateGenerator';
import FormAutoFiller from '../../components/tools/FormAutoFiller';
import DataMonitoringSystem from '../../components/tools/DataMonitoringSystem';
import LegalComplianceTracker from '../../components/tools/LegalComplianceTracker';

interface DataBroker {
  id: string;
  name: string;
  website: string;
  optOutUrl: string;
  optOutMethod: 'online' | 'email' | 'phone' | 'mail';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'verified';
  description: string;
  dataTypes: string[];
  estimatedTime: string;
  requiresId: boolean;
  instructions: string[];
  legalBasis: string;
  responseTime: string;
  verificationMethod: string;
  recheckInterval: number;
  categories: string[];
  hasData?: boolean;
  confidence?: number;
  lastUpdated?: string;
}

interface SearchResult {
  brokerId: string;
  brokerName: string;
  website: string;
  hasData: boolean;
  confidence: number;
  dataTypes: string[];
  lastUpdated: string;
  optOutUrl: string;
  difficulty: string;
  estimatedTime: string;
}

interface RemovalRequest {
  id: string;
  brokerId: string;
  brokerName: string;
  userInfo: any;
  requestType: string;
  status: string;
  submittedAt: string;
  estimatedResponseTime: string;
  nextCheckDate: string;
}

const DataBrokerRemovalTool: React.FC = () => {
  const [brokers, setBrokers] = useState<DataBroker[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<DataBroker | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  // const [showSearchForm, setShowSearchForm] = useState(false);
  // const [showProgress, setShowProgress] = useState(false);
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);
  const [showFormAutoFiller, setShowFormAutoFiller] = useState(false);
  const [removalRequests, setRemovalRequests] = useState<RemovalRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'brokers' | 'progress' | 'monitoring' | 'legal'>('search');
  const [searchForm, setSearchForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isSearching, setIsSearching] = useState(false);


  useEffect(() => {
    loadDataBrokers();
    loadRemovalRequests();
  }, []);

  const loadDataBrokers = async () => {
    try {
      const brokersData = await ToolsApiService.getDataBrokers();
      setBrokers(brokersData);
    } catch (error) {
      console.error('Error loading data brokers:', error);
    }
  };

  const loadRemovalRequests = () => {
    // Load from localStorage (in real app, this would be from backend)
    const saved = localStorage.getItem('dataBrokerRemovalRequests');
    if (saved) {
      setRemovalRequests(JSON.parse(saved));
    }
  };

  const saveRemovalRequests = (requests: RemovalRequest[]) => {
    localStorage.setItem('dataBrokerRemovalRequests', JSON.stringify(requests));
    setRemovalRequests(requests);
  };

  const searchForData = async () => {
    if (!searchForm.name.trim()) return;

    try {
      setIsSearching(true);
      const results = await ToolsApiService.searchDataBrokers(searchForm);
      setSearchResults(results);
      setActiveTab('brokers');
    } catch (error) {
      console.error('Error searching data brokers:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const submitRemovalRequest = async (brokerId: string) => {
    try {
      const request = await ToolsApiService.submitRemovalRequest(brokerId, searchForm);
      const newRequests = [...removalRequests, request];
      saveRemovalRequests(newRequests);
      
      // Update broker status
      setBrokers(prev => prev.map(broker => 
        broker.id === brokerId ? { ...broker, status: 'in_progress' } : broker
      ));
      
      setShowInstructions(false);
      setActiveTab('progress');
    } catch (error) {
      console.error('Error submitting removal request:', error);
    }
  };

  const verifyRemoval = async (brokerId: string) => {
    try {
      const result = await ToolsApiService.verifyRemoval(brokerId, searchForm);
      
      // Update broker status based on verification
      setBrokers(prev => prev.map(broker => 
        broker.id === brokerId ? { 
          ...broker, 
          status: result.verified ? 'verified' : 'failed' 
        } : broker
      ));
      
      return result;
    } catch (error) {
      console.error('Error verifying removal:', error);
      return null;
    }
  };

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'hard': return 'text-red-600 dark:text-red-400';
    }
  };

  const getDifficultyIcon = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'hard': return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 dark:text-green-400';
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'in_progress': return 'text-yellow-600 dark:text-yellow-400';
      case 'failed': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default: return <Square className="h-4 w-4 text-gray-300 dark:text-gray-600" />;
    }
  };

  const getProgressStats = () => {
    const total = brokers.length;
    const completed = brokers.filter(b => b.status === 'completed' || b.status === 'verified').length;
    const inProgress = brokers.filter(b => b.status === 'in_progress').length;
    const failed = brokers.filter(b => b.status === 'failed').length;
    const notStarted = brokers.filter(b => b.status === 'not_started').length;

    return { total, completed, inProgress, failed, notStarted };
  };

  const stats = getProgressStats();

  return (
    <PageLayout
      title="Data Broker Removal Tool"
      subtitle="Find and remove your personal data from data broker websites"
      description="Comprehensive tool to search for your data across major data brokers and manage the removal process."
      heroBackground={false}
      backgroundType="toolkit"
      breadcrumbs={[
        { label: 'Resources', path: '/resources' },
        { label: 'Tools', path: '/resources/tools' },
        { label: 'Data Broker Removal', path: '/resources/tools/data-broker-removal' }
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
                {'This tool provides real instructions and direct links to remove your data from data brokers. You can follow the steps to make actual removal requests.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            onClick={() => setActiveTab('search')}
            variant={activeTab === 'search' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search for Data
          </Button>
          <Button
            onClick={() => setActiveTab('brokers')}
            variant={activeTab === 'brokers' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Data Brokers ({brokers.length})
          </Button>
          <Button
            onClick={() => setActiveTab('progress')}
            variant={activeTab === 'progress' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Progress ({stats.completed}/{stats.total})
          </Button>
          <Button
            onClick={() => setActiveTab('monitoring')}
            variant={activeTab === 'monitoring' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Monitoring
          </Button>
          <Button
            onClick={() => setActiveTab('legal')}
            variant={activeTab === 'legal' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Scale className="h-4 w-4" />
            Legal Compliance
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Search Tab */}
        {activeTab === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Section
              title="Search for Your Data"
              subtitle="Enter your information to search across data broker websites"
            >
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text dark:text-white mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={searchForm.name}
                      onChange={(e) => setSearchForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text dark:text-white mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={searchForm.email}
                      onChange={(e) => setSearchForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text dark:text-white mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={searchForm.phone}
                      onChange={(e) => setSearchForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text dark:text-white mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={searchForm.address}
                      onChange={(e) => setSearchForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={searchForData}
                    disabled={!searchForm.name.trim() || isSearching}
                    className="flex items-center gap-2"
                  >
                    {isSearching ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {isSearching ? 'Searching...' : 'Search Data Brokers'}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-text dark:text-white mb-4">
                      Search Results ({searchResults.length} brokers found your data)
                    </h3>
                    <div className="space-y-3">
                      {searchResults.map((result, index) => (
                        <Card key={index} className="p-4 border-l-4 border-red-500">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-text dark:text-white">{result.brokerName}</h4>
                              <p className="text-sm text-text-secondary dark:text-gray-300">
                                Confidence: {result.confidence}% • Last updated: {new Date(result.lastUpdated).toLocaleDateString()}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {result.dataTypes.map((type, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded">
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                Data Found
                              </span>
                              <Button
                                onClick={() => {
                                  const broker = brokers.find(b => b.id === result.brokerId);
                                  if (broker) {
                                    setSelectedBroker(broker);
                                    setShowInstructions(true);
                                  }
                                }}
                                size="sm"
                              >
                                Remove Data
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </Section>
          </motion.div>
        )}

        {/* Brokers Tab */}
        {activeTab === 'brokers' && (
          <motion.div
            key="brokers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Section
              title="Data Brokers Directory"
              subtitle="Browse and manage removal requests for major data brokers"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brokers.map((broker, index) => (
                  <motion.div
                    key={broker.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-text dark:text-white mb-1">{broker.name}</h3>
                          <p className="text-sm text-text-secondary dark:text-gray-300">{broker.website}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(broker.status)}
                          <span className={`text-sm font-medium ${getStatusColor(broker.status)}`}>
                            {broker.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-text-secondary dark:text-gray-300 mb-4 flex-grow">
                        {broker.description}
                      </p>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-text dark:text-white mb-2">Data Types:</p>
                        <div className="flex flex-wrap gap-1">
                          {broker.dataTypes.slice(0, 3).map((type, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                              {type}
                            </span>
                          ))}
                          {broker.dataTypes.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                              +{broker.dataTypes.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {getDifficultyIcon(broker.difficulty)}
                          <span className={`ml-1 text-sm font-medium ${getDifficultyColor(broker.difficulty)}`}>
                            {broker.difficulty.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-text-secondary dark:text-gray-300">
                          {broker.estimatedTime}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            setSelectedBroker(broker);
                            setShowInstructions(true);
                          }}
                          size="sm"
                          className="flex-1"
                        >
                          {broker.status === 'not_started' ? 'Start Removal' : 'Manage'}
                        </Button>
                        <Button
                          onClick={() => window.open(broker.optOutUrl, '_blank')}
                          variant="outline"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Section>
          </motion.div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Section
              title="Removal Progress"
              subtitle="Track your data removal requests and progress"
            >
              {/* Progress Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.completed}
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-300">Completed</p>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.inProgress}
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-300">In Progress</p>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.failed}
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-300">Failed</p>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {stats.notStarted}
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-300">Not Started</p>
                </Card>
              </div>

              {/* Progress List */}
              <div className="space-y-4">
                {brokers.map((broker, _index) => (
                  <Card key={broker.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(broker.status)}
                        <div>
                          <h3 className="font-semibold text-text dark:text-white">{broker.name}</h3>
                          <p className="text-sm text-text-secondary dark:text-gray-300">
                            {broker.estimatedTime} • {broker.legalBasis}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getStatusColor(broker.status)}`}>
                          {broker.status.replace('_', ' ').toUpperCase()}
                        </span>
                        {broker.status === 'completed' && (
                          <Button
                            onClick={() => verifyRemoval(broker.id)}
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>
          </motion.div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <motion.div
            key="monitoring"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DataMonitoringSystem />
          </motion.div>
        )}

        {/* Legal Compliance Tab */}
        {activeTab === 'legal' && (
          <motion.div
            key="legal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LegalComplianceTracker />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && selectedBroker && (
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-text dark:text-white">
                    Removal Instructions - {selectedBroker.name}
                  </h3>
                  <Button
                    onClick={() => setShowInstructions(false)}
                    variant="outline"
                    size="sm"
                  >
                    ✕
                  </Button>
                </div>

                <div className="mb-6">
                  <p className="text-text-secondary dark:text-gray-300 mb-4">
                    {selectedBroker.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-text dark:text-white mb-1">
                        Removal method:
                      </p>
                      <p className="text-sm text-text-secondary dark:text-gray-300">
                        {selectedBroker.optOutMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text dark:text-white mb-1">
                        Difficulty:
                      </p>
                      <div className="flex items-center">
                        {getDifficultyIcon(selectedBroker.difficulty)}
                        <span className={`ml-1 text-sm font-medium ${getDifficultyColor(selectedBroker.difficulty)}`}>
                          {selectedBroker.difficulty.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-text dark:text-white mb-3">
                    Steps to follow:
                  </h4>
                  <div className="space-y-3">
                    {selectedBroker.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-text-secondary dark:text-gray-300">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => submitRemovalRequest(selectedBroker.id)}
                      className="flex-1"
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Submit Removal Request
                    </Button>
                    <Button
                      onClick={() => window.open(selectedBroker.optOutUrl, '_blank')}
                      variant="outline"
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Opt-Out Page
                    </Button>
                  </div>
                  
                  <div className="flex space-x-3">
                    {selectedBroker.optOutMethod === 'email' && (
                      <Button
                        onClick={() => setShowEmailTemplate(true)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Generate Email Template
                      </Button>
                    )}
                    {selectedBroker.optOutMethod === 'online' && (
                      <Button
                        onClick={() => setShowFormAutoFiller(true)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Auto-Fill Form
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Template Generator Modal */}
      {showEmailTemplate && selectedBroker && (
        <EmailTemplateGenerator
          brokerName={selectedBroker.name}
          userInfo={searchForm}
          onClose={() => setShowEmailTemplate(false)}
        />
      )}

      {/* Form Auto-Filler Modal */}
      {showFormAutoFiller && selectedBroker && (
        <FormAutoFiller
          brokerName={selectedBroker.name}
          brokerUrl={selectedBroker.optOutUrl}
          userInfo={searchForm}
          onClose={() => setShowFormAutoFiller(false)}
        />
      )}
    </PageLayout>
  );
};

export default DataBrokerRemovalTool;