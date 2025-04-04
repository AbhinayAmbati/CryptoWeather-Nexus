import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

interface PriceChartProps {
  data: Array<[number, number]>;
  color?: string;
}

interface ChartData {
  time: string;
  price: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, color = '#8884d8' }) => {
  // Transform the data for the chart
  const chartData: ChartData[] = data.map(([timestamp, price]) => ({
    time: new Date(timestamp).toLocaleTimeString(),
    price,
  }));

  // Format the price for the tooltip
  const formatPrice = (value: number) => {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow">
          <p className="text-sm text-gray-600">{`Time: ${label}`}</p>
          <p className="text-sm font-medium">{`Price: ${formatPrice(payload[0].value || 0)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 12 }}
          tickFormatter={(value: string) => value.split(':').slice(0, 2).join(':')}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value: number) => `$${value.toLocaleString()}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart; 