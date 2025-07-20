// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import StockOverview from './components/StockOverview';
import FinancialTabs from './components/FinancialTabs';
import ValuationCharts from './components/ValuationCharts';

// Placeholder for a detailed stock page component
// In a real app, this would fetch data based on the symbol from the URL param
const StockDetailPage = ({ symbol }) => {
  // You would typically fetch all data for the symbol here or in its children
  // and manage loading/error states.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Example of a simple loading/error display
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-400">Loading data for {symbol}...</p>
        {/* You could add a spinner here */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="text-xl">Error loading data for {symbol}: {error.message}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <StockOverview symbol={symbol} />
      <ValuationCharts symbol={symbol} />
      <FinancialTabs symbol={symbol} />
    </>
  );
};


export default function App() {
  const [symbol, setSymbol] = useState(null);

  return (
    // Router wraps your entire application to enable routing
    <Router>
      <div className="min-h-screen bg-gray-900 text-white p-4 font-sans">
        <h1 className="text-3xl font-bold mb-6 text-center text-accent-positive">AlphaSpread Clone</h1>
        <div className="max-w-4xl mx-auto">
          {/* SearchBar remains at the top, allowing symbol selection */}
          <SearchBar onSelectSymbol={setSymbol} />

          {/* Define your routes */}
          <Routes>
            {/* Home route: Displays a message if no symbol is selected, or redirects if one is */}
            <Route path="/" element={
              symbol ? (
                // If a symbol is selected, navigate to its detail page
                <Navigate to={`/stock/${symbol}`} replace />
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-xl">Search for a stock symbol above to get started!</p>
                </div>
              )
            } />

            {/* Dynamic route for stock details */}
            {/* The :symbol parameter will be available via useParams in StockDetailPage */}
            <Route
              path="/stock/:symbol"
              element={<StockDetailPage symbol={symbol} />} // Pass symbol from state or retrieve from URL param
            />

            {/* Fallback route for any unmatched paths */}
            <Route path="*" element={
              <div className="text-center py-10 text-red-400">
                <p className="text-2xl">404 - Page Not Found</p>
                <p className="mt-2">The page you are looking for does not exist.</p>
                <button
                  onClick={() => window.location.href = '/'} // Simple navigation to home
                  className="mt-4 px-6 py-2 bg-accent rounded-md shadow-md hover:bg-blue-600 transition-colors"
                >
                  Go Home
                </button>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
