# TimeSeriesChart Component

A reusable and scalable line chart component for time series data visualization, inspired by Our World in Data. Built with React and Recharts.

## Features

- 🎨 **Customizable**: Extensive styling and configuration options
- 🎯 **Type-safe**: Full TypeScript support with proper type definitions
- 📊 **Responsive**: Automatically adapts to container size
- 🎨 **Beautiful**: Modern design with custom tooltips and legends
- 🔧 **Flexible**: Support for custom colors, filtering, and various display options
- 📱 **Accessible**: Proper ARIA labels and keyboard navigation support

## Installation

The component is built on top of `recharts`. Make sure you have it installed:

```bash
npm install recharts
```

## Basic Usage

```tsx
import TimeSeriesChart from './components/TimeSeriesChart';

const data = [
  { year: 2015, GDP: 100, Population: 50 },
  { year: 2016, GDP: 110, Population: 52 },
  { year: 2017, GDP: 120, Population: 54 },
];

function MyChart() {
  return (
    <TimeSeriesChart
      data={data}
      lines={['GDP', 'Population']}
      xKey="year"
      title="Economic Indicators"
      yLabel="Value (Index)"
    />
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `Array<Record<string, any>>` | Array of data points. Each object should have the x-axis key and values for each line |
| `lines` | `string[]` | Array of keys from the data objects that should be displayed as lines |
| `xKey` | `string` | The key in the data objects that represents the x-axis (typically "year" or "date") |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `yLabel` | `string` | `undefined` | Label for the y-axis |
| `colors` | `Record<string, string>` | `{}` | Custom colors for specific lines |
| `selectedLines` | `string[]` | `undefined` | Filter to show only specific lines |
| `title` | `string` | `undefined` | Chart title |
| `height` | `number` | `500` | Chart height in pixels |
| `showGrid` | `boolean` | `true` | Whether to show the grid |
| `showLegend` | `boolean` | `true` | Whether to show the legend |
| `showTooltip` | `boolean` | `true` | Whether to show tooltips |
| `strokeWidth` | `number` | `2` | Width of the line strokes |
| `dotSize` | `number` | `4` | Size of data point dots |
| `showDots` | `boolean` | `false` | Whether to show data point dots |

## Data Format

The component expects data in a "pivoted" format where each row represents a time point and columns represent different metrics:

```tsx
const data = [
  { year: 2015, 'Country A': 100, 'Country B': 80, 'Country C': 60 },
  { year: 2016, 'Country A': 110, 'Country B': 85, 'Country C': 65 },
  { year: 2017, 'Country A': 120, 'Country B': 90, 'Country C': 70 },
];
```

## Examples

### Basic Chart

```tsx
<TimeSeriesChart
  data={data}
  lines={['GDP', 'Population']}
  xKey="year"
  title="Economic Indicators"
  yLabel="Value"
/>
```

### Custom Colors

```tsx
<TimeSeriesChart
  data={data}
  lines={['United States', 'China', 'Germany']}
  xKey="year"
  colors={{
    'United States': '#3B82F6',
    'China': '#EF4444',
    'Germany': '#10B981',
  }}
  title="GDP Comparison"
/>
```

### Filtered Lines

```tsx
<TimeSeriesChart
  data={data}
  lines={['US', 'China', 'Germany', 'Japan']}
  selectedLines={['US', 'China']}
  xKey="year"
  title="US vs China Comparison"
/>
```

### Minimal Configuration

```tsx
<TimeSeriesChart
  data={data}
  lines={['GDP']}
  xKey="year"
  showGrid={false}
  showLegend={false}
  height={300}
/>
```

### With Data Points

```tsx
<TimeSeriesChart
  data={data}
  lines={['Population', 'Exports']}
  xKey="year"
  showDots={true}
  dotSize={6}
  strokeWidth={3}
/>
```

## Color Palette

The component includes a default color palette inspired by Our World in Data:

- Blue: `#3B82F6`
- Red: `#EF4444`
- Green: `#10B981`
- Yellow: `#F59E0B`
- Purple: `#8B5CF6`
- Orange: `#F97316`
- Cyan: `#06B6D4`
- Lime: `#84CC16`
- Pink: `#EC4899`
- Gray: `#6B7280`

## Customization

### Custom Tooltip

The component includes a custom tooltip that displays:
- The x-axis value (e.g., year)
- Each line's value with its corresponding color

### Custom Legend

The legend is positioned below the chart and shows:
- Color indicators for each line
- Line names
- Responsive layout that wraps on smaller screens

### Styling

The component uses Tailwind CSS classes for styling. You can customize the appearance by:

1. Modifying the component's CSS classes
2. Using the `colors` prop for line colors
3. Adjusting the `strokeWidth`, `dotSize`, and other visual props

## Best Practices

1. **Data Preparation**: Ensure your data is properly pivoted before passing it to the component
2. **Color Consistency**: Use the `colors` prop to maintain consistent colors across different charts
3. **Performance**: For large datasets, consider filtering data before passing it to the component
4. **Accessibility**: The component includes proper ARIA labels and keyboard navigation
5. **Responsive Design**: The component automatically adapts to its container size

## Migration from Existing LineChart

If you're migrating from the existing `LineChart.tsx`, you can replace it with:

```tsx
// Old usage
<DepartamentoLineChart />

// New usage
<TimeSeriesChart
  data={data}
  lines={departamentos}
  xKey="test_year"
  yLabel="Promedio de puntaje"
  title="Promedios por departamento"
  selectedLines={selectedDepartamentos.length ? selectedDepartamentos : undefined}
/>
```

## TypeScript Support

The component includes full TypeScript support with proper type definitions:

```tsx
import { TimeSeriesChartProps } from './components/TimeSeriesChart';

// You can use the type for your own components
const MyChart: React.FC<TimeSeriesChartProps> = (props) => {
  // Your implementation
};
```

## Contributing

When extending the component:

1. Maintain backward compatibility
2. Add proper TypeScript types for new props
3. Include examples in the documentation
4. Test with various data formats and edge cases 