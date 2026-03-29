require("dotenv").config();
const mongoose = require("mongoose");
const User     = require("./models/User");

const USERS = [
  { name: "Supplier Demo",   email: "supplier@demo.com",   password: "demo1234", role: "supplier"   },
  { name: "Wholesaler Demo", email: "wholesaler@demo.com", password: "demo1234", role: "wholesaler" },
  { name: "Customer Demo",   email: "customer@demo.com",   password: "demo1234", role: "customer"   },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to MongoDB");
  for (const u of USERS) {
    if (await User.findOne({ email: u.email })) { console.log("  exists:", u.email); continue; }
    await User.create(u);
    console.log("  created:", u.email, "(" + u.role + ")");
  }
  console.log("Done!"); process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
