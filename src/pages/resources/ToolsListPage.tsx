import React from 'react';
import { Shield, Database, FileText, Lock, Eye, Search } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import { Link } from 'react-router-dom';

const ToolsListPage: React.FC = () => {
  const tools = [
    {
      id: 'digital-footprint',
      title: 'Digital Footprint Analyzer',
      description: 'Discover and analyze your online presence across the internet.',
      icon: Eye,
      path: '/resources/tools/digital-footprint',
      features: ['Online presence analysis', 'Risk assessment', 'Privacy recommendations']
    },
    {
      id: 'cookie-tracker',
      title: 'Cookie & Tracker Scanner',
      description: 'Discover what trackers are monitoring your activity on any website.',
      icon: Search,
      path: '/resources/tools/cookie-tracker',
      features: ['Cookie analysis', 'Tracker detection', 'Privacy risk assessment']
    },
    {
      id: 'data-broker-removal',
      title: 'Data Broker Removal Tool',
      description: 'Remove your data from data brokers and take back control of your personal information.',
      icon: Database,
      path: '/resources/tools/data-broker-removal',
      features: [
        'Removal request tracking',
        'Ongoing monitoring',
        'Verification reminders'
      ]
    },
    {
      id: 'personal-data-inventory',
      title: 'Personal Data Inventory',
      description: 'Create a comprehensive inventory of your personal data to better understand what is collected and shared.',
      icon: FileText,
      path: '/resources/tools/personal-data-inventory',
      features: [
        'Data mapping',
        'Sensitivity assessment',
        'Protection planning'
      ]
    },
    {
      id: 'privacy-assessment',
      title: 'Privacy Assessment Tool',
      description: 'Assess your privacy protection level and get personalized recommendations.',
      icon: Shield,
      path: '/resources/tools/privacy-assessment',
      features: [
        'Privacy scoring',
        'Detailed analysis',
        'Personalized recommendations'
      ]
    },
    {
      id: 'privacy-simulator',
      title: 'Privacy Simulator',
      description: 'Simulate different privacy scenarios to understand the impact of your settings.',
      icon: Lock,
      path: '/resources/tools/privacy-simulator',
      features: [
        'Scenario simulation',
        'Interactive guidance',
        'Impact visualization'
      ]
    }
  ];

  return (
    <PageLayout
      title="Privacy Tools"
      subtitle="Interactive tools to help you protect and manage your privacy"
      description="Discover and use our comprehensive suite of privacy tools designed to help you assess, protect, and manage your digital privacy effectively."
      heroBackground={false}
      backgroundType="toolkit"
      breadcrumbs={[
        { label: 'Resources', path: '/resources' },
        { label: 'Tools', path: '/resources/tools' }
      ]}
    >
      <Section
        title="Privacy Tools"
        subtitle="Interactive tools to help you protect and manage your privacy"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="block"
              >
                <Card
                  animate
                  className="p-6 flex flex-col h-full hover:shadow-lg transition-all"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-accent/10 rounded-full mr-3">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-text dark:text-white">{tool.title}</h3>
                  </div>
                  
                  <p className="text-text-secondary dark:text-gray-300 mb-4 flex-grow">{tool.description}</p>
                  
                  <ul className="space-y-2">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-text-secondary dark:text-gray-300">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
          <p>Note: Some tools require initial setup</p>
          <p>Follow the provided instructions for each tool to get started.</p>
        </div>
      </Section>
    </PageLayout>
  );
};

export default ToolsListPage;
