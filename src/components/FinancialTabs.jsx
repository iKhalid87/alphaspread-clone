import React, { useEffect, useState } from 'react';
import { fetchIncome, fetchBalance, fetchCashflow } from '../utils/api';

export default function FinancialTabs({ symbol }) {
  const [tab, setTab] = useState('income');
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (tab === 'income') setData(await fetchIncome(symbol));
      if (tab === 'balance') setData(await fetchBalance(symbol));
      if (tab === 'cashflow') setData(await fetchCashflow(symbol));
    };
    fetchData();
  }, [tab, symbol]);

  const formatTable = (financials, keyName) => {
    if (!financials || !financials[keyName]) return <p>No data available</p>;
    const records = financials[keyName].slice(0, 5);
    const keys = Object.keys(records[0] || {}).filter(k => k !== 'fiscalDateEnding');

    return (
      <table className="w-full text-left text-sm border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-2 border-b border-gray-700">Date</th>
            {keys.map(k => (
              <th key={k} className="p-2 border-b border-gray-700 whitespace-nowrap">{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i} className="odd:bg-gray-700 even:bg-gray-800">
              <td className="p-2 border-b border-gray-700 font-medium">{r.fiscalDateEnding}</td>
              {keys.map(k => (
                <td key={k} className="p-2 border-b border-gray-700">{Number(r[k]).toLocaleString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="mt-6">
      <div className="flex gap-4 mb-2">
        <button onClick={() => setTab('income')} className={tab === 'income' ? 'underline text-blue-400' : ''}>Income</button>
        <button onClick={() => setTab('balance')} className={tab === 'balance' ? 'underline text-blue-400' : ''}>Balance</button>
        <button onClick={() => setTab('cashflow')} className={tab === 'cashflow' ? 'underline text-blue-400' : ''}>Cash Flow</button>
      </div>
      <div className="overflow-auto max-h-[400px] border border-gray-700 rounded">
        {tab === 'income' && formatTable(data, 'annualReports')}
        {tab === 'balance' && formatTable(data, 'annualReports')}
        {tab === 'cashflow' && formatTable(data, 'annualReports')}
      </div>
    </div>
  );
}
