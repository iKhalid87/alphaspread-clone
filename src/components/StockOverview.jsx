// components/StockOverview.jsx
import React, { useEffect, useState } from 'react';
import { fetchStockOverview, fetchHistoricalPrices } from '../utils/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function StockOverview({ symbol }) {
  const [overview, setOverview] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;

    setLoading(true);
    Promise.all([fetchStockOverview(symbol), fetchHistoricalPrices(symbol)])
      .then(([ov, hist]) => {
        setOverview(ov['Global Quote'] || null);
        setHistory(hist['Time Series (Daily)'] || null);
      })
      .finally(() => setLoading(false));
  }, [symbol]);

  if (loading) return <p>Loading data for {symbol}...</p>;
  if (!overview) return <p>No data found for {symbol}</p>;

  // Format overview data
  const price = Number(overview['05. price']);
  const changePercent = overview['10. change percent'];
  const chartLabels = [];
  const chartData = [];

  if (history) {
    const dates = Object.keys(history).sort();
    const last60 = dates.slice(-60);
    last60.forEach((date) => {
      chartLabels.push(date);
      chartData.push(Number(history[date]['4. close']));
    });
  }

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Closing Price',
        data: chartData,
        borderColor: 'rgba(59, 130, 246, 1)', // Tailwind blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        fill: true,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-2">{symbol}</h2>
      <div className="flex items-center gap-6 mb-4">
        <div className="text-3xl font-semibold">${price.toFixed(2)}</div>
        <div className={`text-xl font-medium ${changePercent.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
          {changePercent}
        </div>
      </div>

      <div>
        <Line data={data} options={{ responsive: true, plugins: { legend: { display: true } } }} />
      </div>
    </div>
  );
}
