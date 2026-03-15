import React, { useEffect, useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";
import {
  fetchCountrySchema,
  createAddress,
  fetchAddressOptions,
  resolveAddress,
} from "../services/api";

const DynamicAddressForm = ({ selectedCountry, onCreated }) => {
  const [schema, setSchema] = useState([]);
  const [name, setName] = useState("");
  const [nameOptions, setNameOptions] = useState([]);
  const [fields, setFields] = useState({});
  const [fieldOptions, setFieldOptions] = useState({});
  const [loadingFields, setLoadingFields] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const debounceTimers = useRef({});


  useEffect(() => {
    if (!selectedCountry) {
      setSchema([]);
      setFields({});
      setFieldOptions({});
      setName("");
      setNameOptions([]);
      return;
    }

    const loadSchema = async () => {
      try {
        setError("");
        const res = await fetchCountrySchema(selectedCountry);
        const loadedFields = (res.data?.fields || []).filter(
          (field) => field.name !== "name" && field.name !== "country"
        );
        setSchema(loadedFields);

        const initialFields = {};
        const initialOptions = {};

        loadedFields.forEach((field) => {
          initialFields[field.name] = field.defaultValue || "";

          if (field.source === "static") {
            initialOptions[field.name] = (field.options || []).map((option) =>
              typeof option === "string"
                ? { value: option, label: option }
                : { value: option.value, label: option.label }
            );
          } else {
            initialOptions[field.name] = [];
          }
        });

        setFields(initialFields);
        setFieldOptions(initialOptions);
      } catch (err) {
        console.error("Failed to load schema", err);
        setError("Failed to load address form.");
      }
    };

    loadSchema();

    return () => {
      const timers = debounceTimers.current;
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, [selectedCountry]);

  const debounceFetch = (key, fn, delay = 300) => {
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
    }

    debounceTimers.current[key] = setTimeout(() => {
      fn();
    }, delay);
  };

  const getDirectDependents = (fieldName) => {
    return schema
      .filter((field) => (field.dependsOn || []).includes(fieldName))
      .map((field) => field.name);
  };

  const clearDependentBranch = (fieldName, nextFields, nextOptions) => {
    nextFields[fieldName] = "";
    nextOptions[fieldName] = [];

    const children = getDirectDependents(fieldName);
    children.forEach((child) =>
      clearDependentBranch(child, nextFields, nextOptions)
    );
  };

  const isFieldDisabled = (field) => {
    if (!field.dependsOn || field.dependsOn.length === 0) return false;

    return field.dependsOn.some((dep) => {
      if (dep === "name") return !String(name || "").trim();
      return !String(fields[dep] || "").trim();
    });
  };

  const loadNameOptions = async (inputValue = "") => {
    if (!selectedCountry) return;

    try {
      setLoadingFields((prev) => ({ ...prev, name: true }));

      const res = await fetchAddressOptions({
        country: selectedCountry,
        field: "name",
        q: inputValue,
      });

      const options = (res.data?.options || []).map((option) => ({
        value: option,
        label: option,
      }));

      setNameOptions(options);
    } catch (err) {
      console.error("Failed to load name options", err);
    } finally {
      setLoadingFields((prev) => ({ ...prev, name: false }));
    }
  };

  const loadFieldOptions = async (field, inputValue = "") => {
    if (!selectedCountry || field.source !== "lookup") return;

    const params = {
      country: selectedCountry,
      field: field.name,
      q: inputValue,
    };

    (field.dependsOn || []).forEach((dep) => {
      if (dep === "name") {
        if (name) params.name = name;
      } else if (fields[dep]) {
        params[dep] = fields[dep];
      }
    });

    try {
      setLoadingFields((prev) => ({ ...prev, [field.name]: true }));

      const res = await fetchAddressOptions(params);
      const options = (res.data?.options || []).map((option) => ({
        value: option,
        label: option,
      }));

      setFieldOptions((prev) => ({
        ...prev,
        [field.name]: options,
      }));
    } catch (err) {
      console.error(`Failed to load options for ${field.name}`, err);
    } finally {
      setLoadingFields((prev) => ({ ...prev, [field.name]: false }));
    }
  };

  const tryResolveZip = async (nextFields) => {
    const zipField = schema.find((field) => field.autoFill);
    if (!zipField) return;

    const requiredDeps = zipField.dependsOn || [];
    const hasAllDeps = requiredDeps.every((dep) => {
      if (dep === "name") return !!String(name || "").trim();
      return !!String(nextFields[dep] || "").trim();
    });

    if (!hasAllDeps) return;

    const params = { country: selectedCountry, name };

    requiredDeps.forEach((dep) => {
      if (dep !== "name") {
        params[dep] = nextFields[dep];
      }
    });

    try {
      setLoadingFields((prev) => ({ ...prev, [zipField.name]: true }));
      const res = await resolveAddress(params);
      const postalValue = res.data?.postalCode || "";
      const postalField = res.data?.field;

      if (postalValue && postalField) {
        setFields((prev) => ({
          ...prev,
          [postalField]: postalValue,
        }));
      }
    } catch (err) {
      console.error("Failed to resolve zip", err);
    } finally {
      setLoadingFields((prev) => ({ ...prev, [zipField.name]: false }));
    }
  };

  const handleNameChange = (value) => {
    const nextFields = { ...fields };
    const nextOptions = { ...fieldOptions };

    setName(value);

    schema
      .filter((field) => (field.dependsOn || []).includes("name"))
      .forEach((field) =>
        clearDependentBranch(field.name, nextFields, nextOptions)
      );

    setFields(nextFields);
    setFieldOptions(nextOptions);
  };

  const handleFieldChange = async (fieldName, value) => {
    const nextFields = { ...fields, [fieldName]: value };
    const nextOptions = { ...fieldOptions };

    const dependents = getDirectDependents(fieldName);
    dependents.forEach((child) =>
      clearDependentBranch(child, nextFields, nextOptions)
    );

    setFields(nextFields);
    setFieldOptions(nextOptions);

    await tryResolveZip(nextFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const missingRequired = schema.filter(
      (field) => field.required && !String(fields[field.name] || "").trim()
    );

    if (missingRequired.length > 0) {
      setError("Please fill all required address fields.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await createAddress({
        name,
        country: selectedCountry,
        address: fields,
      });

      setName("");
      setNameOptions([]);

      const resetFields = {};
      const resetOptions = {};

      schema.forEach((field) => {
        resetFields[field.name] = field.defaultValue || "";
        resetOptions[field.name] =
          field.source === "static"
            ? (field.options || []).map((option) =>
              typeof option === "string"
                ? { value: option, label: option }
                : { value: option.value, label: option.label }
            )
            : [];
      });

      setFields(resetFields);
      setFieldOptions(resetOptions);

      if (onCreated) onCreated(res.data);
    } catch (err) {
      console.error("Failed to create address", err);
      setError("Failed to save address. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedCountry) {
    return <p className="hint">Select a country to enter an address.</p>;
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Add Address</h2>

      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label htmlFor="name">
          Name
          <span className="required">*</span>
        </label>
        <CreatableSelect
          className="address-select"
          classNamePrefix="address-select"
          inputId="name"
          options={nameOptions}
          value={name ? { value: name, label: name } : null}
          onFocus={() => loadNameOptions("")}
          onMenuOpen={() => loadNameOptions("")}
          onInputChange={(inputValue, meta) => {
            if (meta.action === "input-change") {
              debounceFetch("name", () => loadNameOptions(inputValue));
            }
          }}
          onChange={(selected) =>
            handleNameChange(selected ? selected.value : "")
          }
          onCreateOption={(inputValue) => handleNameChange(inputValue)}
          placeholder="Select or type full name"
          isClearable
          isLoading={!!loadingFields.name}
          openMenuOnFocus
          openMenuOnClick
          formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
          noOptionsMessage={() =>
            loadingFields.name ? "Loading..." : "No matching names"
          }
          filterOption={(candidate, inputValue) => {
            if (!inputValue) return true;
            return candidate.label
              .toLowerCase()
              .includes(inputValue.toLowerCase());
          }}
        />
      </div>

      {schema.map((field) => {
        const currentValue = fields[field.name] || "";
        const options = fieldOptions[field.name] || [];
        const selectedOption = currentValue
          ? { value: currentValue, label: currentValue }
          : null;
        const disabled = isFieldDisabled(field);

        return (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>
              {field.label || field.name}
              {field.required && <span className="required">*</span>}
            </label>

            {field.type === "select" ? (
              <CreatableSelect
                className="address-select"
                classNamePrefix="address-select"
                inputId={field.name}
                options={options}
                value={selectedOption}
                onFocus={() => {
                  if (!disabled && field.source === "lookup") {
                    loadFieldOptions(field, "");
                  }
                }}
                onMenuOpen={() => {
                  if (!disabled && field.source === "lookup") {
                    loadFieldOptions(field, "");
                  }
                }}
                onInputChange={(inputValue, meta) => {
                  if (
                    !disabled &&
                    field.source === "lookup" &&
                    meta.action === "input-change"
                  ) {
                    debounceFetch(field.name, () =>
                      loadFieldOptions(field, inputValue)
                    );
                  }
                }}
                onChange={(selected) =>
                  handleFieldChange(field.name, selected ? selected.value : "")
                }
                onCreateOption={(inputValue) =>
                  handleFieldChange(field.name, inputValue)
                }
                placeholder={
                  field.placeholder ||
                  `Select or type ${field.label || field.name}`
                }
                isClearable
                isDisabled={disabled || field.readOnly}
                isLoading={!!loadingFields[field.name]}
                openMenuOnFocus
                openMenuOnClick
                formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
                noOptionsMessage={() =>
                  disabled
                    ? "Select previous fields first"
                    : loadingFields[field.name]
                      ? "Loading..."
                      : "No matching options"
                }
                filterOption={(candidate, inputValue) => {
                  if (!inputValue) return true;
                  return candidate.label
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                }}
              />
            ) : (
              <input
                id={field.name}
                className="input"
                type="text"
                value={currentValue}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder || field.label || field.name}
                disabled={disabled || field.readOnly}
                readOnly={field.readOnly}
              />
            )}
          </div>
        );
      })}
    </form>

  )

};

export default DynamicAddressForm;
