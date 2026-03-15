import React, { useState } from "react";
import { searchAddresses } from "../services/api";

const PAGE_SIZE = 20;

const GlobalAddressSearch = ({ refreshToken, countries = [] }) => {
  const [query, setQuery] = useState({ name: "", address: "" });
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const runSearch = async (targetPage = 1) => {
    setLoading(true);
    try {
      const params = { page: targetPage, limit: PAGE_SIZE };
      if (query.name) params.name = query.name;
      if (query.address) params.address = query.address;
      if (selectedCountries.length > 0) params.country = selectedCountries.join(",");
      const res = await searchAddresses(params);
      setResults(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(targetPage);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setQuery((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCountry = (code) => {
    setSelectedCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <div className="card">
      <h2> Global Search Addresses</h2>
      <fieldset className="country-checkboxes">
        <legend>Filter by country</legend>
        {countries.map((c) => (
          <label key={c.code} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedCountries.includes(c.code)}
              onChange={() => toggleCountry(c.code)}
            />
            {c.name}
          </label>
        ))}
      </fieldset>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Search by name"
          value={query.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          className="input"
          placeholder="Search by address (street, city, zip...)"
          value={query.address}
          onChange={(e) => handleChange("address", e.target.value)}
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
                No results yet. Try searching by name, city, or country.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="pagination">
          <button className="button" disabled={page <= 1} onClick={() => runSearch(page - 1)}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button className="button" disabled={page >= totalPages} onClick={() => runSearch(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default GlobalAddressSearch;

