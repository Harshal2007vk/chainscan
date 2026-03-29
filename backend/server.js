require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const qrRoutes   = require("./routes/qr");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api",      qrRoutes);
app.get("/", (_, res) => res.json({ status: "Running" }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server on http://localhost:" + (process.env.PORT || 5000)));
  })
  .catch(err => { console.error(err); process.exit(1); });
