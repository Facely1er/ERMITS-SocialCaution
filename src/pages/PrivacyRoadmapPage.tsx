import React from 'react';
// motion removed - not used
import { 
  Map, 
  ArrowRight, 
  Target, 
  Calendar, 
  TrendingUp, 
  Clock,
  FileText,
  Users,
  Settings,
  BarChart3
} from 'lucide-react';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import RoadmapNav from '../components/navigation/RoadmapNav';
import { Link } from 'react-router-dom';
const PrivacyRoadmapPage: React.FC = () => {
  // Get roadmap steps
  const getTranslatedRoadmapSteps = () => {
    return [
        {
          id: 'assessment',
          title: 'Initial Assessment',
          description: 'Analyze your current privacy situation',
          icon: BarChart3,
          color: 'bg-blue-500',
          duration: '15 min'
        },
        {
          id: 'planning',
          title: 'Planning',
          description: 'Create your personalized roadmap',
          icon: Map,
          color: 'bg-green-500',
          duration: '10 min'
        },
        {
          id: 'implementation',
          title: 'Implementation',
          description: 'Execute protection actions',
          icon: Settings,
          color: 'bg-yellow-500',
          duration: 'Variable'
        },
        {
          id: 'monitoring',
          title: 'Monitoring',
          description: 'Monitor and adjust your protection',
          icon: TrendingUp,
          color: 'bg-purple-500',
          duration: 'Ongoing'
        }
      ];
  };

  // Get text
  const getTranslatedText = () => {
    return {
        title: "Your Privacy Roadmap",
        subtitle: "A personalized plan to improve your privacy protection",
        description: "Create a step-by-step roadmap to improve your privacy protection. Our system analyzes your specific needs and guides you through the most important actions.",
        startRoadmap: "Start Your Roadmap",
        viewDashboard: "View Your Dashboard",
        roadmapSteps: "Roadmap Steps",
        benefitsTitle: "Benefits of Privacy Roadmap",
        readyToStart: "Ready to Create Your Roadmap?",
        beginWithAssessment: "Begin with a comprehensive assessment to create your personalized roadmap.",
        takeAssessment: "Create My Roadmap"
    };
  };

  const roadmapSteps = getTranslatedRoadmapSteps();
  const text = getTranslatedText();

  return (
    <div className="min-h-screen">
      <Section>
        <div className="flex flex-col lg:flex-row gap-8">
          <RoadmapNav />
          
          <div className="flex-1">
            <div className="mb-12">
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/2">
                    <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
                      {text.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {text.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to="/assessment">
                        <Button variant="primary">
                          {text.startRoadmap}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to="/dashboard">
                        <Button variant="outline">
                          {text.viewDashboard}
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <div className="bg-light-blue/10 dark:bg-card-hover p-4 rounded-lg">
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-accent mt-1 mr-3" />
                        <div>
                          <h3 className="font-medium text-primary dark:text-white mb-2">
                            {'Why a Roadmap?'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {'A privacy roadmap helps you organize and prioritize your privacy protection efforts in a structured and efficient way.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

        {/* Roadmap Steps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
            {text.roadmapSteps}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapSteps.map((step, index) => (
              <Card key={step.id} className="p-6">
                <div className="relative mb-4">
                  <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white`}>
                    {React.createElement(step.icon, { className: "h-6 w-6" })}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{step.description}</p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {step.duration}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
            {text.benefitsTitle}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-start">
                <div className="p-3 bg-accent/10 rounded-full mr-4">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">
                    {'Clear Goals'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {'Define specific and measurable privacy goals for your situation.'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start">
                <div className="p-3 bg-accent/10 rounded-full mr-4">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">
                    {'Structured Planning'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {'Organize your privacy actions into a realistic and manageable timeline.'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start">
                <div className="p-3 bg-accent/10 rounded-full mr-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">
                    {'Progress Tracking'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {'Monitor your privacy improvements and celebrate your successes.'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start">
                <div className="p-3 bg-accent/10 rounded-full mr-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">
                    {'Personalized Support'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {'Receive advice and support tailored to your specific needs.'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="p-8 bg-accent text-white">
            <h2 className="text-2xl font-bold mb-4">{text.readyToStart}</h2>
            <p className="text-lg mb-6">
              {text.beginWithAssessment}
            </p>
            <Link to="/assessment">
              <Button variant="primary" className="bg-white text-accent hover:bg-gray-100 shadow-lg hover:shadow-xl">
                {text.takeAssessment}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Card>
        </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default PrivacyRoadmapPage;
