// src/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  type: { type: String, enum: ["purchase", "sales"], required: true },
  date: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
  totalQuantity: { type: Number, required: true},
});

orderSchema.index({ type: 1, date: -1 });

module.exports = mongoose.model("Order", orderSchema);
