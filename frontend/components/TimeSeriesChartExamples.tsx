'use client';

import React from 'react';
import TimeSeriesChart from './TimeSeriesChart';

// Example data for different scenarios
const sampleData = [
  { year: 2015, GDP: 100, Population: 50, Exports: 30 },
  { year: 2016, GDP: 110, Population: 52, Exports: 35 },
  { year: 2017, GDP: 120, Population: 54, Exports: 40 },
  { year: 2018, GDP: 115, Population: 56, Exports: 38 },
  { year: 2019, GDP: 130, Population: 58, Exports: 45 },
  { year: 2020, GDP: 125, Population: 60, Exports: 42 },
  { year: 2021, GDP: 140, Population: 62, Exports: 50 },
  { year: 2022, GDP: 150, Population: 64, Exports: 55 },
];

const countryData = [
  { year: 2015, 'United States': 100, 'China': 80, 'Germany': 60, 'Japan': 70 },
  { year: 2016, 'United States': 105, 'China': 85, 'Germany': 62, 'Japan': 72 },
  { year: 2017, 'United States': 110, 'China': 90, 'Germany': 65, 'Japan': 75 },
  { year: 2018, 'United States': 108, 'China': 95, 'Germany': 68, 'Japan': 78 },
  { year: 2019, 'United States': 115, 'China': 100, 'Germany': 70, 'Japan': 80 },
  { year: 2020, 'United States': 112, 'China': 105, 'Germany': 72, 'Japan': 82 },
  { year: 2021, 'United States': 120, 'China': 110, 'Germany': 75, 'Japan': 85 },
  { year: 2022, 'United States': 125, 'China': 115, 'Germany': 78, 'Japan': 88 },
];

export default function TimeSeriesChartExamples() {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        TimeSeriesChart Component Examples
      </h1>

      {/* Basic Example */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Example</h2>
        <TimeSeriesChart
          data={sampleData}
          lines={['GDP', 'Population', 'Exports']}
          xKey="year"
          title="Economic Indicators Over Time"
          yLabel="Value (Index)"
        />
      </div>

      {/* Custom Colors Example */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Custom Colors</h2>
        <TimeSeriesChart
          data={countryData}
          lines={['United States', 'China', 'Germany', 'Japan']}
          xKey="year"
          colors={{
            'United States': '#3B82F6',
            'China': '#EF4444',
            'Germany': '#10B981',
            'Japan': '#F59E0B',
          }}
          title="GDP Comparison by Country"
          yLabel="GDP (Index)"
        />
      </div>

      {/* Minimal Example */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Minimal Configuration</h2>
        <TimeSeriesChart
          data={sampleData}
          lines={['GDP']}
          xKey="year"
          showGrid={false}
          showLegend={false}
          height={300}
        />
      </div>

      {/* With Dots Example */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">With Data Points</h2>
        <TimeSeriesChart
          data={sampleData}
          lines={['Population', 'Exports']}
          xKey="year"
          title="Population vs Exports"
          yLabel="Value"
          showDots={true}
          dotSize={6}
          strokeWidth={3}
        />
      </div>

      {/* Selected Lines Example */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Filtered Lines</h2>
        <TimeSeriesChart
          data={countryData}
          lines={['United States', 'China', 'Germany', 'Japan']}
          selectedLines={['United States', 'China']}
          xKey="year"
          title="US vs China GDP Comparison"
          yLabel="GDP (Index)"
          colors={{
            'United States': '#3B82F6',
            'China': '#EF4444',
          }}
        />
      </div>

      {/* No Tooltip Example */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">No Tooltip</h2>
        <TimeSeriesChart
          data={sampleData}
          lines={['GDP', 'Population']}
          xKey="year"
          title="GDP and Population Trends"
          yLabel="Value"
          showTooltip={false}
        />
      </div>
    </div>
  );
} 