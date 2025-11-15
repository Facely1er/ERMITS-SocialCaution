import React from 'react';
import { CheckCircle, Shield, AlertTriangle } from 'lucide-react';

interface ToolTypeIndicatorProps {
  type: 'real' | 'simulator' | 'educational';
  className?: string;
}

const ToolTypeIndicator: React.FC<ToolTypeIndicatorProps> = ({ type, className = '' }) => {

  const getTypeConfig = () => {
    switch (type) {
      case 'real':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          iconColor: 'text-green-600 dark:text-green-400',
          textColor: 'text-green-800 dark:text-green-200',
          label: 'Real Tool',
          description: 'Real functionality'};
      case 'simulator':
        return {
          icon: Shield,
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          iconColor: 'text-blue-600 dark:text-blue-400',
          textColor: 'text-blue-800 dark:text-blue-200',
          label: 'Simulator',
          description: 'For educational purposes'};
      case 'educational':
        return {
          icon: Shield,
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          iconColor: 'text-blue-600 dark:text-blue-400',
          textColor: 'text-blue-800 dark:text-blue-200',
          label: 'Educational',
          description: 'Learning tool'};
      default:
        return {
          icon: AlertTriangle,
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          iconColor: 'text-gray-600 dark:text-gray-400',
          textColor: 'text-gray-800 dark:text-gray-200',
          label: 'Unknown',
          description: 'Unknown type'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.borderColor} border ${className}`}>
      <Icon className={`h-3 w-3 mr-1.5 ${config.iconColor}`} />
      <span className={config.textColor}>
        {config.label}
      </span>
    </div>
  );
};

export default ToolTypeIndicator;