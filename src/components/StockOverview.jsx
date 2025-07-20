import React, { useEffect, useState } from 'react';
import { fetchOverview, fetchQuote } from '../utils/api';
import ValuationChart from './ValuationChart';
import FinancialTabs from './FinancialTabs';
import { calculateDCF } from '../utils/dcf';

export default function StockOverview({ symbol }) {
  const [overview, setOverview] = useState(null);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    fetchOverview(symbol).then(setOverview);
    fetchQuote(symbol).then(setQuote);
  }, [symbol]);

  if (!overview || !quote) return <p>Loading...</p>;
  if (overview.Note || overview.Information) return <p>Error fetching data.</p>;

  const dcfValue = calculateDCF(overview);
  const currentPrice = parseFloat(quote['05. price']);
  const relativePrice = ((currentPrice - dcfValue) / dcfValue) * 100;

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl font-semibold mb-2">{overview.Name} ({symbol})</h2>
      <p><strong>Current Price:</strong> ${currentPrice.toFixed(2)}</p>
      <p><strong>Intrinsic Value (DCF):</strong> ${dcfValue.toFixed(2)}</p>
      <p><strong>Relative Price:</strong> {relativePrice.toFixed(2)}%</p>
      <p><strong>Sector:</strong> {overview.Sector}</p>
      <p><strong>Market Cap:</strong> ${Number(overview.MarketCapitalization).toLocaleString()}</p>
      <p><strong>PE Ratio:</strong> {overview.PERatio}</p>
      <p><strong>Beta:</strong> {overview.Beta}</p>

      <ValuationChart current={currentPrice} dcf={dcfValue} />
      <FinancialTabs symbol={symbol} />
    </div>
  );
}