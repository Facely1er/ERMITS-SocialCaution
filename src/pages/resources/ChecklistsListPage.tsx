import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import ChecklistsList from '../../components/resources/ChecklistsList';

const ChecklistsListPage: React.FC = () => {

  const breadcrumbs = [
    { label: 'Resources', path: '/resources' },
    { label: 'Privacy Checklists', path: '/resources/checklists' },
    { label: 'All Checklists' }
  ];

  return (
    <PageLayout
      title="All Privacy Checklists"
      subtitle="Complete Collection of Privacy Protection Checklists"
      description="Browse all available privacy protection checklists to ensure comprehensive coverage"
      breadcrumbs={breadcrumbs}
      showBreadcrumbs={true}
      heroBackground={false}
    >
      <Section
        title="Available Checklists"
        subtitle="Browse our collection of privacy protection checklists"
      >
        <ChecklistsList />
      </Section>
    </PageLayout>
  );
};

export default ChecklistsListPage;