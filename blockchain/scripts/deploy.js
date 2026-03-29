const hre = require("hardhat");
const fs   = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying SupplyChain...");
  const SC = await hre.ethers.getContractFactory("SupplyChain");
  const contract = await SC.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("Deployed at:", address);

  // Copy ABI to backend
  const artifact  = JSON.parse(fs.readFileSync(
    path.join(__dirname, "../artifacts/contracts/SupplyChain.sol/SupplyChain.json"), "utf8"
  ));
  const abiDir = path.join(__dirname, "../../backend/blockchain");
  fs.mkdirSync(abiDir, { recursive: true });
  fs.writeFileSync(path.join(abiDir, "SupplyChainABI.json"), JSON.stringify(artifact.abi, null, 2));

  // Write address to backend .env
  const envPath = path.join(__dirname, "../../backend/.env");
  let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  env = env.includes("CONTRACT_ADDRESS=")
    ? env.replace(/CONTRACT_ADDRESS=.*/, "CONTRACT_ADDRESS=" + address)
    : env + "\nCONTRACT_ADDRESS=" + address;
  fs.writeFileSync(envPath, env);
  console.log("ABI + .env updated");

  // Seed demo products
  const now = Math.floor(Date.now() / 1000);
  await contract.addProduct("PROD-001","Amul Full Cream Milk","Anand, Gujarat",
    "Mumbai Warehouse to Delhi Hub", 280, 420, "BT-9821", "4 Degree Cold Chain",
    now - 86400*8, now + 86400*16);
  await contract.addProduct("PROD-002","Tata Salt Premium","Mithapur, Gujarat",
    "Ahmedabad to Nagpur Depot", 18, 28, "BT-4412", "Ambient",
    now - 86400*45, now + 86400*730);

  console.log("Products seeded: PROD-001, PROD-002");
  console.log("Done! Contract:", address);
}

main().catch(e => { console.error(e); process.exit(1); });
