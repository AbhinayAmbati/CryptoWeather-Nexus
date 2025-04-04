declare module 'recharts' {
  import * as React from 'react';

  export interface CartesianGridProps {
    strokeDasharray?: string;
    stroke?: string;
  }

  export interface TickProps {
    fontSize?: number;
  }

  export interface XAxisProps {
    dataKey?: string;
    tick?: TickProps;
    tickFormatter?: (value: string) => string;
    allowDataOverflow?: boolean;
    interval?: string | number;
  }

  export interface YAxisProps {
    tick?: TickProps;
    tickFormatter?: (value: number) => string;
    domain?: string[];
  }

  export interface TooltipProps<T, N> {
    content?: React.ComponentType<TooltipContentProps<T, N>>;
    active?: boolean;
    payload?: Array<{ value: T; name: N }>;
    label?: string;
    formatter?: (value: T) => [string, string];
    labelFormatter?: (label: string) => string;
    contentStyle?: React.CSSProperties;
  }

  export interface TooltipContentProps<T, N> {
    active?: boolean;
    payload?: Array<{ value: T; name: N }>;
    label?: string;
  }

  export interface LineProps {
    type?: string;
    dataKey?: string;
    stroke?: string;
    strokeWidth?: number;
    dot?: boolean;
    activeDot?: { r: number; fill?: string };
  }

  export interface LineChartProps {
    data?: Array<{ [key: string]: string | number }>;
    children?: React.ReactNode;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
  }

  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    children?: React.ReactNode;
  }

  export const CartesianGrid: React.FC<CartesianGridProps>;
  export const XAxis: React.FC<XAxisProps>;
  export const YAxis: React.FC<YAxisProps>;
  export const Tooltip: React.FC<TooltipProps<number, string>>;
  export const Line: React.FC<LineProps>;
  export const LineChart: React.FC<LineChartProps>;
  export const ResponsiveContainer: React.FC<ResponsiveContainerProps>;
} 