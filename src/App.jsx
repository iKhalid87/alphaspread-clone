// App.jsx
import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import StockOverview from './components/StockOverview';
import FinancialTabs from './components/FinancialTabs';
import ValuationCharts from './components/ValuationCharts';

export default function App() {
  const [symbol, setSymbol] = useState(null);
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">AlphaSpread Clone</h1>
      <div className="max-w-4xl mx-auto">
        <SearchBar onSelectSymbol={setSymbol} />
        {symbol && <>
          <StockOverview symbol={symbol} />
          <ValuationCharts symbol={symbol} />
          <FinancialTabs symbol={symbol} />
        </>}
      </div>
    </div>
  );
}
