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
    <div className="mt-3">
      <label htmlFor="country" className="block text-sm font-medium text-slate-200">
        Country
      </label>
      {error && (
        <div className="mt-2 rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}
      <select
        id="country"
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
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

