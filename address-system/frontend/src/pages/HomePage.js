import React, { useState } from "react";
import CountrySelector from "../components/CountrySelector";
import DynamicAddressForm from "../components/DynamicAddressForm";
import AddressSearch from "../components/AddressSearch";
import GlobalAddressSearch from "../components/GlobalAddressSearch";


const HomePage = () => {
  const [country, setCountry] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);
  const [latestCreatedAddress, setLatestCreatedAddress] = useState(null);

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
            onCreated={(createdAddress) => {
              setLatestCreatedAddress(createdAddress);
              handleCreated();
            }}
          />
        </section>
        {latestCreatedAddress && (
          <div className="card">
            <h2>Recently Saved Address</h2>
            <p><strong>Name:</strong> {latestCreatedAddress.name}</p>
            <p><strong>Country:</strong> {latestCreatedAddress.country}</p>

            {Object.entries(latestCreatedAddress.address || {}).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        )}

        <section className="right-panel">
          <AddressSearch refreshToken={refreshToken} />
          <GlobalAddressSearch refreshToken={refreshToken} />
        </section>
      </main>
    </div>
  );
};

export default HomePage;

