const parseTimestamp = (timestamp: number): string => {
  if (!Number.isFinite(timestamp) || timestamp < 0) {
    throw new Error("Invalid timestamp: must be a positive finite number");
  }

  return new Date(timestamp)
    .toLocaleString("en-GB")
    .replace(",", "")
    .replace(/\//g, "-");
};

export default parseTimestamp;
