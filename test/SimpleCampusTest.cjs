const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleCampusPayToken", function () {
  let campusPayToken;
  let owner;
  let student;

  beforeEach(async function () {
    [owner, student] = await ethers.getSigners();

    const SimpleCampusPayToken = await ethers.getContractFactory("SimpleCampusPayToken");
    campusPayToken = await SimpleCampusPayToken.deploy();
    await campusPayToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await campusPayToken.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await campusPayToken.name()).to.equal("Campus Pay Token");
      expect(await campusPayToken.symbol()).to.equal("CPT");
    });
  });

  describe("Token Operations", function () {
    it("Should allow students to buy tokens with simple amounts", async function () {
      const simpleAmount = 100; // 100 tokens
      const weiToSend = 100; // 100 wei for 100 tokens

      await campusPayToken.connect(student).buyTokens(simpleAmount, {
        value: weiToSend
      });

      // Check simple balance
      const simpleBalance = await campusPayToken.getSimpleBalance(student.address);
      expect(simpleBalance).to.equal(simpleAmount);
    });

    it("Should allow payment for services", async function () {
      // First buy tokens
      await campusPayToken.connect(student).buyTokens(100, { value: 100 });
      
      // Pay for laundry (10 tokens)
      await campusPayToken.connect(student).payForService("Laundry", 10);

      // Check balance decreased
      const balance = await campusPayToken.getSimpleBalance(student.address);
      expect(balance).to.equal(90);

      // Check payment tracking
      expect(await campusPayToken.totalSpent(student.address)).to.equal(10);
      expect(await campusPayToken.getPaymentCount(student.address)).to.equal(1);
      expect(await campusPayToken.getPaymentHistory(student.address, 0)).to.equal("Laundry");
    });

    it("Should track multiple service payments", async function () {
      // Buy tokens
      await campusPayToken.connect(student).buyTokens(100, { value: 100 });
      
      // Make multiple payments
      await campusPayToken.connect(student).payForService("Laundry", 10);
      await campusPayToken.connect(student).payForService("Printing", 5);
      await campusPayToken.connect(student).payForService("Food Court", 25);

      // Check final balance
      const balance = await campusPayToken.getSimpleBalance(student.address);
      expect(balance).to.equal(60); // 100 - 10 - 5 - 25

      // Check total spent
      expect(await campusPayToken.totalSpent(student.address)).to.equal(40);

      // Check payment count
      expect(await campusPayToken.getPaymentCount(student.address)).to.equal(3);

      // Check payment history
      expect(await campusPayToken.getPaymentHistory(student.address, 0)).to.equal("Laundry");
      expect(await campusPayToken.getPaymentHistory(student.address, 1)).to.equal("Printing");
      expect(await campusPayToken.getPaymentHistory(student.address, 2)).to.equal("Food Court");
    });

    it("Should fail payment with insufficient balance", async function () {
      // Buy only 20 tokens
      await campusPayToken.connect(student).buyTokens(20, { value: 20 });
      
      // Try to spend 25 tokens
      await expect(
        campusPayToken.connect(student).payForService("Food Court", 25)
      ).to.be.revertedWith("Insufficient token balance");
    });

    it("Should allow owner to distribute tokens", async function () {
      await campusPayToken.connect(owner).distributeTokens(student.address, 50);
      
      const balance = await campusPayToken.getSimpleBalance(student.address);
      expect(balance).to.equal(50);
    });

    it("Should allow owner to withdraw ETH", async function () {
      // Student buys tokens
      await campusPayToken.connect(student).buyTokens(100, { value: 100 });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      // Owner withdraws
      const tx = await campusPayToken.connect(owner).withdrawETH();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalBalance = await ethers.provider.getBalance(owner.address);
      
      // Owner should have received ETH minus gas
      expect(finalBalance).to.be.closeTo(
        initialBalance + 100n - gasUsed,
        ethers.parseUnits("1", "gwei") // Small tolerance for gas
      );
    });
  });
});
