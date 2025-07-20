import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { fetchIncomeStatement, fetchBalanceSheet, fetchCashFlow } from '../utils/api'; // Corrected import names

export default function FinancialTabs({ symbol }) {
  const [tab, setTab] = useState('income');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use useCallback to memoize fetchData to prevent unnecessary re-creations
  const fetchData = useCallback(async () => {
    if (!symbol) {
      setData(null);
      return; // Do not fetch if no symbol is provided
    }

    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      let fetchedData = null;
      if (tab === 'income') {
        fetchedData = await fetchIncomeStatement(symbol);
      } else if (tab === 'balance') {
        fetchedData = await fetchBalanceSheet(symbol);
      } else if (tab === 'cashflow') {
        fetchedData = await fetchCashFlow(symbol);
      }
      setData(fetchedData);
    } catch (err) {
      console.error(`Error fetching ${tab} data for ${symbol}:`, err);
      setError(err); // Store the error
      setData(null); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [tab, symbol]); // Dependencies: tab and symbol

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency: fetchData (memoized by useCallback)

  // Memoize formatTable to prevent re-rendering if props don't change
  const formatTable = useCallback((financials, keyName) => {
    // Check for common Alpha Vantage API error messages or missing data
    if (!financials || financials["Error Message"] || financials["Note"] || !financials[keyName]) {
      // Provide more specific feedback if an error occurred during fetch
      if (error) {
        return <p className="text-red-400 p-4">Error loading financial data: {error.message}</p>;
      }
      return <p className="text-gray-400 p-4">No data available for this financial statement.</p>;
    }

    const records = financials[keyName].slice(0, 5); // Get up to 5 annual reports

    if (records.length === 0) {
      return <p className="text-gray-400 p-4">No annual reports found.</p>;
    }

    // Dynamically get all unique keys from all records for comprehensive columns
    const allKeys = new Set();
    records.forEach(record => {
      Object.keys(record).forEach(key => {
        if (key !== 'fiscalDateEnding' && key !== 'reportedCurrency') { // Exclude fiscalDateEnding and reportedCurrency from data keys
          allKeys.add(key);
        }
      });
    });

    // Convert Set to Array and sort for consistent column order
    const keys = Array.from(allKeys).sort();

    return (
      <div className="overflow-x-auto"> {/* Added for horizontal scrolling on small screens */}
        <table className="min-w-full text-left text-sm border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 border-b border-gray-700 text-gray-300 font-semibold sticky left-0 bg-gray-800 z-10">Date</th> {/* Sticky header for date */}
              {keys.map(k => (
                <th key={k} className="p-3 border-b border-gray-700 whitespace-nowrap text-gray-300 font-semibold">
                  {/* Format key names for better readability (e.g., "totalRevenue" -> "Total Revenue") */}
                  {k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={r.fiscalDateEnding || i} className="odd:bg-gray-700 even:bg-gray-800 hover:bg-gray-600 transition-colors">
                <td className="p-3 border-b border-gray-700 font-medium sticky left-0 odd:bg-gray-700 even:bg-gray-800 z-10">{r.fiscalDateEnding}</td>
                {keys.map(k => (
                  <td key={k} className="p-3 border-b border-gray-700">
                    {/* Format numbers for currency/readability */}
                    {typeof r[k] === 'string' && !isNaN(parseFloat(r[k]))
                      ? Number(parseFloat(r[k])).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 })
                      : r[k] || '-'} {/* Display '-' for missing data */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [error]); // Dependency: error state

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-accent-positive">Financial Statements</h2>
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => setTab('income')}
          className={`px-5 py-2 rounded-md transition-all duration-200 ease-in-out ${
            tab === 'income'
              ? 'bg-accent text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Income Statement
        </button>
        <button
          onClick={() => setTab('balance')}
          className={`px-5 py-2 rounded-md transition-all duration-200 ease-in-out ${
            tab === 'balance'
              ? 'bg-accent text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Balance Sheet
        </button>
        <button
          onClick={() => setTab('cashflow')}
          className={`px-5 py-2 rounded-md transition-all duration-200 ease-in-out ${
            tab === 'cashflow'
              ? 'bg-accent text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Cash Flow Statement
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-xl">Loading financial data...</p>
            {/* You could add a spinner here */}
          </div>
        ) : (
          <>
            {tab === 'income' && formatTable(data, 'annualReports')}
            {tab === 'balance' && formatTable(data, 'annualReports')}
            {tab === 'cashflow' && formatTable(data, 'annualReports')}
          </>
        )}
      </div>
    </div>
  );
}

// PropTypes for type checking
FinancialTabs.propTypes = {
  symbol: PropTypes.string,
};

// Default props if symbol is not provided
FinancialTabs.defaultProps = {
  symbol: null,
};
