import React, { useEffect, useState } from "react";
import CountrySelector from "../components/CountrySelector";
import DynamicAddressForm from "../components/DynamicAddressForm";
import AddressSearch from "../components/AddressSearch";
import GlobalAddressSearch from "../components/GlobalAddressSearch";
import { fetchCountries } from "../services/api";


const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countriesError, setCountriesError] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    const loadCountries = async () => {
      setCountriesLoading(true);
      setCountriesError("");
      try {
        const res = await fetchCountries();
        setCountries(res.data || []);
      } catch (err) {
        console.error("Failed to load countries", err);
        setCountriesError("Could not load countries. Make sure backend is running on port 5000.");
      } finally {
        setCountriesLoading(false);
      }
    };
    loadCountries();
  }, []);

  return (
    <div className="layout">
      <header className="header">
        <h1>Address Management System</h1>
        <p className="subtitle">
          Manage country-specific address formats and search stored addresses.
        </p>
      </header>

      <main className="main">
        <section className="left-panel">
          <div className="card">
            <h2>Select Country</h2>
            <CountrySelector
              value={country}
              onChange={setCountry}
              countries={countries}
              loading={countriesLoading}
              error={countriesError}
            />
          </div>

          <DynamicAddressForm selectedCountry={country} />
        </section>
        <section className="right-panel">
          <AddressSearch />
          <GlobalAddressSearch countries={countries} />
        </section>
      </main>
    </div>
  );
};

export default HomePage;

