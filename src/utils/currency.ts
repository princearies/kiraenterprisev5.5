// Currency-safe utilities - uses integer cents to avoid floating-point issues

export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export function formatCurrency(amount: number, currency: string = 'MYR'): string {
  const value = typeof amount === 'number' && amount % 1 !== 0 ? amount : fromCents(amount);
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export function addCurrency(a: number, b: number): number {
  return a + b; // Both in cents - integer addition is safe
}

export function subtractCurrency(a: number, b: number): number {
  return a - b;
}

export function multiplyCurrency(amount: number, factor: number): number {
  return Math.round(amount * factor);
}

export function calculateTax(baseAmount: number, ratePercent: number): number {
  return Math.round(baseAmount * ratePercent / 100);
}

export function validateJournalBalance(lines: { debit: number; credit: number }[]): boolean {
  const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
  const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);
  return totalDebit === totalCredit && totalDebit > 0;
}
