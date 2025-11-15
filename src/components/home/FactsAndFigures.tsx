import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Database } from 'lucide-react';
import Section from '../../components/common/Section';

const FactsAndFigures: React.FC = () => {
  const stats = [
    {
      value: '$10.5T',
      label: 'Annual Cybercrime Cost',
      description: 'Global cost of cybercrime expected to reach $10.5 trillion annually by 2025',
      source: 'Cybersecurity Ventures',
      icon: Shield,
      color: 'bg-accent/10 text-accent'
    },
    {
      value: '$4.88M',
      label: 'Average Data Breach Cost',
      description: 'Average cost of a data breach for organizations worldwide',
      source: 'IBM Security Report 2023',
      icon: AlertTriangle,
      color: 'bg-warning/10 text-warning'
    },
    {
      value: '353M+',
      label: 'People Affected',
      description: 'Over 353 million people affected by data breaches in 2023 alone',
      source: 'Statista',
      icon: Database,
      color: 'bg-danger/10 text-danger'
    },
    {
      value: '75%',
      label: 'Privacy Laws Coverage',
      description: '75% of the world\'s population will be covered by modern privacy regulations by 2024',
      source: 'Gartner',
      icon: Shield,
      color: 'bg-success/10 text-success'
    }
  ];

  return (
    <Section
      title="The State of Privacy Today"
      subtitle={
        <div className="space-y-3 max-w-3xl mx-auto">
          <p className="text-xl text-accent font-semibold">The Numbers Don't Lie</p>
          <p className="text-gray-600 dark:text-gray-300">Privacy threats are growing at an unprecedented rate. Here's what the data tells us:</p>
        </div>
      }
      centered
      className="section-gray py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-white dark:bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <motion.div
                className={`absolute top-0 left-0 w-2 h-full ${
                  index === 0 ? 'bg-accent' :
                  index === 1 ? 'bg-warning' :
                  index === 2 ? 'bg-danger' :
                  'bg-success'
                } rounded-l-xl`}
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              />
              
              <div className="flex items-start mb-4">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <motion.div
                className="text-3xl font-bold text-primary dark:text-white mb-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {stat.value}
              </motion.div>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {stat.label}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                {stat.description}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                {stat.source}
              </p>

              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-accent/50"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                viewport={{ once: true }}
              />
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
};

export default FactsAndFigures;