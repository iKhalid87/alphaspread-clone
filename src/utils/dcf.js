export function calculateDCF(overview) {
  const earnings = parseFloat(overview.EPS);
  const growthRate = 0.1; // assumed 10%
  const discountRate = 0.08; // 8% WACC
  const years = 5;

  let sum = 0;
  for (let t = 1; t <= years; t++) {
    sum += (earnings * Math.pow(1 + growthRate, t)) / Math.pow(1 + discountRate, t);
  }

  const terminalValue = (earnings * Math.pow(1 + growthRate, years) * (1 + growthRate)) /
    ((discountRate - growthRate) * Math.pow(1 + discountRate, years));

  return sum + terminalValue;
}