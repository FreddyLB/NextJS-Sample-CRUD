export default function parseIntOrNull(value: string | null): number | null {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return null;
  }

  return parseInt(value, 10);
}
