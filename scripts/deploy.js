import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function main() {
  console.log("🚀 Deploying CampusPayToken contract...");
  
  // Get the contract factory
  const CampusPayToken = await ethers.getContractFactory("CampusPayToken");
  
  // Deploy the contract
  const campusPayToken = await CampusPayToken.deploy();
  
  // Wait for deployment
  await campusPayToken.waitForDeployment();
  
  const contractAddress = await campusPayToken.getAddress();
  
  console.log("✅ CampusPayToken deployed to:", contractAddress);
  console.log("🎯 Network:", (await ethers.provider.getNetwork()).name);
  console.log("⛽ Gas used for deployment:", (await campusPayToken.deploymentTransaction().wait()).gasUsed.toString());
  
  // Log some initial contract state
  const name = await campusPayToken.name();
  const symbol = await campusPayToken.symbol();
  const decimals = await campusPayToken.decimals();
  const totalSupply = await campusPayToken.totalSupply();
  
  console.log("\n📋 Contract Details:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Decimals:", decimals.toString());
  console.log("Total Supply:", ethers.formatUnits(totalSupply, decimals), symbol);
  
  // Save deployment info to a file
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: (await ethers.provider.getNetwork()).name,
    deployedAt: new Date().toISOString(),
    contractName: "CampusPayToken",
    symbol: symbol,
    decimals: decimals.toString()
  };
  
  if (!fs.existsSync('./deployments')) {
    fs.mkdirSync('./deployments');
  }
  
  fs.writeFileSync(
    './deployments/localhost.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("💾 Deployment info saved to deployments/localhost.json");
  console.log("\n🎉 Deployment complete! Update your frontend with the contract address above.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
