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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Global Address Management System
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage country-specific address formats and search stored addresses.
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-10 lg:grid-cols-2">
        <section className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 shadow">
            <h2 className="text-lg font-semibold">Select Country</h2>
            <CountrySelector value={country} onChange={setCountry} />
          </div>
          <DynamicAddressForm
            selectedCountry={country}
            onCreated={handleCreated}
          />
        </section>

        <section>
          <AddressSearch refreshToken={refreshToken} />
        </section>
      </main>
    </div>
  );
};

export default HomePage;

