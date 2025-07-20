import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for type checking

// In a real application, popularSymbols would likely come from a backend or a more dynamic source.
// For demonstration, we'll keep a few for initial suggestions.
const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'BRK.A', 'JPM'];

export default function SearchBar({ onSelectSymbol }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // New state for loading indicator
  const inputRef = useRef(null); // Ref for the input element

  // Effect for filtering local suggestions or fetching from API
  useEffect(() => {
    // Debounce the input for potential API calls (if implementing real-time search suggestions)
    const handler = setTimeout(() => {
      if (!input.trim()) {
        setSuggestions([]);
        return;
      }

      // Simulate API call for suggestions (replace with actual API call later)
      // For now, filter from popularSymbols
      const filtered = popularSymbols.filter(sym =>
        sym.toLowerCase().startsWith(input.toLowerCase().trim())
      );
      setSuggestions(filtered);

      // If you were fetching from an API for suggestions:
      // const fetchSuggestions = async () => {
      //   try {
      //     // Example: const apiSuggestions = await fetchSymbolSearch(input.trim());
      //     // setSuggestions(apiSuggestions.bestMatches.map(match => match['1. symbol']));
      //   } catch (err) {
      //     console.error("Error fetching suggestions:", err);
      //     setSuggestions([]);
      //   }
      // };
      // fetchSuggestions();

    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(handler); // Clear timeout on unmount or input change
    };
  }, [input]);

  // Handle the search action
  const handleSearch = (symbolToSearch = input.trim().toUpperCase()) => {
    if (!symbolToSearch) return; // Prevent search on empty input

    setIsSearching(true); // Set loading state
    onSelectSymbol(symbolToSearch); // Call the parent's select handler
    setSuggestions([]); // Clear suggestions
    setInput(''); // Clear input after search
    inputRef.current?.blur(); // Remove focus from input after search

    // In a real scenario, you might have a loading state that is cleared
    // by the parent component (App.jsx) once data is fetched.
    // For now, we'll clear it here after a short delay for visual feedback.
    setTimeout(() => setIsSearching(false), 500);
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative mb-6 p-4 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          ref={inputRef}
          type="text"
          className="flex-grow bg-gray-900 text-white p-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-positive focus:border-transparent transition-all duration-200"
          placeholder="Enter stock symbol (e.g., AAPL, MSFT)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Stock symbol search input"
        />
        <button
          onClick={() => handleSearch()}
          className="flex-shrink-0 bg-accent text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
          disabled={isSearching || !input.trim()} // Disable button during search or if input is empty
          aria-label="Search stock symbol"
        >
          {isSearching ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              Search
            </>
          )}
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute bg-gray-700 w-full rounded-md mt-2 z-20 border border-gray-600 shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map(sym => (
            <li
              key={sym}
              className="p-3 hover:bg-gray-600 cursor-pointer text-gray-200 transition-colors duration-150"
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

// PropTypes for type checking
SearchBar.propTypes = {
  onSelectSymbol: PropTypes.func.isRequired,
};
