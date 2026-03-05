import React, { useEffect, useState } from "react";
import { fetchCountrySchema, createAddress } from "../services/api";

const DynamicAddressForm = ({ selectedCountry, onCreated }) => {
  const [schema, setSchema] = useState([]);
  const [name, setName] = useState("");
  const [fields, setFields] = useState({});
  const [error, setError] = useState("");
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
          initial[f.name] = "";
        });
        setFields(initial);
      } catch (err) {
        console.error("Failed to load schema", err);
      }
    };
    loadSchema();
  }, [selectedCountry]);

  const handleChange = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
          acc[f.name] = "";
          return acc;
        }, {})
      );
      if (onCreated) onCreated();
    } catch (err) {
      console.error("Failed to create address", err);
      setError("Failed to save address. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedCountry) {
    return <p className="hint">Select a country to enter an address.</p>;
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Add Address</h2>
      {error && <div className="error">{error}</div>}
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
        />
      </div>

      {schema.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name}>
            {field.name}
            {field.required && <span className="required">*</span>}
          </label>
          <input
            id={field.name}
            className="input"
            type="text"
            value={fields[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.name}
          />
        </div>
      ))}

      <button className="button primary" type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
};

export default DynamicAddressForm;

