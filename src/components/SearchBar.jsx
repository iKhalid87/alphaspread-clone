import React, { useState, useEffect } from 'react';

const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];

export default function SearchBar({ onSelectSymbol }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!input) return setSuggestions([]);
    const filtered = popularSymbols.filter(sym =>
      sym.toLowerCase().startsWith(input.toLowerCase())
    );
    setSuggestions(filtered);
  }, [input]);

  const handleSearch = (symbol) => {
    onSelectSymbol(symbol || input.trim().toUpperCase());
    setSuggestions([]);
  };

  return (
    <div className="relative mb-4">
      <div className="flex gap-2">
        <input
          className="bg-gray-800 p-2 rounded w-full"
          placeholder="Enter stock symbol (e.g. AAPL)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-blue-600 px-4 py-2 rounded" onClick={() => handleSearch()}>
          Search
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute bg-gray-700 w-full rounded mt-1 z-10">
          {suggestions.map(sym => (
            <li
              key={sym}
              className="p-2 hover:bg-gray-600 cursor-pointer"
              onClick={() => handleSearch(sym)}
            >
              {sym}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}