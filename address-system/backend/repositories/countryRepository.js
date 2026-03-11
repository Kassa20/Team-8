const Country = require("../models/Country");

async function list() {
  return Country.find({}, { _id: 0, __v: 0 }).sort({ name: 1 });
}

async function findByCode(code) {
  return Country.findOne({ code: code.toUpperCase() }, { _id: 0, __v: 0 });
}

async function count() {
  return Country.estimatedDocumentCount();
}

async function insertMany(docs) {
  return Country.insertMany(docs);
}

module.exports = {
  list,
  findByCode,
  count,
  insertMany,
};

