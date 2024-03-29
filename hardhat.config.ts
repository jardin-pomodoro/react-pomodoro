import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import assert from "assert";
import { config as dotenvConfig } from "dotenv";
import "solidity-coverage";

dotenvConfig();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;

assert(ALCHEMY_API_KEY, "Please set your ALCHEMY_API_KEY in a .env file");
assert(OWNER_PRIVATE_KEY, "Please set your OWNER_PRIVATE_KEY in a .env file");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [OWNER_PRIVATE_KEY],
      chainId: 80001, // This is the chainId of the Mumbai test network
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [OWNER_PRIVATE_KEY],
      chainId: 137,
    },
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
  },
  paths: {
    tests: "./tests",
  },
};

export default config;
