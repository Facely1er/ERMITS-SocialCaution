import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';

interface Guide {
  id: string;
  title: string;
  description: string;
  icon: any;
  platform: string;
  timeToComplete: string;
  lastUpdated: string;
}

const GuidesList: React.FC = () => {

  // Define guides directly in the component to ensure they're translated
  const guides: Guide[] = [
    {
      id: 'understanding-privacy',
      title: 'Understanding Your Privacy Rights',
      description: 'Learn about your digital footprint and how to protect your personal information online.',
      icon: BookOpen,
      platform: 'General',
      timeToComplete: '30 minutes',
      lastUpdated: '2024-02-15'
    },
    {
      id: 'social-media-security',
      title: 'Social Media Security Guide',
      description: 'Comprehensive guide to securing your social media accounts and protecting your online presence.',
      icon: BookOpen,
      platform: 'Social Media',
      timeToComplete: '45 minutes',
      lastUpdated: '2024-02-15'
    },
    {
      id: 'email-security',
      title: 'Email Security Best Practices',
      description: 'Learn how to secure your email communications and protect sensitive information.',
      icon: BookOpen,
      platform: 'Email',
      timeToComplete: '1 hour',
      lastUpdated: '2024-02-15'
    },
    {
      id: 'mobile-privacy',
      title: 'Mobile Device Privacy Guide',
      description: 'Protect your privacy on smartphones and tablets with these comprehensive steps.',
      icon: BookOpen,
      platform: 'Mobile',
      timeToComplete: '1 hour',
      lastUpdated: '2024-02-15'
    },
    {
      id: 'password-management',
      title: 'Password Management Guide',
      description: 'Learn how to create, store, and manage secure passwords effectively.',
      icon: BookOpen,
      platform: 'General',
      timeToComplete: '30 minutes',
      lastUpdated: '2024-02-15'
    },
    {
      id: 'vpn-setup',
      title: 'VPN Setup Guide',
      description: 'Learn how to choose, set up, and use a VPN to protect your internet traffic.',
      icon: BookOpen,
      platform: 'Network',
      timeToComplete: '30 minutes',
      lastUpdated: '2024-02-15'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {guides.map((guide) => (
        <Link
          key={guide.id}
          to={`/resources/guides/${guide.id}`}
          className="block"
        >
          <Card
            animate
            className="p-6 flex flex-col h-full hover:shadow-lg transition-all"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-light-blue dark:bg-accent/20 rounded-full mr-3">
                <guide.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-primary dark:text-white">{guide.title}</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{guide.description}</p>
            
            <div className="flex justify-between items-center">
              <Badge variant="primary">
                <div className="flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Guide
                </div>
              </Badge>
              <Badge variant="accent">{guide.platform}</Badge>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {guide.timeToComplete}
              </span>
              <span className="text-accent hover:text-accent-dark font-medium flex items-center">
                Read Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default GuidesList;