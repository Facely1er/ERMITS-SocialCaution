import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../common/Card';

interface ModernStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'accent' | 'success' | 'warning' | 'danger' | 'primary';
  className?: string;
}

const ModernStatsCard: React.FC<ModernStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'accent',
  className = ''
}) => {
  const colorClasses = {
    accent: 'text-accent bg-accent/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-danger bg-danger/10',
    primary: 'text-primary bg-primary/10'
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="h-4 w-4" />;
    if (trend.value < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-text-secondary';
    if (trend.value > 0) return 'text-success';
    if (trend.value < 0) return 'text-danger';
    return 'text-text-secondary';
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="p-6 modern-card stats-card">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-secondary dark:text-text-secondary">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-text-secondary/70 dark:text-text-secondary/70">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-3xl font-bold text-text dark:text-text">
                {value}
              </p>
              
              {trend && (
                <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="font-medium">
                    {Math.abs(trend.value)}%
                  </span>
                  <span className="text-text-secondary dark:text-text-secondary">
                    {trend.label}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ModernStatsCard;