const mongoose = require("mongoose");

const orderPartSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  part: { type: mongoose.Schema.Types.ObjectId, ref: "Parts", required: true },
  quantity: { type: Number, required: true },
  amount_single: { type: Number, required: true },
  serialNumbers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SerialNumber",
    required: true,
  }],
});

orderPartSchema.index({ order: 1 });
orderPartSchema.index({ part: 1 });

module.exports = mongoose.model("OrderPart", orderPartSchema);
