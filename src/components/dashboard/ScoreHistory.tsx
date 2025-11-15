import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

interface ScoreHistoryProps {
  data: Array<{
    date: string;
    score: number;
  }>;
}

const ScoreHistory: React.FC<ScoreHistoryProps> = ({ data }) => {
  const formattedData = data.map(entry => ({
    ...entry,
    formattedDate: format(new Date(entry.date), 'MMM yyyy')
  }));

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Score History</h3>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 12, fill: '#666' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: '#666' }}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                padding: '0.5rem'
              }}
              formatter={(value: number) => [`${value}%`, 'Score']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#FF6B35"
              strokeWidth={2}
              dot={{
                fill: '#FF6B35',
                stroke: 'white',
                strokeWidth: 2,
                r: 4
              }}
              activeDot={{
                fill: '#FF6B35',
                stroke: 'white',
                strokeWidth: 2,
                r: 6
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-sm text-gray-500">Initial Score</p>
          <p className="text-lg font-semibold text-primary">
            {data[0]?.score}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Current Score</p>
          <p className="text-lg font-semibold text-accent">
            {data[data.length - 1]?.score}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Improvement</p>
          <p className="text-lg font-semibold text-success">
            +{data[data.length - 1]?.score - data[0]?.score}%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ScoreHistory;