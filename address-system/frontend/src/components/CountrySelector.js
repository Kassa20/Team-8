import React, { useEffect, useState } from "react";
import { fetchCountries } from "../services/api";

const CountrySelector = ({ value, onChange }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchCountries();
        setCountries(res.data || []);
      } catch (err) {
        console.error("Failed to load countries", err);
        setError("Could not load countries. Make sure backend is running on port 5000.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="form-group">
      <label htmlFor="country">Country</label>
      {error && <div className="error">{error}</div>}
      <select
        id="country"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading || countries.length === 0}
      >
        <option value="">{loading ? "Loading..." : "Select country"}</option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector;

