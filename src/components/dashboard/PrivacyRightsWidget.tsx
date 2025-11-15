import React from 'react';
import { Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Link } from 'react-router-dom';

interface PrivacyRightsWidgetProps {
  score: number;
  lastAssessmentDate: string;
  priorityAreas?: string[];
}

const PrivacyRightsWidget: React.FC<PrivacyRightsWidgetProps> = ({
  score,
  lastAssessmentDate,
  priorityAreas = []
}) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-light-blue rounded-full mr-3">
            <Shield className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-primary">Privacy Rights</h3>
        </div>
        <Badge variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger'}>
          {score}% Score
        </Badge>
      </div>

      <div className="mb-4">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Last assessment: {new Date(lastAssessmentDate).toLocaleDateString()}
        </p>
      </div>

      {priorityAreas.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-primary mb-2">Priority Areas</h4>
          <div className="space-y-2">
            {priorityAreas.map((area, index) => (
              <div key={index} className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 mr-2" />
                <span className="text-sm text-gray-600">{area}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link 
        to="/assessment/rights"
        className="flex items-center justify-center w-full p-2 bg-light-blue text-accent hover:bg-light-blue/80 rounded-md font-medium transition-colors"
      >
        Take New Assessment
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Card>
  );
};

export default PrivacyRightsWidget;