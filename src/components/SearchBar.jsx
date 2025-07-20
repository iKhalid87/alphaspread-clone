// components/SearchBar.jsx - upgraded UI
import React, { useState, useEffect } from 'react';

const staticSuggestions = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
];

export default function SearchBar({ onSelectSymbol }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!input.trim()) return setSuggestions([]);
    const filtered = staticSuggestions.filter(({ symbol, name }) =>
      symbol.toLowerCase().startsWith(input.toLowerCase()) ||
      name.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(filtered);
  }, [input]);

  const handleSelect = (sym) => {
    onSelectSymbol(sym);
    setInput(sym);
    setSuggestions([]);
  };

  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Search stock symbol (e.g. AAPL)"
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase())}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && input.trim()) handleSelect(input.trim());
        }}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-30 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
          {suggestions.map(({ symbol, name }) => (
            <li
              key={symbol}
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-blue-600 hover:text-white transition"
              onClick={() => handleSelect(symbol)}
            >
              <div className="font-semibold mr-3">{symbol}</div>
              <div className="text-sm truncate">{name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
