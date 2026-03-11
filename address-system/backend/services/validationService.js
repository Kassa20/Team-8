const { getCountrySchema } = require("./countryService");

async function validateAddressPayload(payload) {
  const issues = [];

  if (!payload || typeof payload !== "object") {
    return { ok: false, issues: [{ message: "Invalid body" }] };
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const country = typeof payload.country === "string" ? payload.country.trim() : "";
  const address = payload.address && typeof payload.address === "object" ? payload.address : {};

  if (!name) issues.push({ message: "name is required", path: ["name"] });
  if (!country) issues.push({ message: "country is required", path: ["country"] });

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const schema = await getCountrySchema(country);
  if (!schema) {
    return { ok: false, issues: [{ message: "Unsupported country", path: ["country"] }] };
  }

  // Field-level required + pattern + options validation
  for (const f of schema.fields || []) {
    const rawVal = address[f.name];
    const val = typeof rawVal === "string" ? rawVal.trim() : rawVal;

    if (f.required && (val === undefined || val === null || val === "")) {
      issues.push({ message: `${f.name} is required`, path: ["address", f.name] });
      continue;
    }

    if (val != null && val !== "" && f.options && Array.isArray(f.options) && f.options.length > 0) {
      if (!f.options.includes(val)) {
        issues.push({ message: `${f.name} must be one of: ${f.options.join(", ")}`, path: ["address", f.name] });
      }
    }

    if (val != null && val !== "" && f.pattern) {
      try {
        const re = new RegExp(f.pattern, "i");
        if (!re.test(String(val))) {
          issues.push({ message: `${f.name} is invalid`, path: ["address", f.name] });
        }
      } catch {
        // Ignore bad regex patterns
      }
    }
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const normalizedAddress = {};
  for (const f of schema.fields || []) {
    const rawVal = address[f.name];
    if (rawVal == null || rawVal === "") continue;
    normalizedAddress[f.name] = String(rawVal);
  }

  return {
    ok: true,
    data: {
      name,
      country: country.toUpperCase(),
      address: normalizedAddress,
    },
  };
}

module.exports = {
  validateAddressPayload,
};

