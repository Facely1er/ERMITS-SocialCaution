import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Lightbulb, Lock, CheckCircle, ArrowRight, Eye, Database, Bell, AlertTriangle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import '../../styles/home.css';

// Helper component for progress bars without inline styles
const ProgressBar: React.FC<{ width: number; className: string; cssVarName: string }> = ({ width, className, cssVarName }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty(cssVarName, `${width}%`);
    }
  }, [width, cssVarName]);

  return <div ref={ref} className={className} />;
};

const PrivacyJourneyDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const getTranslatedSteps = () => {
    return [
        {
          id: 'discover',
          title: 'Discover',
          description: 'Identify your privacy vulnerabilities',
          icon: Search,
          color: 'bg-blue-500',
          metrics: [
            { label: 'Data Exposure', value: 75, color: 'bg-red-500' },
            { label: 'Privacy Score', value: 45, color: 'bg-orange-500' },
            { label: 'Security Level', value: 30, color: 'bg-red-500' }
          ],
          insights: [
            'Your data is exposed on 12 data broker sites',
            'Social media privacy settings need attention',
            'Password security is at high risk'
          ]
        },
        {
          id: 'learn',
          title: 'Learn',
          description: 'Understand your privacy rights and options',
          icon: Lightbulb,
          color: 'bg-yellow-500',
          resources: [
            { title: 'Privacy Rights Guide', icon: Eye },
            { title: 'Data Broker Removal', icon: Database },
            { title: 'Security Best Practices', icon: Lock }
          ]
        },
        {
          id: 'protect',
          title: 'Protect',
          description: '30-day structured plan with daily privacy tasks',
          icon: Shield,
          color: 'bg-green-500',
          actions: [
            { title: 'Week 1: Foundation Security', status: 'completed' },
            { title: 'Week 2: Social Media Privacy', status: 'completed' },
            { title: 'Week 3: Advanced Protection', status: 'in-progress' },
            { title: 'Week 4: Data Control & Monitoring', status: 'pending' }
          ],
          roadmap: {
            totalDays: 30,
            completedDays: 14,
            currentWeek: 3,
            nextTask: "Enable encryption on your devices"
          }
        },
        {
          id: 'monitor',
          title: 'Monitor',
          description: 'Stay protected with continuous monitoring',
          icon: Bell,
          color: 'bg-purple-500',
          alerts: [
            { type: 'Data Breach', date: '2 days ago', severity: 'high' },
            { type: 'Privacy Setting Change', date: '1 week ago', severity: 'medium' },
            { type: 'New Data Broker Listing', date: '2 weeks ago', severity: 'medium' }
          ],
          improvements: [
            { metric: 'Privacy Score', before: 45, after: 82 },
            { metric: 'Data Exposure', before: 75, after: 15 },
            { metric: 'Security Level', before: 30, after: 90 }
          ]
        }
      ];
  };

  const steps = getTranslatedSteps();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentStep(current => (current + 1) % steps.length);
            return 0;
          }
          return prev + 1;
        });
      }, 50);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  useEffect(() => {
    setProgress(0);
  }, [currentStep]);

  // Update CSS variables for progress line
  useEffect(() => {
    if (progressLineRef.current) {
      const progressWidth = (currentStep / (steps.length - 1)) * 100;
      progressLineRef.current.style.setProperty('--progress-width', `${progressWidth}%`);
    }
  }, [currentStep, steps.length]);

  // Update CSS variables for progress bar
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.setProperty('--progress-bar-width', `${progress}%`);
    }
  }, [progress]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setProgress(0);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="pt-8 mb-6 text-center">
        <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
          {"Your Privacy Journey"}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {"Experience how our platform guides you through each step of your privacy protection journey"}
        </p>
      </div>

      {/* Journey Steps Navigation */}
      <div className="flex justify-between mb-6 relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0">
          <div 
            ref={progressLineRef}
            className="h-full bg-accent transition-all duration-300 privacy-journey-progress-line"
          ></div>
        </div>

        {steps.map((step, index) => (
          <motion.button
            key={step.id}
            className={`relative z-10 flex flex-col items-center`}
            onClick={() => handleStepClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              index <= currentStep ? step.color : 'bg-gray-300 dark:bg-gray-600'
            } text-white mb-2 transition-colors duration-300`}>
              {React.createElement(step.icon, { className: "h-6 w-6" })}
            </div>
            <span className={`text-sm font-medium ${
              index === currentStep ? 'text-accent' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {step.title}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Current Step Content */}
      <Card className="p-4 md:p-6 mb-6 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className={`p-3 ${currentStepData.color} rounded-full mr-4 text-white`}>
              {React.createElement(currentStepData.icon, { className: "h-6 w-6" })}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary dark:text-white">{currentStepData.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{currentStepData.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsPlaying(!isPlaying)}
              size="sm"
            >
              {isPlaying ? 
                ("Pause") : 
                ("Play")}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleStepClick((currentStep + 1) % steps.length)}
              size="sm"
            >
              {"Next"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
          <motion.div 
            ref={progressBarRef}
            className={`h-full ${currentStepData.color} privacy-journey-progress-bar`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Step-specific content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[300px]"
        >
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary dark:text-white mb-4">
                  {"Privacy Metrics"}
                </h4>
                <div className="space-y-4">
                  {currentStepData.metrics?.map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <ProgressBar
                          width={metric.value}
                          className={`h-full ${metric.color} privacy-journey-metric-bar`}
                          cssVarName="--metric-width"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-primary dark:text-white mb-4">
                  {"Key Insights"}
                </h4>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                  <ul className="space-y-2">
                    {currentStepData.insights?.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-800 dark:text-gray-200">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 text-center">
                  <Button variant="primary" size="sm">
                    {"Run Full Privacy Scan"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h4 className="font-semibold text-primary dark:text-white mb-4">
                {"Privacy Resources"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStepData.resources?.map((resource, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-3">
                      {React.createElement(resource.icon, { className: "h-5 w-5 text-yellow-500 mr-2" })}
                      <h5 className="font-medium text-primary dark:text-white">{resource.title}</h5>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">
                        {"Learn More"}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-primary dark:text-white mb-1">
                      {"Did You Know?"}
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300">
                      {"Under the GDPR and CCPA, you have the right to request deletion of your personal data from companies. Our guides show you exactly how to exercise these rights."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h4 className="font-semibold text-primary dark:text-white mb-4">
                {"30-Day Privacy Action Plan"}
              </h4>
              
              {/* Roadmap Progress */}
              {'roadmap' in currentStepData && currentStepData.roadmap && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-green-800 dark:text-green-300">
                      {"30-Day Plan Progress"}
                    </h5>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {currentStepData.roadmap.completedDays}/{currentStepData.roadmap.totalDays} {"days"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
                    <ProgressBar
                      width={(currentStepData.roadmap.completedDays / currentStepData.roadmap.totalDays) * 100}
                      className="bg-green-500 h-3 rounded-full transition-all duration-300 privacy-journey-roadmap-progress"
                      cssVarName="--roadmap-progress-width"
                    />
                  </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      {`Week ${currentStepData.roadmap.currentWeek} • Next task: ${currentStepData.roadmap.nextTask}`}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {currentStepData.actions?.map((action, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border flex items-center justify-between ${
                      action.status === 'completed' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : action.status === 'in-progress'
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      {action.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      ) : action.status === 'in-progress' ? (
                        <motion.div 
                          className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 rounded-full mr-3" />
                      )}
                      <span className={`font-medium ${
                        action.status === 'completed' 
                          ? 'text-green-700 dark:text-green-300' 
                          : action.status === 'in-progress'
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {action.title}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={action.status === 'completed'}
                    >
                      {action.status === 'completed' ? 
                        ("Completed") : 
                        ("Take Action")}
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="primary">
                  {"View Complete 30-Day Plan"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary dark:text-white mb-4">
                  {"Privacy Alerts"}
                </h4>
                <div className="space-y-3">
                  {currentStepData.alerts?.map((alert, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border ${
                        alert.severity === 'high' 
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                      }`}
                    >
                      <div className="flex items-start">
                        <AlertTriangle className={`h-5 w-5 ${
                          alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                        } mr-2 mt-0.5`} />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">{alert.type}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {"Detected "}{alert.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-primary dark:text-white mb-4">
                  {"Your Progress"}
                </h4>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                  <h5 className="font-medium text-green-800 dark:text-green-300 mb-3">
                    {"Privacy Improvements"}
                  </h5>
                  {currentStepData.improvements?.map((improvement, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{improvement.metric}</span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          {improvement.before}% → {improvement.after}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <ProgressBar
                          width={improvement.after}
                          className="h-full bg-green-500 rounded-full privacy-journey-improvement-bar"
                          cssVarName="--improvement-width"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="primary" size="sm">
                    {"View Full Privacy Report"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </Card>

      <div className="text-center">
        <Link to="/30-day-roadmap">
          <Button variant="primary" className="px-6">
            {"Start Your 30-Day Plan"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PrivacyJourneyDemo;