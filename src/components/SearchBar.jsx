// components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';

const API_KEY = '7b1376c647msh2d95bf797c17c41p11c0c6jsn6be501ad4e40';

export default function SearchBar({ onSelectSymbol }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    // Debounce API call
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetch(
        `https://alphavantage.p.rapidapi.com/query?function=SYMBOL_SEARCH&keywords=${input}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'alphavantage.p.rapidapi.com',
          },
        }
      )
        .then(res => res.json())
        .then(data => {
          const matches = data.bestMatches || [];
          setSuggestions(
            matches.map(m => ({
              symbol: m['1. symbol'],
              name: m['2. name'],
            }))
          );
        })
        .catch(() => setSuggestions([]));
    }, 500);
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
