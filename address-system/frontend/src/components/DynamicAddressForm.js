import React, { useEffect, useState } from "react";
import { fetchCountrySchema, createAddress } from "../services/api";

const DynamicAddressForm = ({ selectedCountry, onCreated }) => {
  const [schema, setSchema] = useState([]);
  const [name, setName] = useState("");
  const [fields, setFields] = useState({});
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedCountry) {
      setSchema([]);
      setFields({});
      return;
    }
    const loadSchema = async () => {
      try {
        const res = await fetchCountrySchema(selectedCountry);
        setSchema(res.data?.fields || []);
        const initial = {};
        (res.data?.fields || []).forEach((f) => {
          initial[f.name] = f.defaultValue ?? "";
        });
        setFields(initial);
        setFieldErrors({});
      } catch (err) {
        console.error("Failed to load schema", err);
      }
    };
    loadSchema();
  }, [selectedCountry]);

  const handleChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    const missingRequired = schema.filter(
      (f) => f.required && !fields[f.name]?.trim()
    );
    if (missingRequired.length > 0) {
      setError("Please fill all required address fields.");
      return;
    }

    // Regex validations (e.g., postal code formats)
    const nextFieldErrors = {};
    schema.forEach((f) => {
      if (!f.pattern) return;
      const val = fields[f.name];
      if (!val) return;
      try {
        const re = new RegExp(f.pattern, "i");
        if (!re.test(String(val))) nextFieldErrors[f.name] = `${f.name} is invalid`;
      } catch {
        // If pattern is malformed, skip client-side validation
      }
    });
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError("Please fix the highlighted fields.");
      return;
    }

    try {
      setSubmitting(true);
      await createAddress({
        name,
        country: selectedCountry,
        address: fields,
      });
      setName("");
      setFields(
        schema.reduce((acc, f) => {
          acc[f.name] = f.defaultValue ?? "";
          return acc;
        }, {})
      );
      setFieldErrors({});
      if (onCreated) onCreated();
    } catch (err) {
      console.error("Failed to create address", err);
      setError("Failed to save address. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedCountry) {
    return (
      <p className="text-sm text-slate-400">
        Select a country to enter an address.
      </p>
    );
  }

  return (
    <form
      className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 shadow"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-semibold">Add Address</h2>
      {error && (
        <div className="mt-3 rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}
      <div className="mt-3">
        <label htmlFor="name" className="block text-sm font-medium text-slate-200">
          Name
        </label>
        <input
          id="name"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
        />
      </div>

      {schema.map((field) => (
        <div className="mt-3" key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-slate-200"
          >
            {field.name}{" "}
            {field.required && <span className="text-orange-300">*</span>}
          </label>
          {field.type === "select" && Array.isArray(field.options) ? (
            <select
              id={field.name}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={fields[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              <option value="">{`Select ${field.name}`}</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              type="text"
              value={fields[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.name}
            />
          )}
          {fieldErrors[field.name] && (
            <div className="mt-1 text-xs text-red-300">
              {fieldErrors[field.name]}
            </div>
          )}
        </div>
      ))}

      <button
        className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-medium text-white shadow disabled:opacity-60"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
};

export default DynamicAddressForm;

