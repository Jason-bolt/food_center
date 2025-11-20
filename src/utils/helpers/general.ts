export function summarizeCulturalStory(
  text: string,
  targetLength = 200,
  maxLength = 280,
): string {
  if (!text) return "";
  if (text.length <= targetLength) return text;

  // Reserve space for ellipsis when truncating
  const hardCap = Math.max(0, maxLength - 3);
  const softTarget = Math.min(targetLength, hardCap);

  // Try to end near the target on a natural boundary (period first, then space)
  const searchEnd = Math.min(hardCap, softTarget + 40);
  const periodIdx = (() => {
    for (let i = softTarget; i < searchEnd; i++) {
      const ch = text[i];
      if (ch === "." || ch === "!" || ch === "?") return i + 1; // include punctuation
    }
    return -1;
  })();

  let cutIdx = periodIdx;
  if (cutIdx === -1) {
    const lastSpace = text.lastIndexOf(" ", searchEnd);
    if (lastSpace >= softTarget - 10) cutIdx = lastSpace; // accept a slight undershoot
  }
  if (cutIdx === -1) cutIdx = softTarget;
  if (cutIdx > hardCap) cutIdx = hardCap;

  return text.slice(0, cutIdx).trimEnd() + "...";
}

// storage.js

/**
 * Sets an item in localStorage with an expiry time.
 * @param {string} key - The key for the localStorage item.
 * @param {T} value - The value to store.
 * @param {number} ttl - Time to live in milliseconds.
 */
export const setWithExpiry = <T>(key: string, value: T, ttl: number) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl, // Calculate the expiry timestamp
  };
  localStorage.setItem(key, JSON.stringify(item)); // Store as a JSON string
};

/**
 * Retrieves an item from localStorage and checks for expiration.
 * @param {string} key - The key for the localStorage item.
 * @returns {any | null} The stored value if valid, otherwise null.
 */
export const getWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);
  // If the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // Compare the expiry time with the current time
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key); // Item has expired, remove it
    return null;
  }
  return item.value; // Return the valid value
};
