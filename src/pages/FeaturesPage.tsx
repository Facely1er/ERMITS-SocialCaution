import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Lock, Settings, Users, Globe, Trash2, ClipboardList, BarChart3, AlertTriangle, Scale, Check, X } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
// MatrixBackground removed - not used

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  // const canvasRef = useRef<HTMLCanvasElement>(null); // Removed unused variable

  const features = [
    {
      icon: Search,
      title: "Learn About Data Exposure",
      problem: "Don't know where data is exposed",
      solution: "Educational tools to understand exposure points",
      color: "bg-accent",
      benefits: ["Learn about common risks", "Educational assessment tools", "Understand privacy factors", "Access learning resources"]
    },
    {
      icon: Trash2,
      title: "Data Broker Education",
      problem: "Brokers profit without permission",
      solution: "Learn about data brokers and removal process",
      color: "bg-primary",
      benefits: ["Learn about major brokers", "Understand removal process", "Get educational guidance", "Access learning resources"]
    },
    {
      icon: ClipboardList,
      title: "Privacy Planning Education",
      problem: "Don't know where to start",
      solution: "Educational resources for privacy planning",
      color: "bg-success",
      benefits: ["Learn about privacy rights", "Educational guidance", "Access learning resources", "Understand legal options"]
    },
    {
      icon: BarChart3,
      title: "Privacy Assessment Education",
      problem: "Can't measure vulnerability",
      solution: "Educational tools for privacy assessment",
      color: "bg-warning",
      benefits: ["Learn about risk factors", "Educational assessment tools", "Access learning resources", "Understand privacy concepts"]
    },
    {
      icon: AlertTriangle,
      title: "Data Breach Education",
      problem: "Find out about breaches months later",
      solution: "Learn about breach response and monitoring",
      color: "bg-danger",
      benefits: ["Learn about breach monitoring", "Educational guidance", "Access learning resources", "Understand response strategies"]
    },
    {
      icon: Scale,
      title: "Privacy Rights Education",
      problem: "Companies ignore requests",
      solution: "Learn about privacy laws and rights",
      color: "bg-accent",
      benefits: ["Learn about privacy laws", "Educational resources", "Access learning materials", "Understand legal concepts"]
    }
  ];

  const benefits = [
    {
      icon: Lock,
      title: 'Comprehensive Protection',
      description: 'Complete privacy assessment and protection tools for all aspects of your digital life'
    },
    {
      icon: Settings,
      title: 'Easy Management',
      description: 'Simple tools and interfaces to manage your privacy settings and data'
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Get personalized recommendations and guidance from privacy experts'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Support for privacy laws and regulations worldwide'
    }
  ];

  return (
    <PageLayout
      title="Features"
      subtitle="Comprehensive Privacy Protection"
      description="Discover all the tools and features we offer to help you protect your digital privacy"
      heroBackground={true}
      heroType="animated"
      backgroundType="features"
      breadcrumbs={[
        { label: 'Features', path: '/features' }
      ]}
    >

      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
            Comprehensive Privacy Protection
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete privacy assessment and protection tools for all aspects of your digital life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary dark:text-white">{feature.title}</h3>
                </div>
                <div className="mb-4 space-y-3">
                  <div className="relative bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-1.5 bg-red-500/10 rounded-lg">
                        <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <p className="text-sm text-red-900 dark:text-red-100 font-medium leading-relaxed flex-1">
                        {feature.problem}
                      </p>
                    </div>
                  </div>
                  <div className="relative bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 border-l-4 border-green-500 rounded-r-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-1.5 bg-green-500/10 rounded-lg">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-green-900 dark:text-green-100 font-medium leading-relaxed flex-1">
                        {feature.solution}
                      </p>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {feature.benefits?.map((benefit, i) => (
                    <li key={i} className="flex items-start text-gray-600 dark:text-gray-300">
                      <Check className="h-4 w-4 text-accent mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="bg-light-blue dark:bg-background-secondary rounded-2xl p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
              Why Choose SocialCaution?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We provide comprehensive privacy protection tools and education to help you take control of your digital life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-white dark:bg-card w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <benefit.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
            Ready to Start Your Privacy Journey?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Take the first step towards better privacy protection with our comprehensive assessment tools
          </p>
          
          {/* Educational Disclaimer */}
          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-4xl mx-auto">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-4 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-2 text-lg">Educational Platform - What We Provide</p>
                <p className="mb-2">Social Caution is an educational platform that helps you learn about privacy through:</p>
                <ul className="list-disc list-inside mb-2 space-y-1">
                  <li>Privacy assessments and educational tools</li>
                  <li>Learning resources and guides</li>
                  <li>Privacy awareness and best practices</li>
                  <li>Educational content about data rights</li>
                </ul>
                <p className="mb-2">We do NOT provide:</p>
                <ul className="list-disc list-inside mb-2 space-y-1">
                  <li>Real-time monitoring or active protection services</li>
                  <li>Automated data removal or privacy setting changes</li>
                  <li>Guaranteed privacy protection or security</li>
                  <li>Professional legal or security advice</li>
                </ul>
                <p>Our platform is designed for education and awareness. For active protection services, consult with qualified privacy professionals.</p>
              </div>
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={() => navigate('/assessment')}
            className="text-lg px-8"
          >
            Start Your Assessment
          </Button>
        </div>
      </Section>
    </PageLayout>
  );
};

export default FeaturesPage;
