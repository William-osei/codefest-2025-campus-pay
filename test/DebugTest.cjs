const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Debug CampusPayToken", function () {
  let campusPayToken;
  let owner;
  let student;

  beforeEach(async function () {
    [owner, student] = await ethers.getSigners();

    const CampusPayToken = await ethers.getContractFactory("CampusPayToken");
    campusPayToken = await CampusPayToken.deploy();
    await campusPayToken.waitForDeployment();
  });

  it("Debug buyTokens calculation", async function () {
    console.log("Testing token purchase...");
    
    // Try to buy 100 tokens (without decimals)
    const tokensToGet = ethers.parseUnits("100", 0); // Just 100, no decimals
    const ethToSend = ethers.parseEther("0.1"); // 0.1 ETH
    
    console.log("Tokens to get:", tokensToGet.toString());
    console.log("ETH to send:", ethToSend.toString());
    
    // Calculate required ETH manually: (100 * 1 ether) / 1000 = 0.1 ETH
    const requiredEth = (tokensToGet * ethers.parseEther("1")) / 1000n;
    console.log("Required ETH:", requiredEth.toString());
    console.log("ETH sent >= Required:", ethToSend >= requiredEth);

    try {
      await campusPayToken.connect(student).buyTokens(tokensToGet, {
        value: ethToSend
      });
      
      const balance = await campusPayToken.balanceOf(student.address);
      console.log("Student balance:", balance.toString());
      
      expect(balance).to.equal(tokensToGet);
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  });
});
