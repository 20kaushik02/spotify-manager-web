export const zeroPaddedString = (
  num: number,
  places: number,
  position: "before" | "after"
): string => {
  if (num < 0) throw new Error("negative number");
  if (places < 0) throw new Error("invalid number of zeroes");
  if (position !== "before" && position !== "after")
    throw new Error("invalid position (before or after only)");

  const zeroes = "0".repeat(places);
  return position === "before" ? "" + zeroes + num : "" + num + zeroes;
};
