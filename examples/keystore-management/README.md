# Waku Keystore Management

A simple Next.js application to manage Waku RLN keystores.

## Overview

This application provides an interface for managing keystores for Waku's rate-limiting nullifier (RLN) functionality. It integrates with MetaMask for wallet connectivity and demonstrates how to work with the Waku RLN library.

## Features

- Connect to MetaMask wallet
- View wallet information including address, network, and balance
- Support for Sepolia testnet
- Keystore management functionality

## Getting Started

1. First, install the dependencies:

```bash
npm install
# or
yarn
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

4. Connect your MetaMask wallet (Sepolia testnet is supported).

## Technologies

- Next.js
- React
- TypeScript
- TailwindCSS
- Waku RLN library
- Ethers.js
