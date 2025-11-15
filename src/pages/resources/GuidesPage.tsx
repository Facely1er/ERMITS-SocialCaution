import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import GuidesList from '../../components/resources/GuidesList';

const GuidesPage: React.FC = () => {

  const breadcrumbs = [
    { label: 'Resources', path: '/resources' },
    { label: 'Privacy Guides' }
  ];

  return (
    <PageLayout
      title="Privacy Guides"
      subtitle="Comprehensive Privacy Protection Guides"
      description="Step-by-step guides to help you protect your privacy and understand your rights"
      breadcrumbs={breadcrumbs}
      showBreadcrumbs={true}
      heroBackground={false}
    >
      <Section
        title="Available Guides"
        subtitle="Browse our collection of privacy protection guides"
      >
        <GuidesList />
      </Section>
    </PageLayout>
  );
};

export default GuidesPage;