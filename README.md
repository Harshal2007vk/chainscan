# ⬡ ChainScan — Multi-Role QR Blockchain System

Ek hi QR code scan karo — alag role = alag data!

## Requirements
- Node.js: https://nodejs.org
- MongoDB: https://www.mongodb.com/try/download/community

## Setup

### Step 1 - Clone karo
git clone https://github.com/Harshal2007vk/chainscan.git
cd chainscan

### Step 2 - Install karo (3 alag terminals)
cd blockchain && npm install
cd backend && npm install
cd frontend && npm install

### Step 3 - Blockchain start karo (band mat karna!)
cd blockchain
npx hardhat node

### Step 4 - Contract deploy karo (naye terminal mein)
cd blockchain
npx hardhat run scripts/deploy.js --network localhost

### Step 5 - Demo users banao
cd backend
node seed.js

### Step 6 - Backend start karo (band mat karna!)
cd backend
npm run dev

### Step 7 - Frontend start karo
cd frontend
npm start

Browser: http://localhost:3000

## Login
- supplier@demo.com / demo1234
- wholesaler@demo.com / demo1234
- customer@demo.com / demo1234

## Test
Manual tab mein PROD-001 ya PROD-002 type karo → Verify dabao

## Role-wise Data
| Field | Customer | Wholesaler | Supplier |
|-------|----------|------------|----------|
| Name | ✅ | ✅ | ✅ |
| Origin | ✅ | ❌ | ✅ |
| Expiry | ✅ | ✅ | ✅ |
| Shipment | ❌ | ✅ | ✅ |
| Bulk Price | ❌ | ✅ | ✅ |
| Cost Price | ❌ | ❌ | ✅ |
| Scan Logs | ❌ | ❌ | ✅ |
| Generate QR | ❌ | ❌ | ✅ |
