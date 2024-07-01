// src/models/Parts.js
const mongoose = require("mongoose");
// const serialNumberSchema = require("./SerialNumber");

const partsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },

  image: {
    type: String,
    required: false,
  },

  quantity: {
    type: Number,
    default: 0,
  },

  price_single: {
    type: Number,
    required: true,
  },
  
  description: String,
});

partsSchema.index({ name: 1 });
partsSchema.index({ brand: 1 });
partsSchema.index({ warehouse: 1 });
partsSchema.index({ serialNumbers: 1 });
partsSchema.index({ name: 1, brand: 1, warehouse: 1 }, { unique: true });

module.exports = mongoose.model("Parts", partsSchema);
