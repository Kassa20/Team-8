function normalizeText(input) {
  if (!input) return "";
  return String(input)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function buildNormalizedAddressString({ name, country, address }) {
  const parts = [name, country];
  if (address && typeof address === "object") {
    Object.keys(address)
      .sort()
      .forEach((k) => parts.push(`${k} ${address[k]}`));
  }
  return normalizeText(parts.join(" "));
}

module.exports = {
  normalizeText,
  buildNormalizedAddressString,
};

