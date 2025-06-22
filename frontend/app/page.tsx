'use client';
import TimeSeriesChartEnhancedDemo from "../components/TimeSeriesChartEnhancedDemo";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Explorador de Datos</h1>
      
      {/* Enhanced Demo with Utility Functions */}
      <div className="mb-8">
        <TimeSeriesChartEnhancedDemo />
      </div>
    </main>
  );
}
