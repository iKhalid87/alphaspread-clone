// utils/api.js
const API_KEY = '7b1376c647msh2d95bf797c41p11c0c6jsn6be501ad440';
const BASE_URL = 'https://alphavantage.p.rapidapi.com';

async function fetchWithCache(url, cacheKey, cacheDurationMs = 1000 * 60 * 10) {
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < cacheDurationMs) return parsed.data;
  }
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'alphavantage.p.rapidapi.com',
    },
  });
  const data = await res.json();
  localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
  return data;
}

export async function fetchStockOverview(symbol) {
  return fetchWithCache(
    `${BASE_URL}/query?function=GLOBAL_QUOTE&symbol=${symbol}`,
    `overview_${symbol}`
  );
}

export async function fetchHistoricalPrices(symbol) {
  return fetchWithCache(
    `${BASE_URL}/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=compact`,
    `history_${symbol}`
  );
}
