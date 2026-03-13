import React from "react";

const CountrySelector = ({ value, onChange, countries = [], loading = false, error = "" }) => {

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

