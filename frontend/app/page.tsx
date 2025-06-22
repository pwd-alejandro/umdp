'use client';
import DepartamentoLineChart from "../components/LineChart";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Explorador Saber Pro</h1>
      <DepartamentoLineChart />
    </main>
  );
}
