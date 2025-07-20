// src/components/SearchBar.jsx
import React, { useState, useEffect } from 'react';

const staticSuggestions = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];

export default function SearchBar({ onSelectSymbol }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!input.trim()) return setSuggestions([]);
    const filtered = staticSuggestions.filter((sym) =>
      sym.toLowerCase().startsWith(input.toLowerCase())
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
        className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        placeholder="Search stock symbol (e.g. AAPL)"
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase())}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && input.trim()) handleSelect(input.trim());
        }}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-20 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded mt-1 max-h-40 overflow-auto shadow-lg">
          {suggestions.map((sym) => (
            <li
              key={sym}
              className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => handleSelect(sym)}
            >
              {sym}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
