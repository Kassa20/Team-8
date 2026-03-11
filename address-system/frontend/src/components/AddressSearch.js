import React, { useEffect, useState } from "react";
import { searchAddresses } from "../services/api";

const AddressSearch = ({ refreshToken }) => {
  const [query, setQuery] = useState({ name: "", city: "", country: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (query.name) params.name = query.name;
      if (query.city) params.city = query.city;
      if (query.country) params.country = query.country;
      const res = await searchAddresses(params);
      setResults(res.data || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Refresh search when a new address is created
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken]);

  const handleChange = (field, value) => {
    setQuery((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 shadow">
      <h2 className="text-lg font-semibold">Search Addresses</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder="Search by name"
          value={query.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder="Search by city"
          value={query.city}
          onChange={(e) => handleChange("city", e.target.value)}
        />
        <input
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder="Search by country code"
          value={query.country}
          onChange={(e) => handleChange("country", e.target.value)}
        />
        <button
          type="submit"
          className="mt-3 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 hover:border-slate-500"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="mt-4 overflow-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-slate-950/60 text-slate-300">
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Country</th>
            <th className="px-3 py-2 font-medium">Address</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item) => (
            <tr key={item._id} className="border-t border-slate-800">
              <td className="px-3 py-2">{item.name}</td>
              <td className="px-3 py-2">{item.country}</td>
              <td className="px-3 py-2">
                {item.address &&
                  Object.entries(item.address).map(([k, v]) => (
                    <span
                      key={k}
                      className="mr-2 mb-2 inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200"
                    >
                      <span className="font-semibold text-slate-300">{k}:</span>{" "}
                      <span>{String(v)}</span>
                    </span>
                  ))}
              </td>
            </tr>
          ))}
          {results.length === 0 && !loading && (
            <tr>
              <td colSpan="3" className="px-3 py-6 text-center text-sm text-slate-400">
                No results yet. Try searching by name, city, or country.
              </td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddressSearch;

