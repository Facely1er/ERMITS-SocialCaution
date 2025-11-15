import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  ShoppingBag, 
  Camera, 
  BookOpen,
  Heart,
  AlertTriangle,
  ArrowRight,
  // Database removed - not used
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
const PersonasPage: React.FC = () => {
  // Get personas
  const getTranslatedPersonas = () => {
    return [
        {
          id: 'cautious-parent',
          title: 'Cautious Parent',
          description: 'Protecting your family\'s digital presence and ensuring safe online experiences.',
          icon: Heart,
          color: 'bg-danger/10',
          textColor: 'text-danger',
          borderColor: 'border-danger/20'
        },
        {
          id: 'private-individual',
          title: 'Private Individual',
          description: 'Maintaining personal privacy and controlling your digital footprint.',
          icon: Shield,
          color: 'bg-accent/10',
          textColor: 'text-accent',
          borderColor: 'border-accent/20'
        },
        {
          id: 'online-shopper',
          title: 'Online Shopper',
          description: 'Securing your financial information and protecting your shopping data.',
          icon: ShoppingBag,
          color: 'bg-success/10',
          textColor: 'text-success',
          borderColor: 'border-success/20'
        },
        {
          id: 'social-influencer',
          title: 'Social Influencer',
          description: 'Balancing public presence with personal privacy and security.',
          icon: Camera,
          color: 'bg-secondary/10',
          textColor: 'text-secondary',
          borderColor: 'border-secondary/20'
        },
        {
          id: 'digital-novice',
          title: 'Digital Novice',
          description: 'Learning the basics of online privacy and digital security.',
          icon: BookOpen,
          color: 'bg-warning/10',
          textColor: 'text-warning',
          borderColor: 'border-warning/20'
        },
        {
          id: 'privacy-advocate',
          title: 'Privacy Advocate',
          description: 'Advanced privacy protection and digital rights awareness.',
          icon: Users,
          color: 'bg-primary/10',
          textColor: 'text-primary',
          borderColor: 'border-primary/20'
        },
        {
          id: 'concerned-employee',
          title: 'Concerned Employee',
          description: 'Protecting your personal data and privacy in the workplace while understanding your rights and risks.',
          icon: AlertTriangle,
          color: 'bg-warning/10',
          textColor: 'text-warning',
          borderColor: 'border-warning/20'
        }
      ];
  };

  // Get section titles and text
  const getTranslatedText = () => {
    return {
        title: "Find Your Privacy Persona",
        subtitle: "Discover personalized privacy strategies based on your unique needs and lifestyle",
        description: "Everyone's privacy needs are different. Select the profile that best matches your situation to get tailored recommendations and guidance.",
        focusAreas: "Privacy Focus Areas",
        focusAreasDescription: "Target specific privacy concerns like digital exposure, data protection, or identity security. Get tailored recommendations based on your specific needs.",
        exploreAreas: "Explore Privacy Focus Areas",
        chooseProfile: "Choose Your Privacy Profile",
        selectProfile: "Select the profile that best matches your needs to get personalized privacy recommendations and guidance.",
        viewProfile: "View Profile",
        notSure: "Not Sure Which Profile Fits You Best?",
        takeAssessment: "Take our quick assessment to discover your privacy persona and get personalized recommendations.",
        startAssessment: "Start Privacy Assessment"
    };
  };

  const personas = getTranslatedPersonas();
  const text = getTranslatedText();

  return (
    <PageLayout
      title={text.title}
      subtitle={text.subtitle}
      heroBackground={false}
      backgroundType="personas"
      breadcrumbs={[
        { label: 'Personas', path: '/personas' }
      ]}
    >
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personas.map((persona, index) => {
              const Icon = persona.icon;
              return (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/personas/${persona.id}`} className="block">
                    <Card
                      animate
                      className={`p-6 flex flex-col h-full hover:shadow-lg transition-all border ${persona.borderColor}`}
                    >
                      <div className={`${persona.color} rounded-lg w-12 h-12 flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">
                        {persona.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                        {persona.description}
                      </p>
                      <div className={`flex items-center ${persona.textColor} font-medium`}>
                        {text.viewProfile}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-12 bg-accent text-white p-8 rounded-lg text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            {text.notSure}
          </h2>
          <p className="text-white/90 mb-6">
            {text.takeAssessment}
          </p>
          <Link to="/assessment">
            <Button
              variant="primary"
              className="bg-white hover:bg-gray-100 text-accent"
            >
              {text.startAssessment}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </Section>
      
    </PageLayout>
  );
};

export default PersonasPage;