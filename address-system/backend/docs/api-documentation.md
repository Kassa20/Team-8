# Address Management API

**Version:** 1.0.0

API documentation for the Address Management System

## Server(s)

- http://localhost:5000

## Addresses

### GET `/api/addresses/search`

**Summary:** Search addresses by name, city, or country

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| name | query | string | No | — |
| city | query | string | No | — |
| country | query | string | No | — |

**Responses:**

| Status Code | Description |
|-------------|-------------|
| 200 | List of matching addresses |

---

### GET `/api/addresses/options`

**Summary:** Get autocomplete options for a specific address field

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| country | query | string | Yes | Country code (e.g. US, CA, UK) |
| field | query | string | Yes | The address field to fetch options for |
| q | query | string | No | Search text to filter options |
| name | query | string | No | Filter by name (used when field is not "name") |
| street | query | string | No | Filter by street (used when field is city, state, or zip) |
| city | query | string | No | Filter by city (used when field is state or zip) |
| state | query | string | No | Filter by state (used when field is zip) |

**Responses:**

| Status Code | Description |
|-------------|-------------|
| 200 | List of unique matching options for the requested field |
| 400 | Missing required parameters or unsupported field |

---

### GET `/api/addresses/resolve`

**Summary:** Resolve a zip code from name and address fields

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| country | query | string | Yes | Country code (e.g. US) |
| name | query | string | Yes | Full name associated with the address |
| street | query | string | Yes | Street address |
| city | query | string | Yes | City name |
| state | query | string | Yes | State or province |

**Responses:**

| Status Code | Description |
|-------------|-------------|
| 200 | Resolved zip code and full address if found |
| 400 | Missing required parameters |

---

## Countries

### GET `/api/countries`

**Summary:** Get supported countries

**Responses:**

| Status Code | Description |
|-------------|-------------|
| 200 | List of countries |

---

### GET `/api/countries/{code}/schema`

**Summary:** Get address schema for a country

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| code | path | string | Yes | — |

**Responses:**

| Status Code | Description |
|-------------|-------------|
| 200 | Address schema for the country |
| 404 | Country not found |

---
