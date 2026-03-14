const Address = require("../models/Address");

// 1. search API with improved logic
exports.searchAddresses = async (req, res) => {
  try {
    // added address as a general search term for any address field,
    const { name, city, country, address } = req.query; 
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    
    const searchStr = address || city; 
    if (searchStr) {
      filter["$or"] = [
        { "address.street": { $regex: searchStr, $options: "i" } },
        { "address.city": { $regex: searchStr, $options: "i" } },
        { "address.state": { $regex: searchStr, $options: "i" } },
        { "address.province": { $regex: searchStr, $options: "i" } },
        { "address.zip": { $regex: searchStr, $options: "i" } },
        { "address.postalCode": { $regex: searchStr, $options: "i" } }
      ];
    }

    if (country) {
      const codes = country.split(",").map((c) => c.trim().toUpperCase());
      filter.country = { $in: codes };
    }

    // add lean() for better performance and to get plain JS objects
    const results = await Address.find(filter).sort({ createdAt: -1 }).limit(100).lean();

    // delete duplicates based on name + address combination
    const uniqueResults = results.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.name === item.name && JSON.stringify(t.address) === JSON.stringify(item.address)
      ))
    );

    res.json(uniqueResults);
  } catch (error) {
    res.status(500).json({ message: "Failed to search addresses" });
  }
};

// 2. get address options API with improved performance and flexibility
exports.getAddressOptions = async (req, res) => {
  try {
    const { country, field, q = "", name, street, city, state } = req.query;

    if (!country || !field) {
      return res.status(400).json({ message: "country and field are required" });
    }

    // name is not a valid field for options, return empty list to avoid unnecessary DB query
    if (field === "name") {
      return res.json({ options: [] }); 
    }

    const filter = { country: country.toUpperCase() };

    // add additional filters for street, city, state if provided
    if (street) filter["address.street"] = street;
    if (city) filter["address.city"] = city;
    if (state) filter["address.state"] = state;

    // performance: use distinct to get unique values directly from the database
    const dbField = `address.${field}`;
    let uniqueOptions = await Address.distinct(dbField, filter);

    //  
    const searchText = String(q).trim().toLowerCase();
    if (searchText) {
      uniqueOptions = uniqueOptions.filter(val => 
        val && val.toLowerCase().includes(searchText)
      );
    }

    res.json({ options: uniqueOptions.filter(Boolean).sort() });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch address options" });
  }
};

// 3. create address API
exports.createAddress = async (req, res) => {
  try {
    const { name, country, address } = req.body;
    if (!name || !country || !address) {
      return res.status(400).json({ message: "name, country and address are required" });
    }
    const newAddress = await Address.create({ name, country, address });
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: "Failed to create address" });
  }
};

// address resolve API
exports.resolveAddress = async (req, res) => {
  try {
    const { country, name, street, city, state } = req.query;
    const match = await Address.findOne({
      country: country.toUpperCase(),
      name,
      "address.street": street,
      "address.city": city,
      "address.state": state,
    }).lean();
    res.json({ zip: match?.address?.zip || "", address: match });
  } catch (error) {
    res.status(500).json({ message: "Failed to resolve address" });
  }
};