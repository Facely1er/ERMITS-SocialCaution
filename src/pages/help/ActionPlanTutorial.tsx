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

interface PhaseBannerProps {
  phase: string;
  timeframe: string;
  children: React.ReactNode;
}

const PhaseBanner: React.FC<PhaseBannerProps> = ({ phase, timeframe, children }) => (
  <div className="mb-6 border-l-4 border-primary-500 pl-4">
    <h3 className="text-xl font-bold text-primary-700">{phase}</h3>
    <div className="text-sm font-medium text-gray-500 mb-2">{timeframe}</div>
    <div>{children}</div>
  </div>
);

interface StepListProps {
  items: {
    title: string;
    content: React.ReactNode;
  }[];
}

const StepList: React.FC<StepListProps> = ({ items }) => (
  <div className="space-y-4 mb-6">
    {items.map((item, index) => (
      <div key={index} className="flex">
        <div className="mr-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-bold">
            {index + 1}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-1">{item.title}</h4>
          <div>{item.content}</div>
        </div>
      </div>
    ))}
  </div>
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

interface PlatformCardProps {
  platform: string;
  features: string[];
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform, features }) => (
  <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-white">
    <h4 className="font-bold mb-2">{platform}</h4>
    <ul className="list-disc pl-5 space-y-1">
      {features.map((feature, index) => (
        <li key={index} className="text-sm">{feature}</li>
      ))}
    </ul>
  </div>
);

