export const calculateCorrelation = (x, y) => {
    const n = x.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXSquare = 0;
    let sumYSquare = 0;
  
    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumXSquare += x[i] * x[i];
      sumYSquare += y[i] * y[i];
    }
  
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXSquare - sumX * sumX) * (n * sumYSquare - sumY * sumY));
  
    if (denominator === 0) {
      // Handle division by zero
      return 0;
    }
  
    return numerator / denominator;
  };
  