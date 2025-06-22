'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Customized,
} from 'recharts';

export type LabelData = {
  key: string;
  x: number;
  y: number;
  color: string;
};

export type TimeSeriesChartProps = {
  data: Array<Record<string, any>>; // already pivoted: { year, entity1: value, entity2: value }
  lines: string[]; // list of keys to display as separate lines
  xKey: string; // typically "test_year"
  yLabel?: string;
  colors?: Record<string, string>; // optional, for consistent color mapping
  selectedLines?: string[]; // optional filtering by selected lines
  title?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  strokeWidth?: number;
  dotSize?: number;
  showDots?: boolean;
  yAxisDecimalPoints?: number;
  tooltipDecimalPoints?: number;
  onLabelPositionsCalculated?: (labelData: LabelData[]) => void;
  chartMargin?: { top: number; right: number; bottom: number; left: number };
};

// Default color palette inspired by Our World in Data
const DEFAULT_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#F97316', // orange
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#EC4899', // pink
  '#6B7280', // gray
];

// This component's only job is to calculate the raw (x, y) positions
// of the last data point for each line and pass them up to the parent.
const LabelPositionCalculator = (props: any) => {
  const { graphicalItems, onLabelPositionsCalculated } = props;
  const lastCalculatedRef = React.useRef<string>();

  React.useEffect(() => {
    if (!graphicalItems || !onLabelPositionsCalculated) return;

    const endPoints = graphicalItems
      .map((line: any) => {
        if (!line?.props?.points || line.props.points.length === 0) return null;
        const { points, dataKey, stroke } = line.props;
        const lastPoint = [...points].reverse().find((p: any) => p.payload[dataKey] != null);
        if (!lastPoint) return null;
        return { key: dataKey, x: lastPoint.x, y: lastPoint.y, color: stroke };
      })
      .filter(Boolean) as LabelData[];
    
    // Prevent infinite loop by only calling back if the data has actually changed
    const currentCalculation = JSON.stringify(endPoints);
    if (lastCalculatedRef.current !== currentCalculation) {
      onLabelPositionsCalculated(endPoints);
      lastCalculatedRef.current = currentCalculation;
    }

  }, [graphicalItems, onLabelPositionsCalculated]);

  return null; // This component does not render anything itself
};

export default function TimeSeriesChart({
  data,
  lines,
  xKey,
  yLabel,
  colors = {},
  selectedLines,
  title,
  height = 500,
  showGrid = true,
  showTooltip = true,
  strokeWidth = 2,
  dotSize = 4,
  showDots = false,
  yAxisDecimalPoints = 0,
  tooltipDecimalPoints = 1,
  onLabelPositionsCalculated,
  chartMargin = { top: 20, right: 120, left: 20, bottom: 20 },
}: TimeSeriesChartProps) {
  const displayLines = selectedLines || lines;
  
  const getLineColor = (lineKey: string, index: number) => {
    return colors[lineKey] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  };

  const yAxisTickFormatter = (value: any) => {
    if (typeof value === 'number') {
      return value.toFixed(yAxisDecimalPoints);
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-800">{`${xKey}: ${label}`}</p>
          {payload.map((entry: any, index: number) => {
            const roundedValue =
              typeof entry.value === 'number'
                ? entry.value.toFixed(tooltipDecimalPoints)
                : entry.value;

            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {`${entry.name}: ${roundedValue}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={chartMargin}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          
          <XAxis
            dataKey={xKey}
            axisLine={true}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickMargin={10}
          />
          
          <YAxis
            axisLine={true}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickMargin={10}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6B7280' } } : undefined}
            tickFormatter={yAxisTickFormatter}
          />
          
          {showTooltip && <Tooltip content={<CustomTooltip />} />}

          {onLabelPositionsCalculated && (
            <Customized component={<LabelPositionCalculator onLabelPositionsCalculated={onLabelPositionsCalculated} />} />
          )}
          
          {displayLines.map((lineKey, index) => (
            <Line
              key={lineKey}
              type="monotone"
              dataKey={lineKey}
              stroke={getLineColor(lineKey, index)}
              strokeWidth={strokeWidth}
              dot={false}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 