import React from 'react';
import { List, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';

interface Checklist {
  id: string;
  title: string;
  description: string;
  icon: any;
  platform: string;
  lastUpdated: string;
}

const ChecklistsList: React.FC = () => {

  // Define checklists directly in the component to ensure they're translated
  const checklists: Checklist[] = [
    {
      id: 'home-network-security',
      title: 'Home Network Security Checklist',
      description: 'Essential steps to secure your home network and protect your connected devices.',
      icon: List,
      platform: 'Network',
      lastUpdated: '2024-02-15'
    },
    {
      id: 'social-media-privacy',
      title: 'Social Media Privacy Checklist',
      description: 'Protect your privacy across social media platforms with these essential steps.',
      icon: List,
      platform: 'Social Media',
      lastUpdated: '2024-02-15'
    },
    {
      id: 'email-privacy',
      title: 'Email Privacy Checklist',
      description: 'Secure your email communications and protect sensitive information.',
      icon: List,
      platform: 'Email',
      lastUpdated: '2024-02-15'
    },
    {
      id: 'password-security',
      title: 'Password Security Checklist',
      description: 'Essential steps to create and maintain secure passwords.',
      icon: List,
      platform: 'General',
      lastUpdated: '2024-02-15'
    },
    {
      id: 'mobile-privacy',
      title: 'Mobile Privacy Checklist',
      description: 'Protect your privacy on mobile devices with these essential steps.',
      icon: List,
      platform: 'Mobile',
      lastUpdated: '2024-02-15'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {checklists.map((checklist) => (
        <Link
          key={checklist.id}
          to={`/resources/checklists/${checklist.id}`}
          className="block"
        >
          <Card
            animate
            className="p-6 flex flex-col h-full hover:shadow-lg transition-all"
          >
            <div className="flex items-start mb-4">
              <div className="p-2 bg-light-blue dark:bg-accent/20 rounded-full mr-3">
                <checklist.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-primary dark:text-white">{checklist.title}</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{checklist.description}</p>
            
            <div className="flex justify-between items-center">
              <Badge variant="secondary">
                <div className="flex items-center">
                  <List className="h-3 w-3 mr-1" />
                  Checklist
                </div>
              </Badge>
              <Badge variant="accent">{checklist.platform}</Badge>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {checklist.lastUpdated}
              </span>
              <span className="text-accent hover:text-accent-dark font-medium flex items-center">
                View Checklist
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ChecklistsList;