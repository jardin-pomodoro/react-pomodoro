# Garden Pomodoro

A handy pomodoro app using smart contracts, where you can earn tokens to evolve your garden's NFT.

## Features

- [x] Pomodoro timer
- [x] Earn tokens
- [x] Evolve your garden
- [x] Marketplace
- [x] Mint your own seed
- [x] Breed your seeds to create new ones

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.0.0 or later)
- [Pnpm](https://pnpm.io/) (v7.18.0 or later)
- [Docker](https://www.docker.com/) (v20.10.8 or later) if you plan to build the frontend image
- [Metamask](https://metamask.io/) account (Mumbai testnet)
- [Alchemy](https://www.alchemy.com/) API key (Mumbai testnet)

## Installation

### Contract

To compile the contract, run :

```bash
pnpm install
pnpm run compile

```

### Frontend

To build the frontend, run :

```bash
cd frontend
pnpm install
pnpm run build
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/jardin-pomodoro/react-pomodoro.git
```

Go to the project directory

```bash
  cd react-pomodoro
```

Copy the `.env.example` file to `.env` and fill it with your Alchemy API key and
your [Metamask owner private key](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key) (
it will not be used for local deployment but deploy script require it anyway).

```bash
  cp .env.example .env
```

### Contract

Install dependencies and compile the contract

```bash
  pnpm install
  pnpm run compile
```

Start a hardhat node

```bash
  pnpm run local-node
```

Deploy the contract in another terminal

```bash
  pnpm run deploy:local
```

### Frontend

Install dependencies

```bash
cd frontend
pnpm install

```

Start the frontend

```bash
pnpm run dev

```

You can access the frontend at http://localhost:5173/

## Deployment on Mumbai testnet

Follow the same instructions as for local deployment but replace `local` by `mumbai` in the commands.

```bash
git clone https://github.com/jardin-pomodoro/react-pomodoro.git
cd react-pomodoro
cp .env.example .env

```

Fill it with your Alchemy API key and
your [Metamask owner private key](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key)

```bash 
pnpm install
pnpm run compile
pnpm run deploy:mumbai

```

You can run the frontend the same way as for local deployment.

```bash
cd frontend
pnpm install
pnpm run dev

```

## Running Tests

### Contract

To run tests

```bash
pnpm run test

```

You can access the frontend at http://localhost:5173/

## Documentation

[Documentation](https://linktodocumentation)


