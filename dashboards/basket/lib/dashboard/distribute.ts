// Preserve integer totals, including rounding remainders, across weighted buckets.
export function distribute(total: number, weights: number[]) {
  const sum = weights.reduce((a, b) => a + b, 0);
  let cumulative = 0;
  let allocated = 0;
  return weights.map(weight => {
    cumulative += sum ? weight / sum : 1 / weights.length;
    const next = Math.round(total * cumulative);
    const value = next - allocated;
    allocated = next;
    return value;
  });
}
