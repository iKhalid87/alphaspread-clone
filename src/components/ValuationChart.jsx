import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ValuationChart({ current, dcf }) {
  const data = {
    labels: ['Current Price', 'DCF Value'],
    datasets: [
      {
        label: 'Price vs Intrinsic Value',
        data: [current, dcf],
        backgroundColor: ['#3b82f6', '#10b981'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  return <Bar data={data} options={options} className="mt-4" />;
}