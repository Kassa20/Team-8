const addressRepo = require("../repositories/addressRepository");
const { buildNormalizedAddressString, normalizeText } = require("./normalizeService");
const { validateAddressPayload } = require("./validationService");

async function createAddress(payload) {
  const validated = await validateAddressPayload(payload);
  if (!validated.ok) {
    return { ok: false, status: 400, error: { message: "Validation failed", issues: validated.issues } };
  }

  const normalized = buildNormalizedAddressString(validated.data);
  const created = await addressRepo.create({ ...validated.data, normalized });
  return { ok: true, data: created };
}

async function getById(id) {
  const found = await addressRepo.findById(id);
  if (!found) return { ok: false, status: 404, error: { message: "Address not found" } };
  return { ok: true, data: found };
}

async function search({ name, country, q, limit = 100, ...rest }) {
  const filter = {};

  if (country) filter.country = String(country).toUpperCase();
  if (name) filter.name = { $regex: String(name), $options: "i" };

  // Generic structured field search: any query param that isn't name/country/q/limit
  for (const [key, value] of Object.entries(rest)) {
    if (value == null || value === "") continue;
    filter[`address.${key}`] = { $regex: String(value), $options: "i" };
  }

  if (q) {
    const nq = normalizeText(q);
    filter.normalized = { $regex: nq, $options: "i" };
  }

  const results = await addressRepo.search(filter, { limit: Math.min(Number(limit) || 100, 500) });
  return { ok: true, data: results };
}

async function crossSearch({ q, limit = 50 }) {
  const nq = normalizeText(q);
  if (!nq) return { ok: true, data: [] };

  // Simple cross-country partial matching on normalized field; can be replaced by Atlas Search later.
  const filter = {
    $or: [
      { normalized: { $regex: nq, $options: "i" } },
      { $text: { $search: nq } },
    ],
  };

  const results = await addressRepo.search(filter, { limit: Math.min(Number(limit) || 50, 200) });
  return { ok: true, data: results };
}

module.exports = {
  createAddress,
  getById,
  search,
  crossSearch,
};

