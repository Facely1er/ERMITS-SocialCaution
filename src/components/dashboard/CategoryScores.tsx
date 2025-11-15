import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import { Shield, Lock, AlertTriangle, FileText, Settings, UserCheck, Building } from 'lucide-react';

interface CategoryScoresProps {
  scores: {
    [key: string]: number;
  };
}

const categories = [
  { name: 'Data Protection', icon: Shield, color: 'bg-accent/20 text-accent' },
  { name: 'Account Security', icon: Lock, color: 'bg-primary/20 text-primary' },
  { name: 'Privacy Settings', icon: Settings, color: 'bg-warning/20 text-warning' },
  { name: 'Third-party Access', icon: FileText, color: 'bg-success/20 text-success' },
  { name: 'Data Sharing', icon: AlertTriangle, color: 'bg-danger/20 text-danger' },
  { name: 'Communication', icon: UserCheck, color: 'bg-secondary/20 text-secondary' },
  { name: 'Workplace Privacy', icon: Building, color: 'bg-info/20 text-info' }
];

const CategoryScores: React.FC<CategoryScoresProps> = ({ scores }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Category Scores</h3>
      <div className="space-y-3">
        {categories.map(({ name, icon: Icon, color }) => {
          const score = scores[name] || 0;
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${color} mr-3`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-gray-600">{name}</span>
                </div>
                <span className={`text-sm font-medium ${
                  score >= 80 ? 'text-success' :
                  score >= 60 ? 'text-warning' :
                  'text-danger'
                }`}>{score}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    score >= 80 ? 'bg-success' :
                    score >= 60 ? 'bg-warning' :
                    'bg-danger'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default CategoryScores;