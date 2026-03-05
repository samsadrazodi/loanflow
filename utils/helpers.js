export function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
export function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
export function formatCurrency(n) { return '$' + n.toLocaleString(); }
