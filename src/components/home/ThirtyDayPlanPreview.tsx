import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Shield, Clock, CheckCircle, ArrowRight, Users, Lock, Database } from 'lucide-react';
import Section from '../common/Section';
import Card from '../common/Card';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
const ThirtyDayPlanPreview: React.FC = () => {
  const navigate = useNavigate();

  const weeks = [
    {
      week: 1,
      title: 'Foundation & Assessment',
      description: 'Establish your privacy baseline and identify key vulnerabilities.',
      tasks: 7,
      color: 'bg-blue-500',
      icon: Shield,
      sampleTasks: [
        'Complete privacy assessment',
        'Review social media settings',
        'Check password security'
      ]
    },
    {
      week: 2,
      title: 'Social Media & Accounts',
      description: 'Secure your online accounts and social media presence.',
      tasks: 7,
      color: 'bg-purple-500',
      icon: Users,
      sampleTasks: [
        'Update privacy settings',
        'Enable two-factor authentication',
        'Review app permissions'
      ]
    },
    {
      week: 3,
      title: 'Data Protection',
      description: 'Protect your personal data from data brokers and trackers.',
      tasks: 7,
      color: 'bg-green-500',
      icon: Lock,
      sampleTasks: [
        'Remove data from brokers',
        'Install privacy tools',
        'Configure browser settings'
      ]
    },
    {
      week: 4,
      title: 'Advanced Security',
      description: 'Implement advanced security measures and monitoring.',
      tasks: 9,
      color: 'bg-orange-500',
      icon: Database,
      sampleTasks: [
        'Set up monitoring alerts',
        'Review and update policies',
        'Create backup security plan'
      ]
    }
  ];

  const sampleDailyTasks = [
    { day: 'Day 1', task: 'Complete Privacy Assessment', difficulty: 'Easy', time: '10 min' },
    { day: 'Day 7', task: 'Review Social Media Settings', difficulty: 'Medium', time: '20 min' },
    { day: 'Day 21', task: 'Remove Data from Brokers', difficulty: 'Medium', time: '30 min' }
  ];

  return (
    <Section 
      title="30-Day Privacy Protection Plan"
      subtitle="A structured roadmap to improve your privacy in just 30 days"
      className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Journey Phase Integration */}
        <div className="mb-12">
          <Card className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-primary dark:text-white mb-4">
                Integrated with Your Privacy Journey
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                This plan aligns with your privacy journey phases, helping you progress from discovery to ongoing protection
              </p>
            </div>
            
            {/* Journey Phase Indicators */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <span className="text-sm">Discover</span>
              </div>
              <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <span className="text-sm">Learn</span>
              </div>
              <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2 text-accent">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <span className="text-sm font-semibold">Protect</span>
              </div>
              <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                <span className="text-sm">Monitor</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Week Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {weeks.map((week, index) => (
            <motion.div
              key={week.week}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className={`w-16 h-16 ${week.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  <week.icon className="h-8 w-8" />
                </div>
                <div className="text-sm font-medium text-accent mb-2">Week {week.week}</div>
                <h3 className="text-xl font-bold text-primary dark:text-white mb-2">{week.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">{week.description}</p>
                <div className="text-sm text-accent font-medium">{week.tasks} Daily Tasks</div>
                
                {/* Sample tasks for this week */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Sample Tasks</div>
                  <div className="space-y-1">
                    {week.sampleTasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="text-xs text-gray-600 dark:text-gray-300">
                        • {task}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Daily Task Preview */}
        <Card className="p-8 mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
            Sample Daily Tasks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleDailyTasks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-sm font-medium text-accent mb-2">{item.day}</div>
                <div className="font-semibold text-primary dark:text-white mb-2">{item.task}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {item.difficulty} • {item.time}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Benefits Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
            Why This Plan Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Structured Approach',
                description: 'Daily tasks organized by priority and difficulty level'
              },
              {
                icon: Clock,
                title: 'Manageable Time',
                description: 'Each task takes 10-30 minutes, fitting into your schedule'
              },
              {
                icon: CheckCircle,
                title: 'Proven Results',
                description: 'Based on privacy best practices and real-world effectiveness'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-primary dark:text-white mb-2">{benefit.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => navigate('/30-day-roadmap')}
            className="px-8 py-4 text-lg group"
          >
            <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Start Your 30-Day Plan
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
            Free • No signup required • Start today
          </p>
        </motion.div>
      </div>
    </Section>
  );
};

export default ThirtyDayPlanPreview;
