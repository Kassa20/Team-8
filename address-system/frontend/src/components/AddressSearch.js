import React, { useEffect, useState } from "react";
import { searchAddresses } from "../services/api";

const AddressSearch = ({ refreshToken }) => {
  const [query, setQuery] = useState({ name: "", address: "", country: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (query.name) params.name = query.name;
      if (query.address) params.address = query.address;
      if (query.country) params.country = query.country;
      const res = await searchAddresses(params);
      setResults(res.data || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  //useEffect(() => {
  // Refresh search when a new address is created
  //runSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  //}, [refreshToken]);

  const handleChange = (field, value) => {
    setQuery((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <div className="card">
      <h2> Local Search Addresses</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Search by name"
          value={query.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          className="input"
          placeholder="Search by address (partial ok)"
          value={query.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
        <input
          className="input"
          placeholder="Search by country code"
          value={query.country}
          onChange={(e) => handleChange("country", e.target.value)}
        />
        <button type="submit" className="button">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <table className="results-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.country}</td>
              <td>
                {item.address &&
                  Object.entries(item.address).map(([k, v]) => (
                    <span key={k} className="address-chip">
                      <strong>{k}:</strong> {v}{" "}
                    </span>
                  ))}
              </td>
            </tr>
          ))}
          {results.length === 0 && !loading && (
            <tr>
              <td colSpan="3" className="hint">
                No results yet. Try searching by name, address, or country.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddressSearch;

