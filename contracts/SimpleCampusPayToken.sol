// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleCampusPayToken is ERC20, Ownable {
    // Mapping to track service payments
    mapping(address => uint256) public totalSpent;
    mapping(address => string[]) public paymentHistory;
    
    // Events for tracking payments
    event PaymentMade(address indexed user, string service, uint256 amount, uint256 timestamp);
    event TokensPurchased(address indexed user, uint256 amount, uint256 timestamp);
    
    constructor() ERC20("Campus Pay Token", "CPT") Ownable(msg.sender) {
        // Mint initial supply to contract owner (campus administration)
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    // Students can buy tokens - simple version for demo
    function buyTokens(uint256 amount) external payable {
        require(msg.value > 0, "Must send ETH to buy tokens");
        require(amount > 0, "Amount must be greater than 0");
        
        // Very simple conversion: 1 wei = 1 token (for demo purposes)
        // In production, you'd want proper pricing
        require(msg.value >= amount, "Insufficient ETH sent");
        
        // Convert simple amount to token with decimals
        uint256 tokenAmount = amount * 10**decimals();
        _transfer(owner(), msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, amount, block.timestamp);
    }
    
    // Pay for campus services - expects simple amounts
    function payForService(string memory serviceName, uint256 amount) external {
        uint256 tokenAmount = amount * 10**decimals();
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens back to campus (owner)
        _transfer(msg.sender, owner(), tokenAmount);
        
        // Track payment with simple amount
        totalSpent[msg.sender] += amount;
        paymentHistory[msg.sender].push(serviceName);
        
        emit PaymentMade(msg.sender, serviceName, amount, block.timestamp);
    }
    
    // Get user's payment history count
    function getPaymentCount(address user) external view returns (uint256) {
        return paymentHistory[user].length;
    }
    
    // Get specific payment from history
    function getPaymentHistory(address user, uint256 index) external view returns (string memory) {
        require(index < paymentHistory[user].length, "Index out of bounds");
        return paymentHistory[user][index];
    }
    
    // Get simple token balance (without decimals for frontend)
    function getSimpleBalance(address user) external view returns (uint256) {
        return balanceOf(user) / 10**decimals();
    }
    
    // Campus admin can distribute tokens (simple amount)
    function distributeTokens(address to, uint256 amount) external onlyOwner {
        uint256 tokenAmount = amount * 10**decimals();
        _transfer(owner(), to, tokenAmount);
    }
    
    // Allow contract owner to withdraw ETH
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
