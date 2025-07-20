import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import StockOverview from './components/StockOverview';

export default function App() {
  const [symbol, setSymbol] = useState(null);
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">AlphaSpread Clone</h1>
      <SearchBar onSelectSymbol={setSymbol} />
      {symbol && <StockOverview symbol={symbol} />}
    </div>
  );
}