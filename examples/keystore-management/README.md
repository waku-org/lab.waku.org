# Waku Keystore Management

A simple Next.js application to manage Waku RLN keystores.

## Overview

This application provides an interface for managing keystores for Waku's rate-limiting nullifier (RLN) functionality. It integrates with MetaMask for wallet connectivity.

## Features

- Connect to MetaMask wallet
- View wallet information including address, network, and balance
- Support for Linea Sepolia testnet only
- Keystore management functionality
- Token approval for RLN membership registration

## Getting Started

1. First, install the dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

4. Connect your MetaMask wallet (Linea Sepolia testnet is required).

## Linea Sepolia Network

This application is configured to use ONLY the Linea Sepolia testnet. If you don't have Linea Sepolia configured in your MetaMask, the application will help you add it with the following details:

- **Network Name**: Linea Sepolia Testnet
- **RPC URL**: https://rpc.sepolia.linea.build
- **Chain ID**: 59141
- **Currency Symbol**: ETH
- **Block Explorer URL**: https://sepolia.lineascan.build

You can get Linea Sepolia testnet ETH from the [Linea Faucet](https://faucet.goerli.linea.build/).

## RLN Membership Registration

When registering for RLN membership, you'll need to complete two transactions:

1. **Token Approval**: First, you'll need to approve the RLN contract to spend tokens on your behalf. This is a one-time approval.
2. **Membership Registration**: After approval, the actual membership registration transaction will be submitted.

If you encounter an "ERC20: insufficient allowance" error, it means the token approval transaction was not completed successfully. Please try again and make sure to approve the token spending in your wallet.

