import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import GuidesList from '../../components/resources/GuidesList';

const GuidesListPage: React.FC = () => {

  const breadcrumbs = [
    { label: 'Resources', path: '/resources' },
    { label: 'Privacy Guides', path: '/resources/guides' },
    { label: 'All Guides' }
  ];

  return (
    <PageLayout
      title="All Privacy Guides"
      subtitle="Complete Collection of Privacy Protection Guides"
      description="Browse all available privacy protection guides for comprehensive coverage"
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

export default GuidesListPage;