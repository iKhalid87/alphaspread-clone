// App.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect import
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'; // Added useParams import
import SearchBar from './components/SearchBar';
import StockOverview from './components/StockOverview';
import FinancialTabs from './components/FinancialTabs';
import ValuationChart from './components/ValuationChart'; // Corrected import: 'ValuationChart' (singular)

// Import API functions and DCF calculation
import { fetchStockOverview, fetchCompanyOverview } from './utils/api';
import { calculateDCF } from './utils/dcf';

// Placeholder for a detailed stock page component
const StockDetailPage = () => { // Removed 'symbol' prop as it will come from useParams
  const { symbol } = useParams(); // Get symbol from URL parameters
  const [isLoading, setIsLoading] = useState(true); // Set to true initially as we're fetching data
  const [error, setError] = useState(null);

  const [currentPrice, setCurrentPrice] = useState(null);
  const [dcfValue, setDcfValue] = useState(null);
  const [companyOverviewForDCF, setCompanyOverviewForDCF] = useState(null); // To pass to calculateDCF

  useEffect(() => {
    const fetchValuationData = async () => {
      if (!symbol) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch global quote for current price
        const globalQuoteData = await fetchStockOverview(symbol);
        const price = parseFloat(globalQuoteData?.['Global Quote']?.['05. price']);

        // Fetch company overview for EPS to calculate DCF
        const companyOverviewData = await fetchCompanyOverview(symbol);
        setCompanyOverviewForDCF(companyOverviewData); // Store for potential re-use or direct prop passing

        // Calculate DCF value using the fetched company overview data
        // Ensure companyOverviewData is valid before passing to calculateDCF
        const dcfResult = calculateDCF(companyOverviewData || {}); // Pass the overview data

        setCurrentPrice(price);
        setDcfValue(dcfResult);
      } catch (err) {
        console.error("Error fetching valuation data or calculating DCF:", err);
        setError(err);
        setCurrentPrice(null);
        setDcfValue(null);
        setCompanyOverviewForDCF(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuationData();
  }, [symbol]); // Re-run effect when symbol changes

  // Example of a simple loading/error display
  if (isLoading) {
    return (
      <div className="text-center py-8 bg-gray-800 rounded-xl shadow-lg mt-6">
        <p className="text-xl text-gray-400">Loading data for {symbol}...</p>
        <svg className="animate-spin h-8 w-8 text-accent mx-auto mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-gray-800 rounded-xl shadow-lg mt-6 text-red-500">
        <p className="text-xl">Error loading data for {symbol}: {error.message}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  // If no data is available after loading (e.g., invalid symbol)
  if (!currentPrice && !dcfValue && !companyOverviewForDCF) {
    return (
      <div className="text-center py-8 bg-gray-800 rounded-xl shadow-lg mt-6 text-gray-400">
        <p className="text-xl">No data found for {symbol}.</p>
        <p className="text-sm mt-2">Please ensure the symbol is correct or try a different one.</p>
      </div>
    );
  }

  return (
    <>
      {/* StockOverview, FinancialTabs, and ValuationChart now receive symbol from useParams */}
      <StockOverview symbol={symbol} />
      <ValuationChart symbol={symbol} current={currentPrice} dcf={dcfValue} />
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
              element={<StockDetailPage />} // No need to pass symbol prop here, StockDetailPage uses useParams
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
