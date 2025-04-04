import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PriceChartProps {
  data: Array<[number, number]>;
  color?: string;
}

interface ChartData {
  [key: string]: string | number;
  time: string;
  price: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, color = "#8884d8" }) => {
  // Transform the data for the chart
  const chartData: ChartData[] = data.map(([timestamp, price]) => ({
    time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    price: Number(price.toFixed(2)),
  }));

  // Format the price for the tooltip
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10 }}
            tickFormatter={(value: string) => value}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            tickFormatter={(value: number) => formatPrice(value)}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            formatter={(value: number) => [formatPrice(value), 'Price']}
            labelFormatter={(label: string) => `Time: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              padding: '0.5rem',
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
