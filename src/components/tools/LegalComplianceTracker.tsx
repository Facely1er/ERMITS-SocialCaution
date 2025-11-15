import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Download,
  Eye,
  Globe,
  Building,
  Plus
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

interface LegalRequest {
  id: string;
  type: 'ccpa' | 'gdpr' | 'state_privacy' | 'general';
  brokerId: string;
  brokerName: string;
  requestDate: string;
  responseDeadline: string;
  status: 'pending' | 'acknowledged' | 'completed' | 'rejected' | 'expired';
  responseReceived: boolean;
  responseDate?: string;
  legalBasis: string;
  jurisdiction: string;
  requestMethod: 'email' | 'online' | 'mail' | 'phone';
  trackingNumber?: string;
  notes: string;
  attachments: string[];
}

interface ComplianceStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  overdueRequests: number;
  successRate: number;
}

const LegalComplianceTracker: React.FC = () => {
  const [requests, setRequests] = useState<LegalRequest[]>([]);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LegalRequest | null>(null);
  const [newRequest, setNewRequest] = useState<Partial<LegalRequest>>({
    type: 'ccpa',
    status: 'pending',
    requestMethod: 'email',
    jurisdiction: 'US',
    legalBasis: 'CCPA',
    notes: ''
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const saved = localStorage.getItem('legalRequests');
    if (saved) {
      setRequests(JSON.parse(saved));
    }
  };

  const saveRequests = (newRequests: LegalRequest[]) => {
    localStorage.setItem('legalRequests', JSON.stringify(newRequests));
    setRequests(newRequests);
  };

  const addRequest = () => {
    if (!newRequest.brokerId || !newRequest.brokerName) return;

    const request: LegalRequest = {
      id: `req-${Date.now()}`,
      type: newRequest.type || 'ccpa',
      brokerId: newRequest.brokerId,
      brokerName: newRequest.brokerName || '',
      requestDate: new Date().toISOString(),
      responseDeadline: calculateDeadline(newRequest.type || 'ccpa'),
      status: 'pending',
      responseReceived: false,
      legalBasis: newRequest.legalBasis || 'CCPA',
      jurisdiction: newRequest.jurisdiction || 'US',
      requestMethod: newRequest.requestMethod || 'email',
      notes: newRequest.notes || '',
      attachments: []
    };

    const newRequests = [...requests, request];
    saveRequests(newRequests);
    setNewRequest({
      type: 'ccpa',
      status: 'pending',
      requestMethod: 'email',
      jurisdiction: 'US',
      legalBasis: 'CCPA',
      notes: ''
    });
    setShowNewRequest(false);
  };

  const calculateDeadline = (type: string) => {
    const now = new Date();
    switch (type) {
      case 'ccpa':
        return new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(); // 45 days
      case 'gdpr':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
      case 'state_privacy':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
      default:
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    }
  };

  // Update request status function (currently unused but kept for future features)
  // const updateRequestStatus = (id: string, status: LegalRequest['status']) => {
  //   const updatedRequests = requests.map(req => 
  //     req.id === id ? { ...req, status, responseReceived: status === 'completed' || status === 'acknowledged' } : req
  //   );
  //   saveRequests(updatedRequests);
  // };

  const getStats = (): ComplianceStats => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'pending').length;
    const completed = requests.filter(r => r.status === 'completed').length;
    const overdue = requests.filter(r => 
      r.status === 'pending' && new Date(r.responseDeadline) < new Date()
    ).length;
    const successRate = total > 0 ? (completed / total) * 100 : 0;

    return { totalRequests: total, pendingRequests: pending, completedRequests: completed, overdueRequests: overdue, successRate };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'acknowledged':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'acknowledged':
        return 'text-blue-600 dark:text-blue-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'rejected':
        return 'text-red-600 dark:text-red-400';
      case 'expired':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ccpa':
        return <Building className="h-4 w-4 text-blue-500" />;
      case 'gdpr':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'state_privacy':
        return <Scale className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const generateLegalTemplate = (request: LegalRequest) => {
    const templates = {
      ccpa: `Subject: CCPA Data Deletion Request - ${request.brokerName}

Dear Privacy Team,

I am writing to request the deletion of my personal information from your database under the California Consumer Privacy Act (CCPA).

Request Details:
- Request ID: ${request.id}
- Request Date: ${new Date(request.requestDate).toLocaleDateString()}
- Response Deadline: ${new Date(request.responseDeadline).toLocaleDateString()}

Under CCPA Section 1798.105, I have the right to request that you delete my personal information. Please confirm that you have:
1. Deleted my personal information from your databases
2. Instructed any service providers to delete my information
3. Not sold my personal information in the 12 months preceding the request

Please confirm the deletion within 45 days as required by law.

Thank you for your prompt attention to this matter.

Best regards,
[Your Name]`,
      gdpr: `Subject: GDPR Article 17 Data Erasure Request - ${request.brokerName}

Dear Data Protection Officer,

I am writing to exercise my right to erasure under Article 17 of the General Data Protection Regulation (GDPR).

Request Details:
- Request ID: ${request.id}
- Request Date: ${new Date(request.requestDate).toLocaleDateString()}
- Response Deadline: ${new Date(request.responseDeadline).toLocaleDateString()}

I request that you erase all personal data relating to me without undue delay and in any event within one month of receipt of this request, as required by GDPR Article 17.

Please confirm that you have:
1. Erased my personal data from all systems
2. Notified any third parties who have received my data
3. Ceased further processing of my personal data

I look forward to your confirmation of erasure within the required timeframe.

Yours sincerely,
[Your Name]`
    };

    return templates[request.type] || templates.ccpa;
  };

  const downloadRequest = (request: LegalRequest) => {
    const content = generateLegalTemplate(request);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-request-${request.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text dark:text-white flex items-center">
            <Scale className="h-6 w-6 mr-2" />
            Legal Compliance Tracker
          </h2>
          <p className="text-text-secondary dark:text-gray-300">
            Track GDPR, CCPA, and other privacy law compliance requests
          </p>
        </div>
        <Button onClick={() => setShowNewRequest(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalRequests}
          </div>
          <p className="text-sm text-text-secondary dark:text-gray-300">Total Requests</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.pendingRequests}
          </div>
          <p className="text-sm text-text-secondary dark:text-gray-300">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.completedRequests}
          </div>
          <p className="text-sm text-text-secondary dark:text-gray-300">Completed</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.overdueRequests}
          </div>
          <p className="text-sm text-text-secondary dark:text-gray-300">Overdue</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.successRate.toFixed(0)}%
          </div>
          <p className="text-sm text-text-secondary dark:text-gray-300">Success Rate</p>
        </Card>
      </div>

      {/* Requests List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text dark:text-white mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Legal Requests
        </h3>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-text-secondary dark:text-gray-300 mb-4">
              No legal requests tracked yet. Create your first request to get started.
            </p>
            <Button onClick={() => setShowNewRequest(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Request
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getTypeIcon(request.type)}
                    <div>
                      <h4 className="font-medium text-text dark:text-white">{request.brokerName}</h4>
                      <p className="text-sm text-text-secondary dark:text-gray-300">
                        {request.legalBasis} • {request.jurisdiction} • {request.requestMethod}
                      </p>
                      <p className="text-sm text-text-secondary dark:text-gray-300">
                        Requested: {new Date(request.requestDate).toLocaleDateString()} • 
                        Deadline: {new Date(request.responseDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <span className={`ml-2 text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        onClick={() => downloadRequest(request)}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => setSelectedRequest(request)}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* New Request Modal */}
      {showNewRequest && (
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
                  Create Legal Request
                </h3>
                <Button onClick={() => setShowNewRequest(false)} variant="outline" size="sm">
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text dark:text-white mb-2">
                      Request Type
                    </label>
                    <select
                      value={newRequest.type || 'ccpa'}
                      onChange={(e) => setNewRequest(prev => ({ 
                        ...prev, 
                        type: e.target.value as any,
                        legalBasis: e.target.value === 'ccpa' ? 'CCPA' : e.target.value === 'gdpr' ? 'GDPR' : 'State Privacy Law'
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="ccpa">CCPA (California)</option>
                      <option value="gdpr">GDPR (EU)</option>
                      <option value="state_privacy">State Privacy Law</option>
                      <option value="general">General Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text dark:text-white mb-2">
                      Jurisdiction
                    </label>
                    <select
                      value={newRequest.jurisdiction || 'US'}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, jurisdiction: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="US">United States</option>
                      <option value="EU">European Union</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text dark:text-white mb-2">
                      Broker Name
                    </label>
                    <input
                      type="text"
                      value={newRequest.brokerName || ''}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, brokerName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter broker name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text dark:text-white mb-2">
                      Request Method
                    </label>
                    <select
                      value={newRequest.requestMethod || 'email'}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, requestMethod: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="email">Email</option>
                      <option value="online">Online Form</option>
                      <option value="mail">Mail</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-white mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newRequest.notes || ''}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Add any additional notes or context..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button onClick={() => setShowNewRequest(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={addRequest}>
                    Create Request
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
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
                  Request Details - {selectedRequest.brokerName}
                </h3>
                <Button onClick={() => setSelectedRequest(null)} variant="outline" size="sm">
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text dark:text-white">Request ID</label>
                    <p className="text-sm text-text-secondary dark:text-gray-300">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text dark:text-white">Status</label>
                    <div className="flex items-center">
                      {getStatusIcon(selectedRequest.status)}
                      <span className={`ml-2 text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text dark:text-white">Request Date</label>
                    <p className="text-sm text-text-secondary dark:text-gray-300">
                      {new Date(selectedRequest.requestDate).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text dark:text-white">Response Deadline</label>
                    <p className="text-sm text-text-secondary dark:text-gray-300">
                      {new Date(selectedRequest.responseDeadline).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-text dark:text-white">Legal Template</label>
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <pre className="text-sm text-text-secondary dark:text-gray-300 whitespace-pre-wrap">
                      {generateLegalTemplate(selectedRequest)}
                    </pre>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button onClick={() => downloadRequest(selectedRequest)} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <Button onClick={() => setSelectedRequest(null)}>
                    Close
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

export default LegalComplianceTracker;