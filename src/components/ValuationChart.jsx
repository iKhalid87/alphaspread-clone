import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title, // Import Title for chart titles
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function ValuationChart({ current, dcf }) {
  // --- Input Validation and Early Exit ---
  if (current === null || dcf === null || isNaN(current) || isNaN(dcf)) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 mt-6 text-center text-gray-400">
        <p className="text-xl">Valuation data not available.</p>
        <p className="text-sm mt-2">Please ensure both current price and DCF value are provided.</p>
      </div>
    );
  }

  const data = {
    labels: ['Current Market Price', 'DCF Intrinsic Value'], // More descriptive labels
    datasets: [
      {
        label: 'Price vs Intrinsic Value',
        data: [current, dcf],
        backgroundColor: [
          'rgb(234, 179, 8)', // Tailwind yellow-500 (for current price)
          'rgb(74, 222, 128)', // Tailwind green-400 (for DCF value)
        ],
        borderColor: [
          'rgb(202, 138, 4)', // Darker yellow
          'rgb(34, 197, 94)', // Darker green
        ],
        borderWidth: 1,
        borderRadius: 4, // Rounded bars
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to fill container better
    plugins: {
      legend: {
        display: false, // Hide legend as labels are self-explanatory
      },
      title: {
        display: true,
        text: 'Stock Valuation: Current Price vs. DCF Value', // Chart title
        color: '#CBD5E0', // gray-300 for title
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#2D3748', // gray-700 for tooltip background
        titleColor: '#FFFFFF',
        bodyColor: '#CBD5E0',
        borderColor: '#4A5568',
        borderWidth: 1,
        cornerRadius: 4,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#A0AEC0', // gray-400 for x-axis labels
        },
        grid: {
          display: false, // Hide x-axis grid lines
          borderColor: '#4A5568',
        },
      },
      y: {
        ticks: {
          color: '#A0AEC0', // gray-400 for y-axis labels
          callback: function(value) {
            return '$' + value.toFixed(2); // Format y-axis as currency
          }
        },
        grid: {
          color: '#2D3748', // gray-700 for grid lines
          borderColor: '#4A5568',
        },
      },
    },
  };

  // Determine if undervalued, overvalued, or fairly valued
  let valuationMessage = '';
  let valuationColorClass = 'text-gray-300'; // Default color

  if (dcf > current * 1.10) { // DCF is significantly higher (e.g., >10% higher)
    valuationMessage = `Based on DCF, ${symbol} appears to be undervalued.`;
    valuationColorClass = 'text-positive'; // Green
  } else if (dcf < current * 0.90) { // DCF is significantly lower (e.g., <10% lower)
    valuationMessage = `Based on DCF, ${symbol} appears to be overvalued.`;
    valuationColorClass = 'text-negative'; // Red
  } else {
    valuationMessage = `Based on DCF, ${symbol} appears to be fairly valued.`;
    valuationColorClass = 'text-accent'; // Blue
  }


  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-accent-positive">DCF Valuation</h2>
      <div className="h-80 w-full"> {/* Fixed height for chart container */}
        <Bar data={data} options={options} />
      </div>
      {valuationMessage && (
        <p className={`text-center mt-4 text-lg font-medium ${valuationColorClass}`}>
          {valuationMessage}
        </p>
      )}
    </div>
  );
}

// PropTypes for type checking
ValuationChart.propTypes = {
  current: PropTypes.number,
  dcf: PropTypes.number,
  symbol: PropTypes.string.isRequired, // Added symbol to propTypes
};

// Default props for current and dcf to handle initial null states gracefully
ValuationChart.defaultProps = {
  current: null,
  dcf: null,
};
