import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ExportButton from '../common/ExportButton';
import { ExportableData } from '../../utils/exportUtils';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
  resourceLink?: string;
}

interface ActionPlanProps {
  tasks: Task[];
  exportData?: ExportableData;
}

const ActionPlan: React.FC<ActionPlanProps> = ({ tasks, exportData }) => {
  // Memoize sorted tasks to prevent unnecessary re-sorting on every render
  // Must be called before any early returns to follow Rules of Hooks
  const sortedTasks = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) {
      return [];
    }
    return [...tasks].sort((a, b) => {
      if (a.completed === b.completed) {
        if (a.priority === b.priority) return 0;
        if (a.priority === 'high') return -1;
        if (b.priority === 'high') return 1;
        if (a.priority === 'medium') return -1;
        return 1;
      }
      return a.completed ? 1 : -1;
    });
  }, [tasks]);

  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No action items available</p>
        </div>
      </Card>
    );
  }

  // Map task titles to resource links
  const resourceMap: Record<string, string> = {
    'Enable Two-Factor Authentication': '/resources/guides/password-management',
    'Review Privacy Settings': '/resources/guides/social-media-security',
    'Update Weak Passwords': '/resources/guides/password-management',
    'Configure App Permissions': '/resources/guides/mobile-privacy',
    'Set Up Password Manager': '/resources/guides/password-management',
    'Secure Your Home Network': '/resources/checklists/home-network-security',
    'Review Social Media Privacy': '/resources/checklists/social-media-privacy',
    'Check Data Broker Sites': '/resources/tools/data-broker-removal',
    'Enable Tracking Protection': '/resources/guides/browser-privacy',
    'Set Up VPN': '/resources/guides/vpn-setup'
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Action Plan</h3>
        <div className="flex items-center gap-3">
          <Badge variant="primary">
            {tasks.filter(t => t.completed).length}/{tasks.length} Complete
          </Badge>
          {exportData && <ExportButton data={exportData} />}
        </div>
      </div>

      <div className="space-y-2">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-3 rounded-lg border ${
              task.completed
                ? 'bg-success/5 border-success/20'
                : task.priority === 'high'
                  ? 'bg-danger/5 border-danger/20'
                  : task.priority === 'medium'
                    ? 'bg-warning/5 border-warning/20'
                    : 'bg-accent/5 border-accent/20'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="mt-1">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <AlertCircle className={`w-5 h-5 ${
                    task.priority === 'high' ? 'text-danger' :
                    task.priority === 'medium' ? 'text-warning' :
                    'text-accent'
                  }`} />
                )}
              </div>

              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                  {!task.completed && (
                    <Link 
                      to={task.resourceLink || resourceMap[task.title] || '/resources'} 
                      className="text-accent hover:text-accent-dark"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <Badge
                    variant={
                      task.completed ? 'success' :
                      task.priority === 'high' ? 'danger' :
                      task.priority === 'medium' ? 'warning' :
                      'primary'
                    }
                  >
                    {task.completed ? 'Completed' : `${task.priority} Priority`}
                  </Badge>
                  
                  {task.dueDate && !task.completed && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      Due {format(new Date(task.dueDate), 'MMM d')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default ActionPlan;