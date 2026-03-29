const { Web3 } = require("web3");
const path = require("path");
const fs   = require("fs");

let contract = null, web3 = null;

function getContract() {
  if (contract) return contract;
  const addr = process.env.CONTRACT_ADDRESS;
  if (!addr || addr === "PASTE_ADDRESS_AFTER_DEPLOY")
    throw new Error("CONTRACT_ADDRESS not set — run deploy first");
  const abiPath = path.join(__dirname, "SupplyChainABI.json");
  if (!fs.existsSync(abiPath))
    throw new Error("ABI missing — compile and deploy contract first");
  web3     = new Web3(process.env.BLOCKCHAIN_RPC || "http://127.0.0.1:8545");
  contract = new web3.eth.Contract(JSON.parse(fs.readFileSync(abiPath, "utf8")), addr);
  return contract;
}

async function getProduct(id) {
  const p = await getContract().methods.getProduct(id).call();
  return {
    id: p.id, name: p.name, origin: p.origin, shipment: p.shipment,
    cost: Number(p.cost), bulkPrice: Number(p.bulkPrice),
    batchId: p.batchId, temperature: p.temperature,
    manufacturedDate: new Date(Number(p.manufacturedDate)*1000).toISOString().split("T")[0],
    expiryDate:       new Date(Number(p.expiryDate)*1000).toISOString().split("T")[0],
    scanCount: Number(p.scanCount), verified: true,
  };
}

async function incrementScan(id) {
  const c = getContract();
  const accounts = await web3.eth.getAccounts();
  await c.methods.incrementScanCount(id).send({ from: accounts[0] });
}

async function productExists(id) {
  return getContract().methods.productExists(id).call();
}

module.exports = { getProduct, incrementScan, productExists };
