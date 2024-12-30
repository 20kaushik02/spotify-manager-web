/**
 * Returns a string with zero padding of the number
 *
 * @param {number} num Input number (positive integer only, for now)
 * @param {number} places Number of zeroes to pad
 * @param {"before" | "after"} position Position of zeroes
 * @returns {string} Zero-padded string
 */
export const zeroPaddedString = (num, places, position) => {
  if (num < 0) throw new Error("negative number");
  if (places < 0) throw new Error("invalid number of zeroes");
  if (position !== "before" && position !== "after") throw new Error("invalid position (before or after only)");

  const zeroes = "0".repeat(places);
  return position === "before" ? '' + zeroes + num : '' + num + zeroes;
}
