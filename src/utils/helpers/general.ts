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
