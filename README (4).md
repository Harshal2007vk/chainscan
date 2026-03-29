# ⬡ ChainScan — Multi-Role QR Blockchain System

> Ek hi QR code scan karo — alag role = alag data! Powered by Solidity + Node.js + React + MongoDB.

---

## 🎯 Features

- 📷 QR Code scan karo (Camera ya Manual)
- 🔐 Role-based data filtering (Supplier / Wholesaler / Customer)
- ⛓️ Blockchain pe product data stored (Solidity Smart Contract)
- 🗄️ MongoDB mein user auth + scan logs
- 📊 Supplier ko poora data + scan history

---

## 🛠️ Requirements

Ye install karo pehle:

| Software | Download |
|----------|----------|
| Node.js (LTS) | https://nodejs.org |
| MongoDB Community | https://www.mongodb.com/try/download/community |
| Git | https://git-scm.com |

---

## 🚀 Setup — Step by Step

### Step 1 — Clone karo

```bash
git clone https://github.com/Harshal2007vk/chainscan.git
cd chainscan
```

### Step 2 — Dependencies install karo

**3 alag terminals mein:**

```bash
# Terminal 1 - Blockchain
cd blockchain
npm install

# Terminal 2 - Backend
cd backend
npm install

# Terminal 3 - Frontend
cd frontend
npm install
```

### Step 3 — Blockchain start karo

**Terminal 1 mein (band mat karna!):**
```bash
cd blockchain
npx hardhat node
```

### Step 4 — Contract deploy karo

**Naya terminal mein:**
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

✅ Ye automatically CONTRACT_ADDRESS .env mein save kar dega!

### Step 5 — Demo users banao

```bash
cd backend
node seed.js
```

### Step 6 — Backend start karo

**Terminal 2 mein (band mat karna!):**
```bash
cd backend
npm run dev
```

### Step 7 — Frontend start karo

**Terminal 3 mein:**
```bash
cd frontend
npm start
```

🌐 Browser automatically khulega: **http://localhost:3000**

---

## 🔑 Login Credentials

| Email | Password | Role |
|-------|----------|------|
| supplier@demo.com | demo1234 | Supplier (Full Access) |
| wholesaler@demo.com | demo1234 | Wholesaler |
| customer@demo.com | demo1234 | Customer |

---

## 📱 Test kaise karein

1. Login karo
2. **Manual tab** pe jao
3. `PROD-001` ya `PROD-002` type karo
4. **Verify** dabao
5. Alag roles se login karke same QR scan karo — **alag data dikhega!**

---

## 👁️ Role-wise Data

| Field | Customer | Wholesaler | Supplier |
|-------|----------|------------|----------|
| Product Name | ✅ | ✅ | ✅ |
| Origin | ✅ | ❌ | ✅ |
| Expiry Date | ✅ | ✅ | ✅ |
| Shipment Route | ❌ | ✅ | ✅ |
| Bulk Price | ❌ | ✅ | ✅ |
| Cost Price | ❌ | ❌ | ✅ |
| Scan History | ❌ | ❌ | ✅ |
| Generate QR | ❌ | ❌ | ✅ |

---

## 🏗️ Project Structure

```
chainscan/
├── blockchain/          ← Solidity Smart Contract (Hardhat)
│   ├── contracts/
│   │   └── SupplyChain.sol
│   └── scripts/
│       └── deploy.js
├── backend/             ← Node.js + Express + MongoDB
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── blockchain/
└── frontend/            ← React App
    └── src/
        └── components/
```

---

## ⚠️ Important Notes

- Blockchain terminal **band mat karna** jab tak app use kar rahe ho
- Backend terminal **band mat karna**
- MongoDB service **chalu honi chahiye**
- Sab localhost pe hi chalega

---

Made with ❤️ — ChainScan Team
