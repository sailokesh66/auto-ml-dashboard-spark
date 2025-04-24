
import React, { useEffect, useRef } from "react";
import { ResponsiveContainer, XAxis, YAxis, Scatter, ScatterChart, ZAxis, Tooltip, Cell } from "recharts";

interface CorrelationHeatmapProps {
  data: {
    x: string;
    y: string;
    correlation: number;
  }[];
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ data }) => {
  // Group data by x values for domain calculation
  const xValues = Array.from(new Set(data.map(item => item.x)));
  const yValues = Array.from(new Set(data.map(item => item.y)));
  
  // Custom tooltip for heatmap cells
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-2 border shadow-md rounded-md text-xs">
          <p>{`${item.x} - ${item.y}`}</p>
          <p className="font-bold">{`Correlation: ${item.correlation.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  // Color scale function based on correlation value
  const getColor = (correlation: number) => {
    const value = Math.abs(correlation);
    
    // Use different colors for positive and negative correlations
    if (correlation >= 0) {
      return `rgba(12, 164, 235, ${value.toFixed(2)})`;
    }
    return `rgba(236, 72, 153, ${value.toFixed(2)})`;
  };
  
  return (
    <div className="chart-container">
      <ResponsiveContainer>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 70, left: 70 }}
        >
          <XAxis 
            type="category" 
            dataKey="x" 
            name="Feature" 
            allowDuplicatedCategory={false} 
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis 
            type="category" 
            dataKey="y" 
            name="Feature" 
            allowDuplicatedCategory={false} 
            tick={{ fontSize: 10 }}
          />
          <ZAxis 
            type="number" 
            dataKey="correlation" 
            range={[100, 100]} 
            domain={[-1, 1]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data} shape="square">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={getColor(entry.correlation)} 
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CorrelationHeatmap;
