import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Shield, Users } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Free',
      description: 'Perfect for getting started with privacy protection',
      price: 'Free',
      unit: '',
      icon: Shield,
      features: [
        { text: 'Privacy assessment', included: true },
        { text: 'Multiple platform support', included: true },
        { text: 'Basic recommendations', included: true },
        { text: 'Educational resources', included: true },
        { text: 'Privacy tips and guides', included: true },
        { text: 'Detailed reports', included: false },
        { text: 'Continuous monitoring', included: false },
        { text: 'Priority support', included: false },
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Advanced features for comprehensive privacy protection',
      price: '$9.99',
      unit: 'month',
      icon: Shield,
      features: [
        { text: 'Privacy assessment', included: true },
        { text: 'Multiple platform support', included: true },
        { text: 'Advanced recommendations', included: true },
        { text: 'Educational resources', included: true },
        { text: 'Privacy tips and guides', included: true },
        { text: 'Detailed reports', included: true },
        { text: 'Continuous monitoring', included: true },
        { text: 'Priority support', included: false },
      ],
    },
    {
      id: 'family',
      name: 'Family',
      description: 'Protect your entire family with one plan',
      price: '$19.99',
      unit: 'month',
      icon: Users,
      features: [
        { text: 'Privacy assessment', included: true },
        { text: 'Multiple platform support', included: true },
        { text: 'Advanced recommendations', included: true },
        { text: 'Educational resources', included: true },
        { text: 'Privacy tips and guides', included: true },
        { text: 'Detailed reports', included: true },
        { text: 'Continuous monitoring', included: true },
        { text: 'Priority support', included: true },
      ],
    },
  ];

  return (
    <PageLayout
      title="Pricing"
      subtitle="Choose the plan that's right for you"
      heroBackground={true}
      heroType="animated"
      backgroundType="pricing"
      breadcrumbs={[
        { label: 'Pricing', path: '/pricing' }
      ]}
    >

      <Section
        centered
      >
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 dark:bg-background-secondary p-1 rounded-lg inline-flex">
            <button
              className={`py-2 px-4 rounded-md ${
                !isAnnual
                  ? 'bg-white dark:bg-card shadow-sm text-primary dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white'
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={`py-2 px-4 rounded-md ${
                isAnnual
                  ? 'bg-white dark:bg-card shadow-sm text-primary dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white'
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual <span className="text-xs text-accent font-medium">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              animate
              className="p-6 flex flex-col"
            >

              <div className="mb-6">
                <div className="inline-flex items-center justify-center bg-light-blue dark:bg-accent/20 rounded-full p-3 mb-4">
                  <plan.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary dark:text-white mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary dark:text-white">
                    {plan.price === 'Free'
                      ? plan.price
                      : isAnnual
                        ? `$${(parseFloat(plan.price.replace('$', '')) * 12 * 0.8).toFixed(2)}`
                        : plan.price
                    }
                  </span>
                  {plan.price !== 'Free' && (
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      /{isAnnual ? 'year' : plan.unit}
                    </span>
                  )}
                </div>
                {isAnnual && plan.price !== 'Free' && (
                  <p className="text-xs text-accent mt-1">
                    Save 20%
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  if (plan.price === 'Free') {
                    navigate('/assessment');
                  } else {
                    // For paid plans, could navigate to a subscription page or show a modal
                    // For now, navigate to assessment as well
                    navigate('/assessment');
                  }
                }}
              >
                {plan.price === 'Free' ? 'Get Started' : 'Subscribe'}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-primary dark:text-white mb-8 text-center">Frequently Asked Questions</h3>

          <div className="space-y-6">
            <div className="bg-white dark:bg-card rounded-lg shadow-card p-5">
              <h4 className="font-semibold text-primary dark:text-white mb-2">Can I change my plan later?</h4>
              <p className="text-gray-600 dark:text-gray-300">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg shadow-card p-5">
              <h4 className="font-semibold text-primary dark:text-white mb-2">How many accounts can I add?</h4>
              <p className="text-gray-600 dark:text-gray-300">The Free plan supports one account. Premium supports up to 3 accounts, and Family supports up to 5 accounts.</p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg shadow-card p-5">
              <h4 className="font-semibold text-primary dark:text-white mb-2">What is your refund policy?</h4>
              <p className="text-gray-600 dark:text-gray-300">We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.</p>
            </div>

            <div className="bg-white dark:bg-card rounded-lg shadow-card p-5">
              <h4 className="font-semibold text-primary dark:text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600 dark:text-gray-300">We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through our payment partners.</p>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default PricingPage;
