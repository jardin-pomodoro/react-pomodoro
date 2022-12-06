import { artifacts, ethers } from 'hardhat';
import { Contract } from '@ethersproject/contracts';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  const contractFactory = await ethers.getContractFactory('GardenToken');
  const gardenTokenContract = await contractFactory.deploy();

  console.log('Garden Token address:', gardenTokenContract.address);

  saveFrontendDeploymentInfo(gardenTokenContract);
}

function saveFrontendDeploymentInfo(contract: Contract) {
  const frontendDir = __dirname + '../frontend/src/contracts';

  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir);
  }

  fs.writeFileSync(
    path.join(frontendDir, 'contract-address.json'),
    JSON.stringify({ Token: contract.address }, undefined, 2),
  );

  const contractArtifact = artifacts.readArtifactSync('GardenToken');
  fs.writeFileSync(
    path.join(frontendDir, 'GardenToken.json'),
    JSON.stringify(contractArtifact, null, 2),
  );
}
