import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const SubjectAverageChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-xs text-gray-400 py-12">No subject data available</p>;
  }

  const primaryColor = '#BFA2DB'; 

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
          <XAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: '#6b7180' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#6b7180' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#f1f5f9', opacity: 0.1 }}
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '0.5rem',
              color: '#ffffff',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
              padding: '8px 12px',
            }}
            itemStyle={{ color: '#ffffff', fontSize: '12px', fontWeight: '600' }}
            labelStyle={{ color: '#ffffff', fontWeight: '600' }}
            formatter={(value) => [
              <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{value} marks</span>,
              <span style={{ color: '#94a3b8' }}>Average Score</span>,
            ]}
          />
          <Bar dataKey="average" fill={primaryColor} radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubjectAverageChart;
