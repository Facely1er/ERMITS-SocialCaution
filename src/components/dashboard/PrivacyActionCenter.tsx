import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, AlertTriangle, ArrowRight, FileText, Eye } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

interface PrivacyActionCenterProps {
  riskScore: number;
  rightsScore: number;
  recommendations: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    type: 'risk' | 'rights';
  }[];
  lastAssessment?: string;
}

const PrivacyActionCenter: React.FC<PrivacyActionCenterProps> = ({
  riskScore,
  rightsScore,
  recommendations,
  lastAssessment
}) => {
  const navigate = useNavigate();
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-3 bg-accent/10 rounded-full mr-4">
            <Shield className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">Privacy Risk Exposure & Rights Action Center™</h2>
            <p className="text-gray-600">Monitor and improve your privacy protection</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/assessment')}
        >
          Take New Assessment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Risk Score */}
        <div className="bg-light-blue/10 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-accent mr-2" />
              <h3 className="font-semibold text-primary">Risk Exposure</h3>
            </div>
            <Badge variant={
              riskScore <= 30 ? 'success' :
              riskScore <= 60 ? 'warning' : 
              'danger'
            }>
              {riskScore}% Risk
            </Badge>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                riskScore <= 30 ? 'bg-success' :
                riskScore <= 60 ? 'bg-warning' :
                'bg-danger'
              }`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {riskScore <= 30 ? 'Your privacy risk exposure is low' :
             riskScore <= 60 ? 'Moderate privacy risks detected' :
             'High privacy risks require attention'}
          </p>
        </div>

        {/* Rights Score */}
        <div className="bg-light-blue/10 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-accent mr-2" />
              <h3 className="font-semibold text-primary">Rights Protection</h3>
            </div>
            <Badge variant={
              rightsScore >= 70 ? 'success' :
              rightsScore >= 40 ? 'warning' :
              'danger'
            }>
              {rightsScore}% Protected
            </Badge>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                rightsScore >= 70 ? 'bg-success' :
                rightsScore >= 40 ? 'bg-warning' :
                'bg-danger'
              }`}
              style={{ width: `${rightsScore}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {rightsScore >= 70 ? 'Your privacy rights are well protected' :
             rightsScore >= 40 ? 'Some rights need attention' :
             'Take action to protect your privacy rights'}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-primary mb-4">Recommended Actions</h3>
        {recommendations.map((rec) => (
          <div 
            key={rec.id}
            className="p-4 rounded-lg border border-l-4 bg-light-blue/5"
            style={{
              borderLeftColor: rec.priority === 'high' ? 'var(--danger)' :
                             rec.priority === 'medium' ? 'var(--warning)' :
                             'var(--success)'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="mt-1 mr-3">
                  {rec.type === 'risk' ? (
                    <AlertTriangle className="h-5 w-5 text-danger" />
                  ) : (
                    <Lock className="h-5 w-5 text-accent" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-primary mb-1">{rec.title}</h4>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-4 flex-shrink-0"
                onClick={() => navigate('/dashboard/action-plan', { state: { recommendationId: rec.id } })}
              >
                Take Action
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Rights Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center mb-3">
            <Eye className="h-5 w-5 text-accent mr-2" />
            <h3 className="font-medium text-primary">Access Rights</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Request access to your personal data
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={() => navigate('/dashboard/rights-checkup')}
          >
            Make Request
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center mb-3">
            <FileText className="h-5 w-5 text-accent mr-2" />
            <h3 className="font-medium text-primary">Data Portability</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Export your data in a portable format
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={() => navigate('/resources/tools/personal-data-inventory')}
          >
            Export Data
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center mb-3">
            <Lock className="h-5 w-5 text-accent mr-2" />
            <h3 className="font-medium text-primary">Privacy Settings</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Manage your privacy preferences
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={() => navigate('/dashboard/settings')}
          >
            Update Settings
          </Button>
        </Card>
      </div>

      {lastAssessment && (
        <p className="text-sm text-gray-500 mt-6">
          Last assessment: {new Date(lastAssessment).toLocaleDateString()}
        </p>
      )}
    </Card>
  );
};

export default PrivacyActionCenter;