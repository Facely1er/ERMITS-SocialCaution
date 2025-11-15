import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileCheck, Star, ArrowRight, Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { usePersona } from '../../hooks/usePersona';

interface Resource {
  id: string;
  title: string;
  type: 'guide' | 'course' | 'template';
  description: string;
  premium: boolean;
  rating?: number;
  completionTime?: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  path: string;
}

interface ResourceRecommendationsProps {
  resources: Resource[];
  categoryScores?: Record<string, number>;
  priorityAreas?: string[];
}

const ResourceRecommendations: React.FC<ResourceRecommendationsProps> = ({ 
  resources,
  categoryScores = {},
  priorityAreas = []
}) => {
  const { personaConfig } = usePersona();
  
  // Sort resources by priority and relevance to low-scoring categories
  // Also prioritize resources relevant to user's persona
  const sortedResources = [...resources].sort((a, b) => {
    // Check if resource is relevant to persona's primary actions
    const aPersonaRelevant = personaConfig?.navigation.primaryActions.some(
      action => action.path.includes(a.category.toLowerCase()) || 
                a.category.toLowerCase().includes(action.label.toLowerCase())
    ) ? 0 : 1;
    const bPersonaRelevant = personaConfig?.navigation.primaryActions.some(
      action => action.path.includes(b.category.toLowerCase()) || 
                b.category.toLowerCase().includes(action.label.toLowerCase())
    ) ? 0 : 1;
    
    // Prioritize persona-relevant resources
    if (aPersonaRelevant !== bPersonaRelevant) {
      return aPersonaRelevant - bPersonaRelevant;
    }
    
    // Prioritize resources for categories with low scores
    const aScore = categoryScores[a.category] || 100;
    const bScore = categoryScores[b.category] || 100;
    
    if (aScore !== bScore) {
      return aScore - bScore; // Lower scores first
    }
    
    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getIcon = (type: Resource['type']) => {
    switch (type) {
      case 'guide':
        return <BookOpen className="w-5 h-5 text-accent" />;
      case 'course':
        return <Shield className="w-5 h-5 text-success" />;
      case 'template':
        return <FileCheck className="w-5 h-5 text-primary" />;
    }
  };


  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Recommended Resources</h3>
        <Link 
          to="/resources" 
          className="text-accent hover:text-accent-dark text-sm font-medium flex items-center"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-3">
        {sortedResources.map((resource, index) => {
          const isHighPriority = priorityAreas.includes(resource.category);
          
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link to={resource.path}>
                <div className={`bg-light-blue/10 rounded-lg p-3 hover:bg-light-blue/20 transition-colors ${
                  isHighPriority ? 'border-l-4 border-accent' : ''
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      {getIcon(resource.type)}
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-primary">{resource.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-accent" />
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <Badge
                          variant={
                            resource.type === 'guide' ? 'primary' :
                            resource.type === 'course' ? 'success' :
                            'secondary'
                          }
                        >
                          {resource.type}
                        </Badge>

                        {resource.premium && (
                          <Badge variant="warning">Premium</Badge>
                        )}

                        <Badge variant={
                          resource.priority === 'high' ? 'danger' :
                          resource.priority === 'medium' ? 'warning' :
                          'success'
                        }>
                          {resource.priority} priority
                        </Badge>

                        {resource.rating && (
                          <div className="flex items-center text-sm text-warning">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            {resource.rating}
                          </div>
                        )}

                        {resource.completionTime && (
                          <span className="text-sm text-gray-500">
                            {resource.completionTime}
                          </span>
                        )}
                      </div>

                      {isHighPriority && (
                        <div className="mt-2 flex items-center text-sm text-accent">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Recommended based on your assessment results
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default ResourceRecommendations;