const mongoose = require("mongoose");

//to be decided weather to embed serialNumberSChema or reference it create a different model

const serialNumberSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ["inwarded", "sold"], default: "inwarded" },
  partId: { type: mongoose.Schema.Types.ObjectId, ref: "Part", required: true },
});

serialNumberSchema.index({ serialNumber: 1 });

module.exports = mongoose.model("SerialNumber", serialNumberSchema);
