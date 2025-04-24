
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ValueDistributionProps {
  data: { value: string | number; count: number }[];
}

const ValueDistribution: React.FC<ValueDistributionProps> = ({ data }) => {
  const isNumeric = typeof data[0]?.value === "number";
  
  // For numerical data with many unique values, we might want to bin it
  let chartData = data;
  
  if (isNumeric && data.length > 15) {
    // Perform simple binning by creating value ranges
    const values = data.map(d => Number(d.value));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binCount = 10;
    const binSize = (max - min) / binCount;
    
    const bins: { [key: string]: number } = {};
    
    // Create bins
    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      const binLabel = `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`;
      bins[binLabel] = 0;
    }
    
    // Fill bins
    data.forEach(d => {
      const value = Number(d.value);
      for (let i = 0; i < binCount; i++) {
        const binStart = min + i * binSize;
        const binEnd = binStart + binSize;
        if (value >= binStart && value < binEnd) {
          const binLabel = `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`;
          bins[binLabel] += d.count;
          break;
        }
      }
    });
    
    // Convert bins back to chart data format
    chartData = Object.entries(bins).map(([range, count]) => ({
      value: range,
      count
    }));
  }
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-md rounded-md">
          <p className="label">{`${label}`}</p>
          <p className="font-bold">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="chart-container">
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="value" 
            angle={-45} 
            textAnchor="end" 
            interval={0} 
            tick={{ fontSize: 10 }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#0ca4eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValueDistribution;
