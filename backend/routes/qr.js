const express = require("express");
const QRCode  = require("qrcode");
const auth    = require("../middleware/auth");
const ScanLog = require("../models/ScanLog");
const { getProduct, incrementScan, productExists } = require("../blockchain/contract");
const router  = express.Router();

function filterByRole(product, role) {
  if (role === "customer") return {
    name: product.name, origin: product.origin,
    expiryDate: product.expiryDate, temperature: product.temperature,
    verified: true, authenticity: "BLOCKCHAIN VERIFIED",
  };
  if (role === "wholesaler") return {
    name: product.name, batchId: product.batchId,
    shipment: product.shipment, bulkPrice: product.bulkPrice,
    temperature: product.temperature, manufacturedDate: product.manufacturedDate,
    expiryDate: product.expiryDate, scanCount: product.scanCount, verified: true,
  };
  if (role === "supplier") return product;
  return null;
}

router.get("/scan/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { role, id: userId } = req.user;
    if (!await productExists(productId))
      return res.status(404).json({ error: "Product not found on blockchain" });
    const fullData = await getProduct(productId);
    try { await incrementScan(productId); } catch(_) {}
    await ScanLog.create({ userId, productId, role, ipAddress: req.ip });
    const filtered = filterByRole(fullData, role);
    if (!filtered) return res.status(403).json({ error: "Unknown role" });
    res.json({ role, productId, data: filtered });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/generate-qr", auth, async (req, res) => {
  try {
    if (req.user.role !== "supplier")
      return res.status(403).json({ error: "Only suppliers can generate QR" });
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "productId required" });
    if (!await productExists(productId))
      return res.status(404).json({ error: "Product not on blockchain" });
    const qr = await QRCode.toDataURL(productId, { width: 300, margin: 2 });
    res.json({ productId, qr });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/scan-logs", auth, async (req, res) => {
  try {
    if (req.user.role !== "supplier")
      return res.status(403).json({ error: "Only suppliers can view logs" });
    const logs = await ScanLog.find().populate("userId","name email role")
      .sort({ scannedAt: -1 }).limit(50);
    res.json({ logs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
