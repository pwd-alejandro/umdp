'use client';

import { useEffect, useState } from 'react';
import TimeSeriesChart from './TimeSeriesChart';

type DataPoint = {
  test_year: number;
  [departamento: string]: number | string;
};

export default function TimeSeriesChartDemo() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [selectedDepartamentos, setSelectedDepartamentos] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/average-by-year-and-departamento")
      .then((res) => res.json())
      .then((rawData) => {
        // Pivot data: {year, depto, score} → {year, depto1: score, depto2: score, ...}
        const grouped: Record<number, Record<string, number>> = {};

        rawData.forEach((entry: any) => {
          const { test_year, residence_depto_name, avg_score } = entry;
          if (!grouped[test_year]) {
            grouped[test_year] = {};
          }
          grouped[test_year][residence_depto_name] = avg_score;
        });

        const departamentosSet = new Set<string>();

        const finalData: DataPoint[] = Object.entries(grouped).map(
          ([year, values]) => {
            const entry: DataPoint = { test_year: Number(year) };
            for (const [depto, score] of Object.entries(values)) {
              entry[depto] = score;
              departamentosSet.add(depto);
            }
            return entry;
          }
        );

        setData(finalData);
        setDepartamentos(Array.from(departamentosSet).sort());
      });
  }, []);

  if (!mounted) return null;

  // Custom colors for some departments
  const customColors = {
    'Montevideo': '#3B82F6',
    'Canelones': '#EF4444',
    'Maldonado': '#10B981',
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Chart area (left) */}
      <div className="flex-1">
        <TimeSeriesChart
          data={data}
          lines={departamentos}
          xKey="test_year"
          yLabel="Promedio de puntaje"
          colors={customColors}
          selectedLines={selectedDepartamentos.length ? selectedDepartamentos : undefined}
          title="Promedios por departamento"
          height={500}
          showGrid={true}
          showLegend={true}
          showTooltip={true}
          strokeWidth={2}
          showDots={false}
        />
      </div>

      {/* Filter sidebar (right) */}
      <div className="w-64 border rounded p-4 max-h-[500px] overflow-y-auto">
        <h3 className="font-semibold mb-2 text-sm text-gray-600">Editar departamentos</h3>
        <input
          type="text"
          placeholder="Buscar..."
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
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={toggle}
                  className="mr-2"
                />
                {depto.charAt(0).toUpperCase() + depto.slice(1)}
              </label>
            );
          })}
      </div>
    </div>
  );
} 