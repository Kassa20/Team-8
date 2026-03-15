import axios from "axios";

const computedDefaultBaseUrl = (() => {
  if (process.env.REACT_APP_API_BASE_URL) return process.env.REACT_APP_API_BASE_URL;
  if (typeof window !== "undefined" && window.location?.hostname) {
    return `http://${window.location.hostname}:5000`;
  }
  return "http://localhost:5000";
})();

const api = axios.create({
  baseURL: computedDefaultBaseUrl,
});

export const fetchCountries = () => api.get("/api/countries");

export const fetchCountrySchema = (code) =>
  api.get(`/api/countries/${code}/schema`);

export const searchAddresses = (params) =>
  api.get("/api/addresses/search", { params });

export const fetchAddressOptions = (params) =>
  api.get("/api/addresses/options", { params });

export const resolveAddress = (params) =>
  api.get("/api/addresses/resolve", { params });


export default api;

