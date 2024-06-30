// src/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  parts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parts",
      required: true,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
