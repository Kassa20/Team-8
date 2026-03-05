import React, { useState } from "react";
import CountrySelector from "../components/CountrySelector";
import DynamicAddressForm from "../components/DynamicAddressForm";
import AddressSearch from "../components/AddressSearch";

const HomePage = () => {
  const [country, setCountry] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);

  const handleCreated = () => {
    setRefreshToken((x) => x + 1);
  };

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
            <CountrySelector value={country} onChange={setCountry} />
          </div>
          <DynamicAddressForm
            selectedCountry={country}
            onCreated={handleCreated}
          />
        </section>

        <section className="right-panel">
          <AddressSearch refreshToken={refreshToken} />
        </section>
      </main>
    </div>
  );
};

export default HomePage;

