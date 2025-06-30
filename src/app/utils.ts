export function formatDate(dateString: string): string {
  if (!dateString) return 'No date';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
