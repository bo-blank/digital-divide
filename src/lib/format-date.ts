export function formatDate(date: Date, month: 'short' | 'long' = 'long'): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month,
    day: 'numeric',
    timeZone: 'UTC',
  });
}
