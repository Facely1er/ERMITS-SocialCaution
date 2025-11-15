import React from 'react';
import { Search, AlertTriangle, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Link } from 'react-router-dom';

interface ExposureResultsWidgetProps {
  score: number;
  lastAssessmentDate: string;
  priorityAreas?: string[];
  categoryScores?: Record<string, number>;
}

const ExposureResultsWidget: React.FC<ExposureResultsWidgetProps> = ({
  score,
  lastAssessmentDate,
  priorityAreas = [],
  categoryScores = {}
}) => {
  // Get the lowest scoring category
  const lowestCategory = Object.entries(categoryScores)
    .sort(([, a], [, b]) => a - b)
    .shift();

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-light-blue rounded-full mr-3">
            <Search className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-primary">Digital Exposure</h3>
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
            {priorityAreas.slice(0, 3).map((area, index) => (
              <div key={index} className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 mr-2" />
                <span className="text-sm text-gray-600">{area}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowestCategory && (
        <div className="bg-light-blue/10 p-3 rounded-lg mb-4">
          <h4 className="text-sm font-medium text-primary mb-2">Highest Risk Area</h4>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{lowestCategory[0]}</span>
            <Badge variant="danger">{lowestCategory[1]}%</Badge>
          </div>
        </div>
      )}

      <Link 
        to="/assessment/exposure"
        className="flex items-center justify-center w-full p-2 bg-light-blue text-accent hover:bg-light-blue/80 rounded-md font-medium transition-colors"
      >
        Take New Assessment
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Card>
  );
};

export default ExposureResultsWidget;