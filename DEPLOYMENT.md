# 🚀 Campus Pay Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:
- Node.js v18+ installed
- MetaMask extension in your browser
- Some ETH for gas fees (testnet is fine)
- Git installed

## 🌐 Frontend Deployment Options

### Option 1: Vercel (Recommended)
1. Push your code to GitHub (see GitHub setup below)
2. Visit [vercel.com](https://vercel.com)
3. Connect your GitHub account
4. Import your repository
5. Deploy with default settings

### Option 2: Netlify
1. Visit [netlify.com](https://netlify.com)
2. Drag and drop your `dist` folder after running `npm run build`
3. Or connect your GitHub repository

### Option 3: GitHub Pages
1. Run `npm run build`
2. Push the `dist` folder to a `gh-pages` branch
3. Enable GitHub Pages in repository settings

## 🔗 Smart Contract Deployment

### Testnet Deployment (Sepolia)
```bash
# Set up environment variables
echo "PRIVATE_KEY=your_private_key_here" > .env
echo "SEPOLIA_URL=your_infura_or_alchemy_url_here" >> .env

# Deploy to Sepolia testnet
npx hardhat ignition deploy ./ignition/modules/CampusPayToken.js --network sepolia

# Update contract address in App.jsx
```

### Local Testing
```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat ignition deploy ./ignition/modules/CampusPayToken.js --network localhost

# Terminal 3: Start frontend
npm run dev
```

## 📱 Demo Setup Checklist

Before recording your demo:
- [ ] Contract deployed and working
- [ ] Frontend deployed to public URL
- [ ] MetaMask set up with testnet funds
- [ ] All features tested and working
- [ ] Logo displays correctly
- [ ] Responsive design works on mobile

## 🔧 Configuration Files

### .env Template
```
PRIVATE_KEY=your_wallet_private_key_here
SEPOLIA_URL=https://sepolia.infura.io/v3/your_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Vercel Configuration
Create `vercel.json`:
```json
{
  "build": {
    "env": {
      "NODE_VERSION": "18.x"
    }
  },
  "functions": {
    "app/**/*.js": {
      "memory": 1024
    }
  }
}
```

## 🎥 Demo Recording Tips

1. **Preparation**: Test everything multiple times
2. **Script**: Write out what you'll demo step by step
3. **Quality**: Use 1080p recording, clear audio
4. **Duration**: Keep it 3-5 minutes max
5. **Flow**: Login → Connect Wallet → Buy Tokens → Make Payment → Show History

## 🔗 Links to Update

After deployment, update these in your README:
- Live demo URL
- YouTube demo video link
- Deployed contract address
- Any additional documentation

## ⚠️ Security Notes

- Never commit private keys to GitHub
- Use testnet for demos unless deploying to mainnet
- Test all transactions before recording
- Keep your seed phrases secure

## 🆘 Troubleshooting

### Common Issues:
1. **MetaMask not connecting**: Check network settings
2. **Contract not found**: Verify contract address
3. **Transaction failing**: Check gas settings and balance
4. **Build failing**: Check Node.js version and dependencies

### Getting Help:
- Check Hardhat documentation
- MetaMask support
- React/Vite documentation
- Ethers.js guides
