import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Shield, BookOpen, Lock, Eye, Globe } from 'lucide-react';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import GuideDisplay from '../components/guides/GuideDisplay';
import ChecklistDisplay from '../components/checklists/ChecklistDisplay';
interface ResourceGuidePageProps {
  type: 'guide' | 'checklist';
}

const ResourceGuidePage: React.FC<ResourceGuidePageProps> = ({ type }) => {
  const { guideId, checklistId } = useParams();
  const navigate = useNavigate();
  
  const resourceId = type === 'guide' ? guideId : checklistId;
  
  // Check if resource exists
  const resourceExists = true; // This would normally check against your data

  if (!resourceExists) {
    return (
      <Section>
        <Card className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
              {type === 'guide' 
                ? 'Guide Not Found' 
                : 'Checklist Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The resource you're looking for doesn't exist or has been removed.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/resources')}
              className="flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Button>
          </div>
        </Card>
      </Section>
    );
  }

  // Create a mock resource based on the ID and type
  const createMockResource = () => {
    if (type === 'guide') {
      return {
        id: resourceId,
        title: 'Privacy Guide',
        description: 'A comprehensive guide to protecting your privacy online.',
        icon: BookOpen,
        platform: 'General',
        lastUpdated: '2024-04-15',
        difficulty: 'beginner',
        timeToComplete: '30 minutes',
        sections: [
          {
            heading: 'Introduction to Privacy',
            text: 'Understanding the basics of online privacy is essential in today\'s digital world.',
            steps: [
              'Assess your current digital footprint',
              
              'Identify sensitive information you share online',
              
              'Understand the risks associated with information sharing',
              
              'Learn the fundamental principles of privacy protection'],
            tips: [
              'Use private search engines like DuckDuckGo',
              
              'Regularly check your privacy settings',
              
              'Be mindful of what you share online'],
            warnings: [
              'Once information is online, it can be difficult to completely remove',
              
              'Default privacy settings often favor sharing over protection',
              
              'Privacy policies change frequently, stay informed'
            ]
          }
        ]
      };
    } else {
      return {
        id: resourceId,
        title: 'Privacy Checklist',
        description: 'A comprehensive checklist to verify and improve your privacy settings.',
        icon: BookOpen,
        platform: 'General',
        lastUpdated: '2024-04-15',
        categories: [
          {
            name: 'Account Security',
            items: [
              {
                id: 'passwords',
                text: 'Use unique, strong passwords',
                description: 'Different password for each account',
                priority: 'high' as const,
                difficulty: 'easy' as const,
                icon: Lock
              },
              {
                id: 'two-factor',
                text: 'Enable two-factor authentication',
                description: 'Add an extra layer of security',
                priority: 'high' as const,
                difficulty: 'medium' as const,
                icon: Shield
              }
            ]
          },
          {
            name: 'Privacy Settings',
            items: [
              {
                id: 'review-settings',
                text: 'Review privacy settings',
                description: 'Review and update regularly',
                priority: 'medium' as const,
                difficulty: 'easy' as const,
                icon: Eye
              },
              {
                id: 'limit-sharing',
                text: 'Limit information sharing',
                description: 'Control what you share online',
                priority: 'high' as const,
                difficulty: 'medium' as const,
                icon: Globe
              }
            ]
          }
        ]
      };
    }
  };

  const resource = createMockResource();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Section>
        <Button
          variant="outline"
          onClick={() => navigate('/resources')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
        </Button>

        {type === 'guide' && (
          <GuideDisplay guide={resource} />
        )}

        {type === 'checklist' && (
          <ChecklistDisplay checklist={resource} />
        )}
      </Section>
    </motion.div>
  );
};

export default ResourceGuidePage;