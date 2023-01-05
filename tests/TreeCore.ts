import { ethers } from 'hardhat';
import { Contract, ContractFactory } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';

describe('TreeCore contract', function () {
  async function deployTokenFixture(): Promise<{
    contractFactory: ContractFactory;
    contract: Contract;
    owner: SignerWithAddress;
    addr1: SignerWithAddress;
    addr2: SignerWithAddress;
  }> {
    const contractFactory = await ethers.getContractFactory('TreeCore');
    const [owner, addr1, addr2] = await ethers.getSigners();

    const contract = await contractFactory.deploy();
    await contract.deployed();
    return { contractFactory, contract, owner, addr1, addr2 };
  }

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { contract, owner } = await loadFixture(deployTokenFixture);
      expect(await contract.owner()).to.equal(owner.address);
    });

  });
});
