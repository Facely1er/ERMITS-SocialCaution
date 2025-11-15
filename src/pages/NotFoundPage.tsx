import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Button from '../components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <PageLayout
      title="404: Page Not Found"
      subtitle="Oops! The page you're looking for seems to have vanished into the digital void."
      heroBackground={false}
      showBreadcrumbs={false}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Section centered>
        <div className="text-center max-w-lg mx-auto">
          <div className="mb-8">
            <AlertCircle className="h-20 w-20 text-accent mx-auto mb-6" />
            <p className="text-gray-600 mb-8">
              Let's get you back to safety.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link to="/">
              <Button variant="primary" fullWidth className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Homepage
              </Button>
            </Link>
            
            <p className="text-sm text-gray-500">
              Need help? <Link to="/contact" className="text-accent hover:underline">Contact our support team</Link>
            </p>
          </div>
        </div>
        </Section>
      </motion.div>
    </PageLayout>
  );
};

export default NotFoundPage;