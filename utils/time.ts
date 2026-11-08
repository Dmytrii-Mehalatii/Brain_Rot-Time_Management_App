type FormatOptions = {
  /** Render "45m" instead of "0h 45m" when there are no whole hours. */
  omitZeroHours?: boolean;
};

export function formatMinutes(
  totalMinutes: number,
  { omitZeroHours = false }: FormatOptions = {},
): string {
  const rounded = Math.round(totalMinutes);
  const hours = Math.floor(rounded / 60);
  const minutes = rounded % 60;

  if (omitZeroHours && hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export const secondsToMinutes = (seconds: number) => seconds / 60;
