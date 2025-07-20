// utils/dcf.js

/**
 * Calculates the Discounted Cash Flow (DCF) valuation for a company.
 * This is a simplified model using Earnings Per Share (EPS) as a proxy for cash flow.
 * For a more robust model, Free Cash Flow (FCF) from cash flow statements should be used.
 *
 * @param {Object} overview - An object containing company overview data, expected to have an 'EPS' property.
 * @param {number} [growthRate=0.1] - The assumed annual earnings/cash flow growth rate for the explicit forecast period (e.g., 0.10 for 10%).
 * @param {number} [discountRate=0.08] - The Weighted Average Cost of Capital (WACC) or required rate of return (e.g., 0.08 for 8%).
 * @param {number} [explicitForecastYears=5] - The number of years for the explicit forecast period.
 * @param {number} [perpetualGrowthRate=0.02] - The assumed constant growth rate of cash flows beyond the explicit forecast period (e.g., 0.02 for 2%).
 * This must be less than the discountRate.
 * @returns {number | null} The calculated intrinsic value per share, or null if input is invalid or calculation fails.
 */
export function calculateDCF(overview, growthRate = 0.1, discountRate = 0.08, explicitForecastYears = 5, perpetualGrowthRate = 0.02) {
  // Validate inputs
  if (!overview || typeof overview.EPS === 'undefined') {
    console.error("DCF Calculation Error: 'overview' object or 'EPS' property is missing.");
    return null;
  }

  const initialEPS = parseFloat(overview.EPS);

  if (isNaN(initialEPS) || initialEPS <= 0) {
    console.error(`DCF Calculation Error: Invalid or non-positive EPS value: ${overview.EPS}`);
    return null;
  }

  if (discountRate <= growthRate) {
    console.error("DCF Calculation Error: Discount rate must be greater than the explicit growth rate for a valid terminal value calculation.");
    return null;
  }

  if (discountRate <= perpetualGrowthRate) {
    console.error("DCF Calculation Error: Discount rate must be greater than the perpetual growth rate for a valid terminal value calculation.");
    return null;
  }

  if (explicitForecastYears <= 0) {
    console.error("DCF Calculation Error: Explicit forecast years must be a positive number.");
    return null;
  }

  let presentValueForecastPeriod = 0;
  let projectedCashFlow = initialEPS; // Starting with EPS as proxy for cash flow

  // Calculate Present Value of Cash Flows during the explicit forecast period
  for (let t = 1; t <= explicitForecastYears; t++) {
    projectedCashFlow *= (1 + growthRate); // Grow cash flow for the next year
    const discountedCashFlow = projectedCashFlow / Math.pow(1 + discountRate, t);
    presentValueForecastPeriod += discountedCashFlow;
  }

  // Calculate Terminal Value using the Gordon Growth Model
  // This is the value of all cash flows beyond the explicit forecast period
  // The cash flow for the first year after the explicit forecast period
  const cashFlowYearAfterForecast = projectedCashFlow * (1 + perpetualGrowthRate);

  // Terminal Value at the end of the explicit forecast period
  const terminalValue = cashFlowYearAfterForecast / (discountRate - perpetualGrowthRate);

  // Discount the Terminal Value back to today
  const presentValueTerminalValue = terminalValue / Math.pow(1 + discountRate, explicitForecastYears);

  // Total Intrinsic Value
  const intrinsicValue = presentValueForecastPeriod + presentValueTerminalValue;

  // Round to 2 decimal places for typical currency display
  return parseFloat(intrinsicValue.toFixed(2));
}
