# Campus Pay

A Web3 payment system for campus services. Built for Codefest 2025.

## Demo

**Video:** [Watch on YouTube](https://youtu.be/gxLZ-3PqvUk)

The demo shows the complete workflow - connecting MetaMask, buying CPT tokens, and paying for campus services like laundry and printing.

## Overview

Campus payment systems are fragmented - students need multiple cards for different services. Campus Pay solves this with a single token (CPT) that works for all campus services like laundry, printing, and food.

## Features

- MetaMask wallet integration
- Buy CPT tokens with ETH (1000 CPT = 1 ETH)
- Pay for campus services
- Transaction history on blockchain
- Welcome bonus of 50 CPT for new users

## Tech Stack

- React 19 + Vite
- Solidity smart contracts
- Hardhat development environment
- Ethers.js for blockchain interaction

## Setup

```bash
git clone https://github.com/William-osei/codefest-2025-campus-pay.git
cd codefest-2025-campus-pay
npm install
npx hardhat compile
npm run dev
```

## Campus Services

| Service | Price (CPT) |
|---------|-------------|
| Laundry | 10 CPT |
| Printing | 5 CPT |
| Food Court | 25 CPT |
| Library Access | 15 CPT |
| Gym Day Pass | 20 CPT |

## Smart Contract

The `CampusPayToken.sol` contract implements an ERC20 token with functions for:
- `buyTokens()` - Purchase tokens with ETH
- `payForService()` - Pay for campus services
- `getPaymentHistory()` - View payment history

## License

MIT
