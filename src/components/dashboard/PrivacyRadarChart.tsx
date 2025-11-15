import React from 'react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../common/Card';

interface PrivacyRadarChartProps {
  data: {
    category: string;
    score: number;
  }[];
}

const PrivacyRadarChart: React.FC<PrivacyRadarChartProps> = ({ data }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Privacy Score Breakdown</h3>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Radar
              name="Privacy Score"
              dataKey="score"
              stroke="#FF6B35"
              fill="#FF6B35"
              fillOpacity={0.3}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                padding: '0.5rem'
              }}
              formatter={(value: number) => [`${value}%`, 'Score']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
};

export default PrivacyRadarChart;