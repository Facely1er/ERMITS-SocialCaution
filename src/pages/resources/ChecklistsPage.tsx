import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import ChecklistsList from '../../components/resources/ChecklistsList';

const ChecklistsPage: React.FC = () => {

  const breadcrumbs = [
    { label: 'Resources', path: '/resources' },
    { label: 'Privacy Checklists' }
  ];

  return (
    <PageLayout
      title="Privacy Checklists"
      subtitle="Privacy Protection Checklists"
      description="Use these checklists to ensure you've covered all the essential privacy protection steps"
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

export default ChecklistsPage;