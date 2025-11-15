import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Info, Shield } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
interface ChecklistItem {
  id: string;
  text: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface PrivacyChecklist {
  id: string;
  title: string;
  description: string;
  icon: any;
  lastUpdated: string;
  platform: string;
  categories: {
    name: string;
    items: ChecklistItem[];
  }[];
}

interface ChecklistDisplayProps {
  checklist: PrivacyChecklist;
}

const ChecklistDisplay: React.FC<ChecklistDisplayProps> = ({ checklist }) => {
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setCompletedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const totalItems = checklist.categories.reduce(
    (sum, category) => sum + category.items.length,
    0
  );

  const progress = (completedItems.length / totalItems) * 100;

  // Translation helpers
  const getTranslatedProgress = () => {
    return "Progress";
  };

  const getTranslatedOf = () => {
    return "of";
  };

  const getTranslatedItemsCompleted = () => {
    return "items completed";
  };


  return (
    <Card className="p-6">
      <div className="flex items-start mb-6">
        <div className="p-3 bg-accent/10 rounded-full mr-4">
          <Shield className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">{checklist.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{checklist.description}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{getTranslatedProgress()}</span>
          <span className="text-sm font-medium text-accent">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {completedItems.length} {getTranslatedOf()} {totalItems} {getTranslatedItemsCompleted()}
        </p>
      </div>

      {checklist.categories.map((category, categoryIndex) => (
        <motion.div
          key={categoryIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-primary dark:text-white mb-4">{category.name}</h2>
          
          <div className="space-y-4">
            {category.items.map((item) => (
              <motion.div
                key={item.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  completedItems.includes(item.id)
                    ? 'bg-success/5 border-success/20'
                    : 'bg-light-blue/5 dark:bg-card-hover border-accent/20'
                } border`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-start">
                  <div className={`p-1 rounded-full mr-3 transition-colors ${
                    completedItems.includes(item.id)
                      ? 'bg-success/10'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <CheckCircle className={`h-5 w-5 ${
                      completedItems.includes(item.id)
                        ? 'text-success'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${
                        completedItems.includes(item.id)
                          ? 'text-gray-500 dark:text-gray-400 line-through'
                          : 'text-primary dark:text-white'
                      }`}>{item.text}</h3>
                      <div className="flex gap-2">
                        <Badge variant={
                          item.priority === 'high' ? 'danger' :
                          item.priority === 'medium' ? 'warning' :
                          'success'
                        }>
                          {item.priority}
                        </Badge>
                        <Badge variant="secondary">
                          {item.difficulty}
                        </Badge>
                      </div>
                    </div>
                    {item.description && (
                      <p className={`text-sm mt-1 ${
                        completedItems.includes(item.id)
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>{item.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      <div className="mt-8 p-4 bg-light-blue/10 dark:bg-card-hover rounded-lg">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-accent mt-1 mr-3" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Learn more about privacy protection
            </p>
            <p className="text-sm text-accent mt-1">
              Last Updated: {checklist.lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChecklistDisplay;