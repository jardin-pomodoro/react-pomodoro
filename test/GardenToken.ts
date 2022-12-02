import { ethers } from 'hardhat';
import { Contract, ContractFactory } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';

describe('GardenToken contract', function () {
  async function deployTokenFixture(): Promise<{
    contractFactory: ContractFactory;
    contract: Contract;
    owner: SignerWithAddress;
    addr1: SignerWithAddress;
    addr2: SignerWithAddress;
  }> {
    const contractFactory = await ethers.getContractFactory('GardenToken');
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

    it('Should assign the total supply of tokens to the owner', async function () {
      const { contract, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await contract.balanceOf(owner.address);
      expect(await contract.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe('Transactions', function () {
    it('Should transfer tokens between accounts', async function () {
      const { contract, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture,
      );

      // Transfer 50 tokens from owner to addr1
      await expect(contract.transfer(addr1.address, 50)).to.changeTokenBalances(
        contract,
        [owner, addr1],
        [-50, 50],
      );

      // Transfer 50 tokens from addr1 to addr2
      await expect(
        contract.connect(addr1).transfer(addr2.address, 50),
      ).to.changeTokenBalances(contract, [addr1, addr2], [-50, 50]);
    });

    it('Should emit Transfer events', async function () {
      const { contract, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture,
      );

      // Transfer 50 tokens from owner to addr1
      await expect(contract.transfer(addr1.address, 50))
        .to.emit(contract, 'Transfer')
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(contract.connect(addr1).transfer(addr2.address, 50))
        .to.emit(contract, 'Transfer')
        .withArgs(addr1.address, addr2.address, 50);
    });

    it('Should fail if sender doesn’t have enough tokens', async function () {
      const { contract, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture,
      );
      const initialOwnerBalance = await contract.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to addr2
      await expect(
        contract.connect(addr1).transfer(addr2.address, 1),
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance');

      // Owner balance shouldn't change
      expect(await contract.balanceOf(owner.address)).to.equal(
        initialOwnerBalance,
      );
    });
  });

  describe('Accounts', function () {
    it('Should contains only owner address after deployment', async function () {
      const { contract, owner } = await loadFixture(deployTokenFixture);
      const accounts = await contract.accounts();
      expect(accounts).to.have.lengthOf(1);
      expect(accounts).to.contains(owner.address);
    });

    it('Should add addr1 in account list when transfer token to it', async function () {
      const { contract, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      await contract.connect(owner).transfer(addr1.address, 50);

      const accounts = await contract.accounts();
      expect(accounts).to.have.lengthOf(2);
      expect(accounts).to.contains(addr1.address);
      expect(accounts).to.contains(owner.address);

      // Second transfer should not add addr1 again
      await contract.connect(owner).transfer(addr1.address, 50);
      const accounts2 = await contract.accounts();
      expect(accounts2).to.have.lengthOf(2);
      expect(accounts2).to.contains(addr1.address);
      expect(accounts2).to.contains(owner.address);
    });
  });

});
