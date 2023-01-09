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

To run tests locally on the contract, run :

```bash
pnpm install
pnpm run test

```

It will run the tests on a hardhat local node.

If you want to see the test coverage, just run this command instead of `test` :

```bash
pnpm run coverage

```

![test coverage](./img/README-1673258786119.png)

### Frontend

To run tests locally on the frontend, run :

```bash
cd frontend
pnpm install
pnpm run test

```

## Documentation

### Contract

#### TreeCore.sol

It is the contract that will be deployed on the blockchain.

This contract is a combination of several contracts that provide functionality for creating and managing virtual trees.

These contracts include:

- `TreeToken`: Provides functionality for creating and managing ERC-1155 tokens
- `BreedTree`: Provides functionality for breeding two trees to create a new tree
- `Forest`: Manages the planting and collection of trees
- `TreeStats`: Provides functionality for upgrading the trunk and leaves of a tree
- `ForestSeeds`: Manages the seeds needed to plant and grow a tree

The `TreeCore` contract includes several events that are triggered at various points in the tree creation and management
process:

- `TreeMinted`: Triggered when a new tree is minted
- `TreePlanted`: Triggered when a tree is planted
- `TreeCollected`: Triggered when a tree is collected

The contract also includes several functions for creating and managing trees:

- `createTree(uint childSeed)`: Creates a new tree with the given seed
- `breedTree(uint256 _tokenId1, uint256 _tokenId2)`: Breeds two trees to create a new tree
- `plantTree(uint256 _tokenId)`: Plants a tree
- `collectTree()`: Collects a tree that is ready to be collected
- `upgradeTreeTrunk(uint256 _tokenId)`: Upgrades the trunk of a tree
- `upgradeTreeLeaves(uint256 _tokenId)`: Upgrades the leaves of a tree

The contract also includes several pure functions for getting information about seeds:

- `getSeedLeavesStats(uint _seed)`: Returns the leaves stats for a seed
- `getSeedTrunkStats(uint _seed)`: Returns the trunk stats for a seed
- `getTreeRarity(uint _seed)`: Returns the rarity of a tree based on its seed

The `TreeCore` contract also includes functions for interacting with the `TreeToken` contract:

- `mintTree(address owner, uint childSeed)`: Mints a new tree for the given owner with the given seed
- `balanceOf(address owner, uint256 _tokenId)`: Returns the balance of trees for the given owner with the given token ID

The `TreeCore` contract also includes functions for interacting with the `BreedTree` contract:

- `canTreeBreed(uint256 _tokenId)`: Verifies that a tree can be bred
- `breedTrees(uint256 _tokenId1, uint256 _tokenId2, uint seed1, uint seed2)`: Breeds two trees to create a new tree

The `TreeCore` contract also includes functions for interacting with the `Forest` contract:

- `updateSeeds(uint256 _tokenId)`: Updates the number of seeds available for a tree
- `consumeSeed(uint256 _tokenId)`: Consumes a seed for a tree
- `plantTree(uint256 _tokenId, uint trunkUpgrade)`: Plants a tree with the given trunk upgrade
- `collectTree(uint leavesUpgrade)`: Collects a tree with the given leaves upgrade

The `TreeCore` contract also includes functions for interacting with the `TreeStats` contract:

- `addTreeStats(uint256 _tokenId, uint rarity)`: Adds tree stats for the given tree with the given rarity
- `getTreeStats(uint256 _tokenId)`: Returns the stats for the given tree
- `canUpgradeTrunk(uint256 _tokenId)`: Verifies that the trunk of a tree can be upgraded
- `upgradeTrunk(uint256 _tokenId)`: Upgrades the trunk of a tree
- `canUpgradeLeaves(uint256 _tokenId)`: Verifies that the leaves of a tree can be upgraded
- `upgradeLeaves(uint256 _tokenId)`: Upgrades the leaves of a tree

The `TreeCore` contract also includes functions for interacting with the `ForestSeeds` contract:

- `getSeed(uint256 _tokenId)`: Returns the seed for the given tree
- `getSeeds(uint256 _tokenId)`: Returns the number of seeds available for the given tree
- `getGrowingTree()`: Returns the tree that is currently growing

Overall, the `TreeCore` contract provides a comprehensive set of functions for creating, breeding, planting, and upgrading
virtual trees. It combines the functionality of several other contracts to provide a complete solution for managing
virtual trees.

#### TreeToken


