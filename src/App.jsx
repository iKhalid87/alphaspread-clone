// src/App.jsx
import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // load saved preference or default to true
    const saved = localStorage.getItem('darkMode');
    return saved === null ? true : saved === 'true';
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const [symbol, setSymbol] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-3xl font-bold tracking-tight">AlphaSpread Clone</h1>
        <button
          aria-label="Toggle Dark Mode"
          className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <SearchBar onSelectSymbol={setSymbol} />
        {symbol ? (
          <section className="mt-6 p-6 bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Stock Overview: {symbol}</h2>
            <p className="text-gray-600 dark:text-gray-300">Financial data will appear here after search.</p>
          </section>
        ) : (
          <p className="mt-6 text-center text-gray-500 dark:text-gray-400">Search for a stock symbol to begin.</p>
        )}
      </main>
    </div>
  );
}