const ActionPlanTutorial: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-900">Action Plan Tutorial</h1>
      
      <Section title="Implementing Privacy Recommendations Effectively">
        <p className="mb-4">
          This guide will walk you through the process of creating and implementing a personalized 
          privacy action plan based on your SocialCaution assessment results.
        </p>
      </Section>
      
      <Section title="Accessing Your Action Plan">
        <p className="mb-2">After completing a privacy assessment, you can access your customized action plan:</p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>From your dashboard, select the <strong>Action Plan</strong> tab</li>
          <li>Review the automatically generated plan based on your results</li>
          <li>Customize the plan according to your priorities and schedule</li>
        </ol>
      </Section>
      
      <Section title="Understanding the Action Plan Structure">
        <p className="mb-4">Your SocialCaution Action Plan organizes recommendations into three key components:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-800 text-lg mb-2">1. Quick Wins</h3>
            <p className="text-sm mb-2">High-impact, low-effort actions for immediate improvement</p>
            <ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
              <li>5 minutes or less per item</li>
              <li>Can be completed in one session</li>
              <li>Immediate privacy improvements</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-800 text-lg mb-2">2. Core Improvements</h3>
            <p className="text-sm mb-2">Fundamental changes that address significant vulnerabilities</p>
            <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
              <li>10-30 minutes per item</li>
              <li>Focus on structural improvements</li>
              <li>Target highest risk areas</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-bold text-purple-800 text-lg mb-2">3. Ongoing Practices</h3>
            <p className="text-sm mb-2">Habits and routines for sustainable privacy</p>
            <ul className="list-disc pl-5 text-sm text-purple-700 space-y-1">
              <li>Regular maintenance activities</li>
              <li>Scheduled reviews and updates</li>
              <li>Privacy awareness education</li>
            </ul>
          </div>
        </div>
        
        <SubSection title="1. Quick Wins">
          <p className="mb-2">
            These are high-impact, low-effort actions that can significantly improve your privacy with minimal time investment:
          </p>
          <BulletList 
            items={[
              'Typically require 5 minutes or less per item',
              'Can often be completed in a single session',
              'Provide immediate privacy improvements',
              <span>Examples include:
                <ul className="list-disc pl-5 mt-1">
                  <li>Updating specific privacy settings</li>
                  <li>Revoking unused app permissions</li>
                  <li>Adjusting audience settings for future posts</li>
                </ul>
              </span>
            ]} 
          />
        </SubSection>
        
        <SubSection title="2. Core Improvements">
          <p className="mb-2">These actions address fundamental privacy vulnerabilities:</p>
          <BulletList 
            items={[
              'Typically require 10-30 minutes per item',
              'Focus on structural privacy improvements',
              'Target the most significant risk areas identified in your assessment',
              <span>Examples include:
                <ul className="list-disc pl-5 mt-1">
                  <li>Performing a historical content review</li>
                  <li>Implementing privacy settings across platforms</li>
                  <li>Setting up advanced security features</li>
                </ul>
              </span>
            ]} 
          />
        </SubSection>
        
        <SubSection title="3. Ongoing Practices">
          <p className="mb-2">These recommendations establish sustainable privacy habits:</p>
          <BulletList 
            items={[
              'Regular activities to maintain privacy',
              'Scheduled reviews and updates',
              'Educational components to improve privacy awareness',
              <span>Examples include:
                <ul className="list-disc pl-5 mt-1">
                  <li>Monthly permission audits</li>
                  <li>Quarterly content reviews</li>
                  <li>Privacy setting checks after platform updates</li>
                </ul>
              </span>
            ]} 
          />
        </SubSection>
      </Section>
      
      <Section title="Step-by-Step Implementation Guide">
        <p className="mb-6">Follow this phased approach to implement your privacy action plan effectively:</p>
        
        <PhaseBanner phase="Phase 1: Preparation" timeframe="1-2 days">
          <StepList 
            items={[
              {
                title: "Review Your Complete Action Plan",
                content: (
                  <BulletList 
                    items={[
                      'Familiarize yourself with all recommended actions',
                      'Understand the priority levels and expected impact',
                      'Note any recommendations you may want to modify or exclude'
                    ]} 
                  />
                )
              },
              {
                title: "Schedule Implementation Sessions",
                content: (
                  <>
                    <p className="mb-2">Block dedicated time for privacy improvements</p>
                    <p className="mb-1">We recommend:</p>
                    <BulletList 
                      items={[
                        'One 30-minute session for Quick Wins',
                        'Two 1-hour sessions for Core Improvements',
                        '15 minutes weekly for Ongoing Practices'
                      ]} 
                    />
                  </>
                )
              },
              {
                title: "Install Necessary Tools",
                content: (
                  <BulletList 
                    items={[
                      'SocialCaution Browser Extension',
                      'SocialCaution Mobile App (if applicable)',
                      'Any platform-specific security tools recommended in your plan'
                    ]} 
                  />
                )
              }
            ]} 
          />
        </PhaseBanner>
        
        <PhaseBanner phase="Phase 2: Quick Wins Implementation" timeframe="30 minutes">
          <StepList 
            items={[
              {
                title: "Access the Quick Wins Section",
                content: (
                  <BulletList 
                    items={[
                      'From your Action Plan, select the "Quick Wins" tab',
                      'Review the step-by-step instructions for each item'
                    ]} 
                  />
                )
              },
              {
                title: "Use One-Click Actions",
                content: (
                  <BulletList 
                    items={[
                      'Many quick wins can be implemented directly through SocialCaution',
                      'Look for the "Fix Now" button next to eligible items',
                      'Follow the guided process to implement changes'
                    ]} 
                  />
                )
              },
              {
                title: "Track Your Progress",
                content: (
                  <BulletList 
                    items={[
                      'Check off completed items',
                      'Watch your Privacy Score update in real-time',
                      'Note any quick wins that require additional attention'
                    ]} 
                  />
                )
              }
            ]} 
          />
        </PhaseBanner>
        
        <PhaseBanner phase="Phase 3: Core Improvements Implementation" timeframe="1-2 weeks">
          <StepList 
            items={[
              {
                title: "Prioritize Core Improvements",
                content: (
                  <BulletList 
                    items={[
                      'Sort recommendations by impact (default)',
                      'Consider adjusting based on your personal concerns',
                      'Focus on one platform or issue category at a time'
                    ]} 
                  />
                )
              },
              {
                title: "Follow Detailed Tutorials",
                content: (
                  <BulletList 
                    items={[
                      'Each core improvement includes a detailed tutorial',
                      'Use the "Show Me How" feature for visual guidance',
                      'Reference platform-specific documentation when needed'
                    ]} 
                  />
                )
              },
              {
                title: "Validate Changes",
                content: (
                  <BulletList 
                    items={[
                      'After implementing each improvement, verify its effectiveness',
                      'Use the "Verify" feature to confirm changes are active',
                      'Address any implementation issues before proceeding'
                    ]} 
                  />
                )
              }
            ]} 
          />
        </PhaseBanner>
        
        <PhaseBanner phase="Phase 4: Establishing Ongoing Practices" timeframe="Continuous">
          <StepList 
            items={[
              {
                title: "Set Up Automated Reminders",
                content: (
                  <BulletList 
                    items={[
                      'Configure privacy maintenance reminders',
                      'Customize frequency based on your preferences',
                      'Link calendar appointments to specific practice guides'
                    ]} 
                  />
                )
              },
              {
                title: "Create Privacy Review Routines",
                content: (
                  <BulletList 
                    items={[
                      'Establish a consistent schedule for privacy reviews',
                      'Use our guided review workflows',
                      'Document baseline settings for comparison'
                    ]} 
                  />
                )
              },
              {
                title: "Enable Monitoring Features",
                content: (
                  <BulletList 
                    items={[
                      'Activate relevant privacy monitoring alerts',
                      'Configure notification preferences',
                      'Set sensitivity thresholds for different alert types'
                    ]} 
                  />
                )
              }
            ]} 
          />
        </PhaseBanner>
      </Section>
      
      <Section title="Advanced Implementation Strategies">
        <SubSection title="Platform-Specific Approaches">
          <p className="mb-4">Your action plan includes tailored strategies for each connected platform:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <PlatformCard 
              platform="Facebook Privacy Implementation"
              features={[
                'Profile visibility modifications',
                'Historical content review techniques',
                'Custom audience setting configurations',
                'App permission management'
              ]}
            />
            
            <PlatformCard 
              platform="Instagram Privacy Implementation"
              features={[
                'Story and post visibility settings',
                'Account discovery controls',
                'Third-party content tagging management',
                'Direct message privacy features'
              ]}
            />
            
            <PlatformCard 
              platform="Twitter/X Privacy Implementation"
              features={[
                'Tweet visibility options',
                'Profile discoverability settings',
                'Data sharing preferences',
                'Interaction privacy controls'
              ]}
            />
            
            <PlatformCard 
              platform="LinkedIn Privacy Implementation"
              features={[
                'Professional network visibility',
                'Activity broadcast settings',
                'Profile data controls',
                'Recruiter and marketing preferences'
              ]}
            />
          </div>
        </SubSection>
        
        <SubSection title="Addressing Special Circumstances">
          <p className="mb-4">Your action plan can be adjusted for specific situations:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-bold mb-2">Professional Social Media Users</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Balancing public visibility with privacy</li>
                <li>Segmenting personal and professional content</li>
                <li>Implementing strategic limited sharing</li>
              </ul>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-bold mb-2">Parents and Guardians</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Family account management</li>
                <li>Child privacy protection features</li>
                <li>Age-appropriate privacy settings</li>
              </ul>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-bold mb-2">High-Privacy-Need Individuals</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Maximum privacy configurations</li>
                <li>Advanced anonymization techniques</li>
                <li>Comprehensive data minimization approaches</li>
              </ul>
            </div>
          </div>
        </SubSection>
      </Section>
      
      <Section title="Measuring Action Plan Effectiveness">
        <p className="mb-2">After implementing recommendations, evaluate their impact:</p>
        
        <div className="space-y-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold mb-2 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-800 font-bold text-sm mr-2">1</span>
              Run a Verification Scan
            </h4>
            <BulletList 
              items={[
                'Select "Verify Actions" from your Action Plan',
                'Review confirmed changes and outstanding issues',
                'Address any implementation errors'
              ]} 
            />
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold mb-2 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-800 font-bold text-sm mr-2">2</span>
              Compare Privacy Scores
            </h4>
            <BulletList 
              items={[
                'Review your before-and-after Privacy Scores',
                'Examine improvements in specific categories',
                'Identify areas requiring additional attention'
              ]} 
            />
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold mb-2 flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-800 font-bold text-sm mr-2">3</span>
              Schedule Your Next Assessment
            </h4>
            <BulletList 
              items={[
                'Set a date for your next comprehensive privacy assessment',
                'We recommend reassessment every 3-6 months',
                'Add interim checks for high-risk categories'
              ]} 
            />
          </div>
        </div>
      </Section>
      
      <Section title="Support Resources">
        <p className="mb-2">If you encounter challenges implementing your action plan:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 className="font-bold mb-2 text-primary-700">Live Implementation Support</h4>
            <p className="text-sm">Available for Premium users</p>
          </div>
          
          
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 className="font-bold mb-2 text-primary-700">Guided Walkthroughs</h4>
            <p className="text-sm">Interactive tutorials for complex changes</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 className="font-bold mb-2 text-primary-700">Platform-Specific Guides</h4>
            <p className="text-sm">Detailed documentation for each social network</p>
          </div>
        </div>
        
        <p className="mt-6 italic">
          Remember that privacy is an ongoing process. Your Action Plan is a living document 
          that should evolve as platforms change and your privacy needs develop.
        </p>
      </Section>
    </div>
  );
};

export default ActionPlanTutorial;

