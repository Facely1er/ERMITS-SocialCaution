import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import PrivacyActionCenter from '../components/dashboard/PrivacyActionCenter';

const PrivacyActionCenterPage: React.FC = () => {
  return (
    <PageLayout
      title="Privacy Risk Exposure & Rights Action Center™"
      subtitle="Comprehensive Privacy Protection Platform"
      description="Get real-time insights into your privacy exposure, understand your rights, and take action to protect your data."
      heroBackground={false}
      backgroundType="privacy"
      breadcrumbs={[
        { label: 'Privacy Action Center', path: '/privacy-action-center' }
      ]}
    >
      <Section>
        <div className="max-w-6xl mx-auto">
          <PrivacyActionCenter
            riskScore={65}
            rightsScore={45}
            recommendations={[
              {
                id: 'weak-passwords',
                title: 'Weak Password Security',
                description: 'Your passwords may be vulnerable. Strengthen your password security to protect your accounts.',
                priority: 'high',
                type: 'risk'
              },
              {
                id: 'data-sharing',
                title: 'Excessive Data Sharing',
                description: 'Your data is being shared with third parties. Review and limit data sharing permissions.',
                priority: 'medium',
                type: 'rights'
              },
              {
                id: 'third-party-access',
                title: 'Third-Party App Access',
                description: 'Multiple third-party apps have access to your data. Review and revoke unnecessary access.',
                priority: 'high',
                type: 'risk'
              }
            ]}
            lastAssessment={new Date().toISOString()}
          />
        </div>
      </Section>
    </PageLayout>
  );
};

export default PrivacyActionCenterPage;