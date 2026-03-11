const Address = require("../models/Address");

async function create(doc) {
  return Address.create(doc);
}

async function findById(id) {
  return Address.findById(id);
}

async function search(filter, { limit = 100 } = {}) {
  return Address.find(filter).sort({ createdAt: -1 }).limit(limit);
}

module.exports = {
  create,
  findById,
  search,
};

