/**
 * LoanFlow v2.0 — Shared Utilities
 */

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatCurrency(amount) {
  return '$' + amount.toLocaleString();
}
