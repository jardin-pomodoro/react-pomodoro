import {artifacts, ethers} from 'hardhat';
import {Contract} from '@ethersproject/contracts';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);
    console.log('Account balance:', (await deployer.getBalance()).toString());

  const contractFactory = await ethers.getContractFactory('TreeCore');
  const treeCoreContract = await contractFactory.deploy();

  console.log('Tree Core address:', treeCoreContract.address);

  saveFrontendDeploymentInfo(treeCoreContract);
}

function saveFrontendDeploymentInfo(contract: Contract) {
  const frontendDir = path.normalize(__dirname + '/../frontend/src/utils');

    if (!fs.existsSync(frontendDir)) {
        fs.mkdirSync(frontendDir);
    }

    fs.writeFileSync(
        path.join(frontendDir, 'tree-token.json'),
        JSON.stringify({Token: contract.address}, undefined, 2),
    );

  const contractArtifact = artifacts.readArtifactSync('TreeCore');
  fs.writeFileSync(
    path.join(frontendDir, 'greeter.json'),
    JSON.stringify(contractArtifact.abi, null, 2),
  );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
