const mongoose = require("mongoose");
const scanLogSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productId: { type: String, required: true },
  role:      { type: String, required: true },
  scannedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
});
module.exports = mongoose.model("ScanLog", scanLogSchema);
