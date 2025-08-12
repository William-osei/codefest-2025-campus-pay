// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CampusPayToken is ERC20, Ownable {
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
    
    // Students can buy tokens (simplified - in real world would integrate with payment processor)
    function buyTokens(uint256 amount) external payable {
        require(msg.value > 0, "Must send ETH to buy tokens");
        require(amount > 0, "Amount must be greater than 0");
        
        // Simple 1 ETH = 1000 tokens conversion (1 token = 0.001 ETH)
        uint256 requiredEth = (amount * 1 ether) / 1000;
        require(msg.value >= requiredEth, "Insufficient ETH sent");
        
        _transfer(owner(), msg.sender, amount);
        emit TokensPurchased(msg.sender, amount, block.timestamp);
    }
    
    // Pay for campus services
    function payForService(string memory serviceName, uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient token balance");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens back to campus (owner)
        _transfer(msg.sender, owner(), amount);
        
        // Track payment
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
    
    // Campus admin can distribute tokens (for rewards, etc.)
    function distributeTokens(address to, uint256 amount) external onlyOwner {
        _transfer(owner(), to, amount);
    }
    
    // Allow contract owner to withdraw ETH
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
