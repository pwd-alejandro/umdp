/**
 * Utility functions for transforming data into the format required by TimeSeriesChart
 */

export type RawDataPoint = {
  [key: string]: any;
};

export type PivotedDataPoint = {
  [key: string]: any;
};

/**
 * Transforms data from long format to wide format (pivoted)
 * 
 * @param data - Array of objects in long format
 * @param xKey - Key for the x-axis (e.g., 'year', 'date')
 * @param yKey - Key for the y-axis values
 * @param seriesKey - Key that identifies different series (e.g., 'country', 'category')
 * @returns Pivoted data ready for TimeSeriesChart
 * 
 * @example
 * // Input (long format):
 * [
 *   { year: 2015, country: 'US', gdp: 100 },
 *   { year: 2015, country: 'China', gdp: 80 },
 *   { year: 2016, country: 'US', gdp: 110 },
 *   { year: 2016, country: 'China', gdp: 90 }
 * ]
 * 
 * // Output (wide format):
 * [
 *   { year: 2015, US: 100, China: 80 },
 *   { year: 2016, US: 110, China: 90 }
 * ]
 */
export function pivotData(
  data: RawDataPoint[],
  xKey: string,
  yKey: string,
  seriesKey: string
): PivotedDataPoint[] {
  const grouped: Record<string, Record<string, any>> = {};

  data.forEach((entry) => {
    const xValue = entry[xKey];
    const seriesValue = entry[seriesKey];
    const yValue = entry[yKey];

    if (!grouped[xValue]) {
      grouped[xValue] = {};
    }
    grouped[xValue][seriesValue] = yValue;
  });

  return Object.entries(grouped).map(([xValue, values]) => ({
    [xKey]: xValue,
    ...values,
  }));
}

/**
 * Extracts unique series names from pivoted data
 * 
 * @param data - Pivoted data array
 * @param xKey - Key for the x-axis (to exclude from series names)
 * @returns Array of series names
 */
export function extractSeriesNames(data: PivotedDataPoint[], xKey: string): string[] {
  if (data.length === 0) return [];
  
  const allKeys = new Set<string>();
  data.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (key !== xKey) {
        allKeys.add(key);
      }
    });
  });
  
  return Array.from(allKeys).sort();
}

/**
 * Filters data to include only specific series
 * 
 * @param data - Pivoted data array
 * @param xKey - Key for the x-axis
 * @param seriesNames - Array of series names to include
 * @returns Filtered pivoted data
 */
export function filterSeries(
  data: PivotedDataPoint[],
  xKey: string,
  seriesNames: string[]
): PivotedDataPoint[] {
  return data.map((entry) => {
    const filtered: PivotedDataPoint = { [xKey]: entry[xKey] };
    seriesNames.forEach((seriesName) => {
      if (entry.hasOwnProperty(seriesName)) {
        filtered[seriesName] = entry[seriesName];
      }
    });
    return filtered;
  });
}

/**
 * Sorts data by x-axis values
 * 
 * @param data - Pivoted data array
 * @param xKey - Key for the x-axis
 * @param ascending - Whether to sort in ascending order (default: true)
 * @returns Sorted pivoted data
 */
export function sortByXAxis(
  data: PivotedDataPoint[],
  xKey: string,
  ascending: boolean = true
): PivotedDataPoint[] {
  return [...data].sort((a, b) => {
    const aValue = a[xKey];
    const bValue = b[xKey];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return ascending ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    return 0;
  });
}

/**
 * Validates that data is in the correct format for TimeSeriesChart
 * 
 * @param data - Data to validate
 * @param xKey - Expected x-axis key
 * @param lines - Expected line keys
 * @returns Validation result
 */
export function validateTimeSeriesData(
  data: PivotedDataPoint[],
  xKey: string,
  lines: string[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(data) || data.length === 0) {
    errors.push('Data must be a non-empty array');
    return { isValid: false, errors };
  }

  // Check if xKey exists in all data points
  const missingXKey = data.some((entry) => !entry.hasOwnProperty(xKey));
  if (missingXKey) {
    errors.push(`X-axis key '${xKey}' is missing from some data points`);
  }

  // Check if all lines exist in at least one data point
  const availableKeys = new Set<string>();
  data.forEach((entry) => {
    Object.keys(entry).forEach((key) => availableKeys.add(key));
  });

  const missingLines = lines.filter((line) => !availableKeys.has(line));
  if (missingLines.length > 0) {
    errors.push(`Lines not found in data: ${missingLines.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Creates a color mapping for series names
 * 
 * @param seriesNames - Array of series names
 * @param customColors - Optional custom colors for specific series
 * @returns Color mapping object
 */
export function createColorMapping(
  seriesNames: string[],
  customColors: Record<string, string> = {}
): Record<string, string> {
  const defaultColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6B7280',
  ];

  const colorMapping: Record<string, string> = {};
  
  seriesNames.forEach((seriesName, index) => {
    colorMapping[seriesName] = customColors[seriesName] || defaultColors[index % defaultColors.length];
  });

  return colorMapping;
} 