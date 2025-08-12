const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CampusPayToken", function () {
  let campusPayToken;
  let owner;
  let student;
  let otherAccount;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    [owner, student, otherAccount] = await ethers.getSigners();

    // Deploy the contract
    const CampusPayToken = await ethers.getContractFactory("CampusPayToken");
    campusPayToken = await CampusPayToken.deploy();
    await campusPayToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await campusPayToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await campusPayToken.balanceOf(owner.address);
      expect(await campusPayToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct name and symbol", async function () {
      expect(await campusPayToken.name()).to.equal("Campus Pay Token");
      expect(await campusPayToken.symbol()).to.equal("CPT");
    });
  });

  describe("Token Purchase", function () {
    it("Should allow students to buy tokens", async function () {
      const tokensToGet = ethers.parseUnits("100", 18); // 100 tokens with 18 decimals
      const ethToSend = ethers.parseEther("100"); // 100 ETH for 100*10^18 tokens (rate: 1000 tokens per ETH)

      // Student buys tokens
      await campusPayToken.connect(student).buyTokens(tokensToGet, {
        value: ethToSend
      });

      expect(await campusPayToken.balanceOf(student.address)).to.equal(tokensToGet);
    });

    it("Should fail if not enough ETH is sent", async function () {
      const tokensToGet = ethers.parseUnits("100", 18);
      const ethToSend = ethers.parseEther("10"); // Not enough ETH

      await expect(
        campusPayToken.connect(student).buyTokens(tokensToGet, {
          value: ethToSend
        })
      ).to.be.revertedWith("Insufficient ETH sent");
    });
  });

  describe("Service Payments", function () {
    beforeEach(async function () {
      // Give student some tokens first
      const tokensToGet = ethers.parseUnits("100", 18);
      const ethToSend = ethers.parseEther("100"); // Enough ETH for 100 tokens with decimals
      
      await campusPayToken.connect(student).buyTokens(tokensToGet, {
        value: ethToSend
      });
    });

    it("Should allow students to pay for services", async function () {
      const paymentAmount = ethers.parseUnits("10", 18); // 10 tokens for laundry
      const serviceName = "Laundry";

      const initialBalance = await campusPayToken.balanceOf(student.address);
      
      await campusPayToken.connect(student).payForService(serviceName, paymentAmount);

      // Check balance decreased
      const finalBalance = await campusPayToken.balanceOf(student.address);
      expect(finalBalance).to.equal(initialBalance - paymentAmount);

      // Check total spent increased
      expect(await campusPayToken.totalSpent(student.address)).to.equal(paymentAmount);

      // Check payment count increased
      expect(await campusPayToken.getPaymentCount(student.address)).to.equal(1);
    });

    it("Should fail if insufficient balance", async function () {
      const paymentAmount = ethers.parseUnits("200", 18); // More than student has
      const serviceName = "Food Court";

      await expect(
        campusPayToken.connect(student).payForService(serviceName, paymentAmount)
      ).to.be.revertedWith("Insufficient token balance");
    });

    it("Should track multiple payments", async function () {
      const payment1 = ethers.parseUnits("10", 18); // Laundry
      const payment2 = ethers.parseUnits("5", 18);  // Printing

      await campusPayToken.connect(student).payForService("Laundry", payment1);
      await campusPayToken.connect(student).payForService("Printing", payment2);

      expect(await campusPayToken.getPaymentCount(student.address)).to.equal(2);
      expect(await campusPayToken.totalSpent(student.address)).to.equal(payment1 + payment2);
      
      // Check payment history
      expect(await campusPayToken.getPaymentHistory(student.address, 0)).to.equal("Laundry");
      expect(await campusPayToken.getPaymentHistory(student.address, 1)).to.equal("Printing");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to distribute tokens", async function () {
      const distributeAmount = ethers.parseUnits("50", 18);

      await campusPayToken.connect(owner).distributeTokens(student.address, distributeAmount);

      expect(await campusPayToken.balanceOf(student.address)).to.equal(distributeAmount);
    });

    it("Should not allow non-owners to distribute tokens", async function () {
      const distributeAmount = ethers.parseUnits("50", 18);

      await expect(
        campusPayToken.connect(student).distributeTokens(otherAccount.address, distributeAmount)
      ).to.be.revertedWithCustomError(campusPayToken, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to withdraw ETH", async function () {
      // First, student buys tokens to add ETH to contract
      const tokensToGet = ethers.parseUnits("100", 18);
      const ethToSend = ethers.parseEther("100"); // Enough ETH for the tokens
      
      await campusPayToken.connect(student).buyTokens(tokensToGet, {
        value: ethToSend
      });

      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      // Owner withdraws ETH
      const tx = await campusPayToken.connect(owner).withdrawETH();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      // Owner should receive ETH minus gas costs
      expect(finalOwnerBalance).to.be.closeTo(
        initialOwnerBalance + ethToSend - gasUsed,
        ethers.parseEther("0.1") // Allow for gas estimation errors
      );
    });
  });
});
