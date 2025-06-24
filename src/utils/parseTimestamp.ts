const SECOND_MS = 1_000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

// Pads single digits with leading zero
const pad = (n: number): string => n.toString().padStart(2, "0");

// Formats timestamp to UTC string (YYYY-MM-DD HH:mm:ss)
const formatUTC = (timestamp: number): string => {
  const date = new Date(timestamp);
  const yyyy = date.getUTCFullYear();
  const mm = pad(date.getUTCMonth() + 1);
  const dd = pad(date.getUTCDate());
  const hh = pad(date.getUTCHours());
  const min = pad(date.getUTCMinutes());
  const ss = pad(date.getUTCSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

// Converts timestamp difference to human-readable relative time
const formatAge = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 0) return "in the future";
  if (diff < 5 * SECOND_MS) return "just now";
  if (diff < MINUTE_MS) return `${Math.floor(diff / SECOND_MS)}s ago`;
  if (diff < HOUR_MS) return `${Math.floor(diff / MINUTE_MS)}min ago`;
  if (diff < DAY_MS) return `${Math.floor(diff / HOUR_MS)}hr ago`;
  if (diff < MONTH_MS) return `${Math.floor(diff / DAY_MS)}d ago`;
  if (diff < YEAR_MS) return `${Math.floor(diff / MONTH_MS)}mo ago`;

  return `${Math.floor(diff / YEAR_MS)}yr ago`;
};

/**
 * Parses a Unix timestamp into UTC format and human-readable age.
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Object with utc (YYYY-MM-DD HH:mm:ss) and age (e.g., "5min ago")
 */
const parseTimestamp = (timestamp: number): { utc: string; age: string } => {
  if (!Number.isFinite(timestamp) || timestamp < 0) {
    throw new Error("Invalid timestamp: must be a positive finite number");
  }

  return { utc: formatUTC(timestamp), age: formatAge(timestamp) };
};

export default parseTimestamp;
