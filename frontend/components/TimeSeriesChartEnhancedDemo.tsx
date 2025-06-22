'use client';

import React, { useEffect, useState } from 'react';
import TimeSeriesChart, { LabelData } from './TimeSeriesChart';
import { 
  pivotData, 
  extractSeriesNames, 
  filterSeries, 
  sortByXAxis, 
  validateTimeSeriesData,
  createColorMapping,
  PivotedDataPoint,
} from './utils/dataTransformers';
import { LineLabelsOverlay } from './LineLabelsOverlay';

type RawDataPoint = {
  test_year: number;
  residence_depto_name: string;
  avg_score: number;
};

export default function TimeSeriesChartEnhancedDemo() {
  const [rawData, setRawData] = useState<RawDataPoint[]>([]);
  const [pivotedData, setPivotedData] = useState<PivotedDataPoint[]>([]);
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [selectedDepartamentos, setSelectedDepartamentos] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [labelData, setLabelData] = useState<LabelData[]>([]);

  useEffect(() => {
    setMounted(true);

    fetch("http://localhost:8000/average-by-year-and-departamento")
      .then((res) => res.json())
      .then((rawData) => {
        setRawData(rawData);
        
        const pivoted = pivotData(rawData, 'test_year', 'avg_score', 'residence_depto_name');
        const sorted = sortByXAxis(pivoted, 'test_year', true);
        const seriesNames = extractSeriesNames(sorted, 'test_year');
        
        setPivotedData(sorted);
        setDepartamentos(seriesNames);
        
        const validation = validateTimeSeriesData(sorted, 'test_year', seriesNames);
        if (validation.errors.length > 0) {
          console.error("Data validation errors:", validation.errors);
        }
        setValidationErrors(validation.errors);
      });
  }, []);

  if (!mounted) return null;

  const colorMapping = createColorMapping(departamentos, customColors);

  const displayData = selectedDepartamentos.length > 0 
    ? filterSeries(pivotedData, 'test_year', selectedDepartamentos)
    : pivotedData;
  
  const displayLines = selectedDepartamentos.length > 0 ? selectedDepartamentos : departamentos;
  const chartMargin = { top: 20, right: 120, left: 20, bottom: 20 };

  return (
    <div className="space-y-6 p-6">
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Enhanced TimeSeriesChart with Utility Functions
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 relative">
            <TimeSeriesChart
              data={displayData}
              lines={displayLines}
              xKey="test_year"
              yLabel="Promedio de puntaje"
              colors={colorMapping}
              title="Promedios por departamento (Enhanced) v11"
              height={500}
              onLabelPositionsCalculated={setLabelData}
              chartMargin={chartMargin}
            />
            <LineLabelsOverlay labelData={labelData} chartMargin={chartMargin} />
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2 text-sm text-gray-600">Data Information</h3>
              <div className="text-sm space-y-1">
                <p><strong>Total records:</strong> {rawData.length}</p>
                <p><strong>Time points:</strong> {pivotedData.length}</p>
                <p><strong>Departments:</strong> {departamentos.length}</p>
                <p><strong>Selected:</strong> {selectedDepartamentos.length}</p>
              </div>
            </div>

            <div className="border rounded p-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full text-left font-semibold text-gray-700 flex justify-between items-center"
              >
                <span>Modificar selección de regiones</span>
                <svg
                  className={`w-5 h-5 transition-transform ${showFilters ? 'transform rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {showFilters && (
              <div className="border rounded p-4 max-h-[400px] overflow-y-auto">
                <h3 className="font-semibold mb-2 text-sm text-gray-600">Editar departamentos</h3>
                <input
                  type="text" placeholder="Buscar..."
                  className="w-full border px-2 py-1 mb-3 rounded text-sm"
                  onChange={(e) => setSearch(e.target.value.toLowerCase())}
                />
                <button
                  className="text-xs text-blue-600 underline mb-2"
                  onClick={() => setSelectedDepartamentos([])}
                >
                  Limpiar selección
                </button>
                {departamentos
                  .filter((d) => d.toLowerCase().includes(search))
                  .map((depto) => {
                    const checked = selectedDepartamentos.includes(depto);
                    const toggle = () => {
                      setSelectedDepartamentos((prev) =>
                        checked ? prev.filter((d) => d !== depto) : [...prev, depto]
                      );
                    };
                    return (
                      <label key={depto} className="block cursor-pointer text-sm mb-1">
                        <input type="checkbox" checked={checked} onChange={toggle} className="mr-2" />
                        <span style={{ color: colorMapping[depto] }}>
                          {depto.charAt(0).toUpperCase() + depto.slice(1)}
                        </span>
                      </label>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const customColors = {
  'Montevideo': '#3B82F6',
  'Canelones': '#EF4444',
  'Maldonado': '#10B981',
}; 