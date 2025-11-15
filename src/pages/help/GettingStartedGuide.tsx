import React from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useTranslationContext } from '../../hooks/useTranslationContext';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4 text-primary-800">{title}</h2>
    {children}
  </div>
);

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}

const SubSection: React.FC<SubSectionProps> = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="text-xl font-semibold mb-2 text-primary-700">{title}</h3>
    {children}
  </div>
);

interface StepListProps {
  steps: string[];
}

const StepList: React.FC<StepListProps> = ({ steps }) => (
  <ol className="list-decimal pl-6 mb-4 space-y-2">
    {steps.map((step, index) => (
      <li key={index}>{step}</li>
    ))}
  </ol>
);

interface BulletListProps {
  items: string[] | React.ReactNode[];
}

const BulletList: React.FC<BulletListProps> = ({ items }) => (
  <ul className="list-disc pl-6 mb-4 space-y-2">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

const GettingStartedGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-900">Getting Started Guide</h1>
      
      <Section title="Welcome to SocialCaution">
        <p className="mb-4">
          Thank you for choosing SocialCaution to help protect your online privacy. 
          This guide will walk you through the initial setup process and introduce 
          you to the key features of our platform.
        </p>
      </Section>
      
      <Section title="Setting Up Your Account">
        <SubSection title="1. Creating Your Profile">
          <p className="mb-2">After signing up, you'll need to complete your profile:</p>
          <BulletList 
            items={[
              <span><strong>Personal Information</strong>: We only collect minimal necessary information to customize your privacy recommendations.</span>,
              <span><strong>Social Media Connections</strong>: Link the social media accounts you want to protect.</span>,
              <span><strong>Privacy Preferences</strong>: Indicate your comfort level with different types of data sharing.</span>
            ]} 
          />
        </SubSection>
        
        <SubSection title="2. Installing the SocialCaution Browser Extension">
          <p className="mb-2">For comprehensive protection, install our browser extension:</p>
          <StepList 
            steps={[
              'Navigate to the Tools section of your dashboard',
              'Select Browser Extension',
              'Choose your browser from the dropdown menu',
              'Follow the installation instructions'
            ]} 
          />
          <p className="mb-4">
            The extension will provide privacy guidance as you browse the web and use social media.
          </p>
        </SubSection>
        
        <SubSection title="3. Completing Your First Privacy Scan">
          <p className="mb-2">To get a baseline assessment of your current privacy status:</p>
          <StepList 
            steps={[
              'From your dashboard, select New Privacy Scan',
              'Choose which connected accounts to include',
              'Select Standard Scan or Deep Scan (Premium users only)',
              'Click Begin Scan'
            ]} 
          />
          <p className="mb-4">
            Initial scans typically take 5-15 minutes depending on the number of accounts and 
            amount of content being analyzed.
          </p>
        </SubSection>
      </Section>
      
      <Section title="Understanding the Dashboard">
        <p className="mb-4">Your SocialCaution dashboard is organized into four main sections:</p>
        
        <SubSection title="Privacy Score">
          <p className="mb-2">
            The circular gauge at the top of your dashboard displays your overall Privacy Score. 
            This score ranges from 0-100, with higher scores indicating stronger privacy protection. 
            The color coding provides an at-a-glance indicator:
          </p>
          <BulletList 
            items={[
              <span><strong>Red (0-40)</strong>: Significant privacy vulnerabilities</span>,
              <span><strong>Yellow (41-70)</strong>: Moderate privacy protection</span>,
              <span><strong>Green (71-100)</strong>: Strong privacy protection</span>
            ]} 
          />
        </SubSection>
        
        <SubSection title="Account Overview">
          <p className="mb-4">
            This section shows the individual privacy scores for each connected account. 
            You can click on any account to see detailed findings and recommendations 
            specific to that platform.
          </p>
        </SubSection>
        
        <SubSection title="Recent Activity">
          <p className="mb-2">This timeline displays recent changes to your privacy status, including:</p>
          <BulletList 
            items={[
              'New permissions granted to applications',
              'Privacy setting changes on your accounts',
              'Potential privacy breaches detected'
            ]} 
          />
        </SubSection>
        
        <SubSection title="Recommended Actions">
          <p className="mb-2">
            Based on your scan results, SocialCaution provides a prioritized list of 
            recommended actions to improve your privacy. These are sorted by impact level:
          </p>
          <BulletList 
            items={[
              <span><strong>Critical</strong>: Issues requiring immediate attention</span>,
              <span><strong>Important</strong>: Significant privacy concerns</span>,
              <span><strong>Recommended</strong>: Opportunities to further enhance privacy</span>
            ]} 
          />
        </SubSection>
      </Section>
      
      <Section title="Running Your First Privacy Assessment">
        <p className="mb-2">To get the most from SocialCaution, we recommend running a comprehensive privacy assessment:</p>
        <StepList 
          steps={[
            'From your dashboard, select Assessments',
            'Click New Assessment',
            'Select all connected accounts',
            'Choose assessment type:\n- Basic Assessment: Reviews public information and basic settings\n- Standard Assessment: Analyzes permissions, apps, and content visibility\n- Advanced Assessment (Premium): Deep analysis including historical content and data sharing patterns',
            'Click Begin Assessment'
          ]} 
        />
        <p className="mb-4">
          Assessment times vary based on scope, typically taking 15-30 minutes for a full 
          Advanced Assessment across multiple platforms.
        </p>
      </Section>
      
      <Section title="Next Steps">
        <p className="mb-2">After completing your first assessment:</p>
        <StepList 
          steps={[
            'Review your detailed Privacy Assessment Report',
            'Implement the highest-priority recommendations',
            'Schedule regular reassessments (we recommend monthly)',
            'Explore the Learning Center for privacy best practices'
          ]} 
        />
        <p className="mb-2">For additional help, check out our other guides:</p>
        <BulletList 
          items={[
            <span><strong>Privacy Assessment Guide</strong>: Understanding your results</span>,
            <span><strong>Action Plan Tutorial</strong>: Implementing recommendations efficiently</span>,
            <span><strong>Platform-Specific Guides</strong>: Detailed instructions for each social network</span>
          ]} 
        />
      </Section>
      
      <Section title="Getting Support">
        <p className="mb-2">If you need assistance at any time:</p>
        <BulletList 
          items={[
            <span><strong>Help Center</strong>: Searchable knowledge base with detailed tutorials</span>,
            <span><strong>Email Support</strong>: Contact support@socialcaution.com</span>
          ]} 
        />
      </Section>
    </div>
  );
};

export default GettingStartedGuide;