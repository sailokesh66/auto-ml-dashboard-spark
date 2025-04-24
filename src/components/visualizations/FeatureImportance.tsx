
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { FeatureImportance } from "../../context/AutoMLContext";

interface FeatureImportanceChartProps {
  data: FeatureImportance[];
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ data }) => {
  // Sort data by importance in descending order
  const sortedData = [...data].sort((a, b) => b.importance - a.importance);
  
  return (
    <div className="chart-container">
      <ResponsiveContainer>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" domain={[0, 'dataMax']} />
          <YAxis 
            type="category" 
            dataKey="feature" 
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => [`Importance: ${value.toFixed(3)}`, 'Feature Importance']}
            labelFormatter={(label) => `Feature: ${label}`}
          />
          <Bar dataKey="importance" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureImportanceChart;
