import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const data = [{ name: 'score', value: score, fill: '#10b981' }]; // Emerald-500

  // Dynamic color based on score
  let color = '#10b981'; // Green
  if (score < 50) color = '#ef4444'; // Red
  else if (score < 80) color = '#f59e0b'; // Amber

  data[0].fill = color;

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={20}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={30 / 2}
            fill={color}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-4">
        <span className="text-6xl font-bold text-slate-800">{score}</span>
        <span className="block text-slate-400 font-medium uppercase tracking-wider text-sm mt-1">Overall Score</span>
      </div>
    </div>
  );
};