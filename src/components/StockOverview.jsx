// components/StockOverview.jsx - polished card style
import React from 'react';

export default function StockOverview({ symbol, price, change, marketCap }) {
  // Format numbers for display
  const fmtNumber = (num) => {
    if (!num) return '-';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const changeColor = change >= 0 ? 'text-green-500' : 'text-red-500';
  const changeSign = change >= 0 ? '+' : '';

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-2">{symbol}</h2>
      <div className="flex items-center gap-6">
        <div className="text-3xl font-semibold">${fmtNumber(price)}</div>
        <div className={`text-xl font-medium ${changeColor}`}>
          {changeSign}{change?.toFixed(2)}%
        </div>
      </div>
      <div className="mt-4 text-gray-600 dark:text-gray-400">
        Market Cap: {fmtNumber(marketCap)}
      </div>
    </div>
  );
}
