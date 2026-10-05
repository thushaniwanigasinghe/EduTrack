import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const GradeDistributionChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-xs text-gray-400 py-12">No grade records available</p>;
  }

  const gradeColors = {
    A: '#10b981', 
    B: '#6366f1', 
    C: '#f59e0b', 
    S: '#f97316', 
    F: '#ef4444', 
  };

  const activeData = data.filter((item) => item.count > 0);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={activeData.length > 0 ? activeData : data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={3}
              dataKey="count"
              nameKey="grade"
            >
              {(activeData.length > 0 ? activeData : data).map((entry) => (
                <Cell key={`cell-${entry.grade}`} fill={gradeColors[entry.grade] || '#6b7280'} />
              ))}
            </Pie>
            <Tooltip
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
              formatter={(value, name, item) => [
                <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {value} Records ({item.payload.percentage || 0}%)
                </span>,
                <span style={{ color: '#94a3b8' }}>Grade {name}</span>,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Grade Legend List */}
      <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-gray-100 dark:border-gray-700/60">
        {data.map((item) => (
          <div
            key={item.grade}
            className="flex items-center justify-between px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-xs"
          >
            <div className="flex items-center space-x-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: gradeColors[item.grade] || '#6b7280' }}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">Grade {item.grade}</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {item.count} <span className="font-normal text-gray-400">({item.percentage}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradeDistributionChart;
