const API_KEY = '7b1376c647msh2d95bf797c17c41p11c0c6jsn6be501ad4e40';
const BASE_URL = 'https://alpha-vantage.p.rapidapi.com/query';

const cache = new Map();

async function cachedFetch(url, key) {
  if (cache.has(key)) return cache.get(key);
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
    }
  });
  const data = await res.json();
  cache.set(key, data);
  setTimeout(() => cache.delete(key), 1000 * 60 * 60 * 24);
  return data;
}

export function fetchOverview(symbol) {
  return cachedFetch(`${BASE_URL}?function=OVERVIEW&symbol=${symbol}`, `overview_${symbol}`);
}

export function fetchQuote(symbol) {
  return cachedFetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}`, `quote_${symbol}`);
}

export function fetchIncome(symbol) {
  return cachedFetch(`${BASE_URL}?function=INCOME_STATEMENT&symbol=${symbol}`, `income_${symbol}`);
}

export function fetchBalance(symbol) {
  return cachedFetch(`${BASE_URL}?function=BALANCE_SHEET&symbol=${symbol}`, `balance_${symbol}`);
}

export function fetchCashflow(symbol) {
  return cachedFetch(`${BASE_URL}?function=CASH_FLOW&symbol=${symbol}`, `cashflow_${symbol}`);
}