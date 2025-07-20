// utils/api.js

// IMPORTANT: NEVER hardcode API keys directly in client-side code in a production application.
// For development, you can use environment variables (e.g., VITE_RAPIDAPI_KEY).
// For production, always use a backend proxy or serverless function to hide your API key.
// For this Canvas environment, we'll keep it here for functionality, but be aware of the risk.
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'YOUR_RAPIDAPI_KEY_HERE'; // Placeholder for env var
const BASE_URL = 'https://alphavantage.p.rapidapi.com';

// Helper function for making API calls with caching
// cacheDurationMs: how long to cache the data in milliseconds (default: 10 minutes)
async function fetchWithCache(url, cacheKey, cacheDurationMs = 1000 * 60 * 10) {
  try {
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      // Check if cached data is still valid
      if (Date.now() - parsed.timestamp < cacheDurationMs) {
        console.log(`Cache hit for ${cacheKey}`);
        return parsed.data;
      } else {
        console.log(`Cache expired for ${cacheKey}`);
        localStorage.removeItem(cacheKey); // Clear expired cache
      }
    }

    console.log(`Fetching data from API for ${cacheKey}...`);
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'alphavantage.p.rapidapi.com',
      },
    });

    // Check if the HTTP response was successful
    if (!res.ok) {
      const errorText = await res.text(); // Get raw error message from response
      throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorText}`);
    }

    const data = await res.json();

    // Alpha Vantage often returns an "Error Message" or "Note" for failed requests
    if (data["Error Message"] || data["Note"]) {
      throw new Error(data["Error Message"] || data["Note"] || "Alpha Vantage API error.");
    }

    // Store data in cache with timestamp
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    console.error(`Failed to fetch data for ${cacheKey}:`, error);
    // Re-throw the error so calling components can handle it
    throw error;
  }
}

/**
 * Fetches a global quote for a given stock symbol.
 * This typically includes current price, open, high, low, volume, etc.
 * @param {string} symbol - The stock ticker symbol (e.g., "IBM").
 * @returns {Promise<Object>} - A promise that resolves to the stock overview data.
 */
export async function fetchStockOverview(symbol) {
  // Alpha Vantage's GLOBAL_QUOTE function provides a snapshot, not a full "overview" like company details.
  // For company overview (description, industry, etc.), you'd typically use the "OVERVIEW" function.
  // Assuming 'overview' here refers to the quick quote.
  const url = `${BASE_URL}/query?function=GLOBAL_QUOTE&symbol=${symbol}`;
  const cacheKey = `global_quote_${symbol}`; // More specific cache key
  return fetchWithCache(url, cacheKey);
}

/**
 * Fetches daily adjusted historical prices for a given stock symbol.
 * @param {string} symbol - The stock ticker symbol (e.g., "IBM").
 * @returns {Promise<Object>} - A promise that resolves to the historical price data.
 */
export async function fetchHistoricalPrices(symbol) {
  const url = `${BASE_URL}/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=compact`;
  const cacheKey = `time_series_daily_adjusted_${symbol}`; // More specific cache key
  return fetchWithCache(url, cacheKey);
}

/**
 * Fetches company overview and fundamental data.
 * This includes company description, industry, market capitalization, etc.
 * @param {string} symbol - The stock ticker symbol (e.g., "IBM").
 * @returns {Promise<Object>} - A promise that resolves to the company overview data.
 */
export async function fetchCompanyOverview(symbol) {
  const url = `${BASE_URL}/query?function=OVERVIEW&symbol=${symbol}`;
  const cacheKey = `company_overview_${symbol}`;
  return fetchWithCache(url, cacheKey);
}

/**
 * Fetches income statement data.
 * @param {string} symbol - The stock ticker symbol (e.g., "IBM").
 * @returns {Promise<Object>} - A promise that resolves to the income statement data.
 */
export async function fetchIncomeStatement(symbol) {
  const url = `${BASE_URL}/query?function=INCOME_STATEMENT&symbol=${symbol}`;
  const cacheKey = `income_statement_${symbol}`;
  return fetchWithCache(url, cacheKey);
}

/**
 * Fetches balance sheet data.
 * @param {string} symbol - The stock ticker symbol (e.g., "IBM").
 * @returns {Promise<Object>} - A promise that resolves to the balance sheet data.
 */
export async function fetchBalanceSheet(symbol) {
  const url = `${BASE_URL}/query?function=BALANCE_SHEET&symbol=${symbol}`;
  const cacheKey = `balance_sheet_${symbol}`;
  return fetchWithCache(url, cacheKey);
}

/**
 * Fetches cash flow data.
 * @param {string} symbol - The stock ticker symbol (e.g., "IBM").
 * @returns {Promise<Object>} - A promise that resolves to the cash flow data.
 */
export async function fetchCashFlow(symbol) {
  const url = `${BASE_URL}/query?function=CASH_FLOW&symbol=${symbol}`;
  const cacheKey = `cash_flow_${symbol}`;
  return fetchWithCache(url, cacheKey);
}
