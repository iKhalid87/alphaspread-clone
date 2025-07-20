import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { fetchStockOverview, fetchHistoricalPrices, fetchCompanyOverview } from '../utils/api'; // Added fetchCompanyOverview
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title, // Import Title for chart titles
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

export default function StockOverview({ symbol }) {
  const [globalQuote, setGlobalQuote] = useState(null); // Renamed for clarity
  const [historicalData, setHistoricalData] = useState(null); // Renamed for clarity
  const [companyOverview, setCompanyOverview] = useState(null); // New state for company details
  const [isLoading, setIsLoading] = useState(true); // Renamed for consistency
  const [error, setError] = useState(null); // New state for error handling

  // Memoize fetchData to prevent unnecessary re-creations
  const fetchData = useCallback(async () => {
    if (!symbol) {
      // Clear data and reset states if no symbol is provided
      setGlobalQuote(null);
      setHistoricalData(null);
      setCompanyOverview(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      // Fetch all necessary data concurrently
      const [ov, hist, compOv] = await Promise.all([
        fetchStockOverview(symbol),
        fetchHistoricalPrices(symbol),
        fetchCompanyOverview(symbol), // Fetch company overview
      ]);

      // Check for API-specific error messages from Alpha Vantage
      if (ov["Error Message"] || ov["Note"] || hist["Error Message"] || hist["Note"] || compOv["Error Message"] || compOv["Note"]) {
        const errorMessage = ov["Error Message"] || hist["Error Message"] || compOv["Error Message"] ||
                             ov["Note"] || hist["Note"] || compOv["Note"] || "Unknown API error.";
        throw new Error(errorMessage);
      }

      setGlobalQuote(ov['Global Quote'] || null);
      setHistoricalData(hist['Time Series (Daily)'] || null);
      setCompanyOverview(compOv || null); // Set company overview data
    } catch (err) {
      console.error(`Error fetching data for ${symbol}:`, err);
      setError(err); // Store the error
      setGlobalQuote(null);
      setHistoricalData(null);
      setCompanyOverview(null);
    } finally {
      setIsLoading(false);
    }
  }, [symbol]); // Dependency: symbol

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency: fetchData (memoized by useCallback)

  // --- Conditional Rendering for Loading/Error/No Data ---
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 mt-6 text-center text-gray-400">
        <p className="text-xl">Loading data for {symbol}...</p>
        <svg className="animate-spin h-8 w-8 text-accent mx-auto mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 mt-6 text-center text-red-400">
        <p className="text-xl">Error loading data for {symbol}:</p>
        <p className="text-sm mt-2">{error.message || "Please try again later."}</p>
      </div>
    );
  }

  // Check if no data was found after loading
  if (!globalQuote && !companyOverview) { // Check both as companyOverview might be available even if quote isn't
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 mt-6 text-center text-gray-400">
        <p className="text-xl">No data found for {symbol}.</p>
        <p className="text-sm mt-2">Please ensure the symbol is correct or try a different one.</p>
      </div>
    );
  }

  // --- Data Processing for Chart and Overview ---
  const price = globalQuote ? Number(globalQuote['05. price']) : 'N/A';
  const change = globalQuote ? Number(globalQuote['09. change']) : 'N/A';
  const changePercent = globalQuote ? globalQuote['10. change percent'] : 'N/A';
  const companyName = companyOverview ? companyOverview.Name : 'N/A';
  const industry = companyOverview ? companyOverview.Industry : 'N/A';
  const sector = companyOverview ? companyOverview.Sector : 'N/A';
  const marketCap = companyOverview ? Number(companyOverview.MarketCapitalization).toLocaleString('en-US') : 'N/A';
  const peRatio = companyOverview ? companyOverview.PERatio : 'N/A';
  const dividendYield = companyOverview ? (Number(companyOverview.DividendYield) * 100).toFixed(2) + '%' : 'N/A';
  const description = companyOverview ? companyOverview.Description : 'No description available.';

  const chartLabels = [];
  const chartData = [];

  if (historicalData) {
    // Get dates, sort them, and take the last 90 for a slightly longer view
    const dates = Object.keys(historicalData).sort((a, b) => new Date(a) - new Date(b));
    const last90 = dates.slice(-90); // Get last 90 days for better chart view

    last90.forEach((date) => {
      chartLabels.push(date);
      chartData.push(Number(historicalData[date]['4. close']));
    });
  }

  const chartConfig = {
    labels: chartLabels,
    datasets: [
      {
        label: `${symbol} Closing Price`, // More descriptive label
        data: chartData,
        borderColor: 'rgb(66, 153, 225)', // Using Accent Blue from Tailwind config
        backgroundColor: 'rgba(66, 153, 225, 0.2)', // Lighter fill
        fill: true,
        tension: 0.3, // Slightly more curve
        pointRadius: 0, // Hide points for cleaner line
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to fill container better
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#CBD5E0', // gray-300 for legend text
        },
      },
      title: {
        display: true,
        text: `${symbol} - Last 90 Days Closing Price`,
        color: '#CBD5E0', // gray-300 for title
        font: {
          size: 16,
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
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#A0AEC0', // gray-400 for x-axis labels
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: '#2D3748', // gray-700 for grid lines
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

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
      {/* Company Name and Symbol */}
      <h2 className="text-3xl font-bold mb-2 text-accent-positive">{companyName} ({symbol})</h2>
      <p className="text-gray-400 text-sm mb-4">{sector} - {industry}</p>

      {/* Price and Change */}
      <div className="flex items-center gap-6 mb-4">
        <div className="text-4xl font-extrabold text-white">${price !== 'N/A' ? price.toFixed(2) : price}</div>
        <div className={`text-2xl font-medium ${changePercent && changePercent.startsWith('-') ? 'text-negative' : 'text-positive'}`}>
          {change !== 'N/A' ? (change > 0 ? '+' : '') + change.toFixed(2) : change} ({changePercent})
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300 mb-6">
        <div><span className="font-semibold">Market Cap:</span> ${marketCap}</div>
        <div><span className="font-semibold">P/E Ratio:</span> {peRatio}</div>
        <div><span className="font-semibold">Dividend Yield:</span> {dividendYield}</div>
      </div>

      {/* Company Description */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-200">About {companyName}</h3>
        <p className="text-gray-300 text-sm leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
          {description}
        </p>
      </div>

      {/* Historical Price Chart */}
      <div className="h-80 w-full"> {/* Fixed height for chart container */}
        <Line data={chartConfig} options={chartOptions} />
      </div>
    </div>
  );
}

// PropTypes for type checking
StockOverview.propTypes = {
  symbol: PropTypes.string.isRequired,
};
