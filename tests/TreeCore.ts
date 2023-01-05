import {ethers} from 'hardhat';
import {Contract, ContractFactory} from '@ethersproject/contracts';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {expect} from 'chai';
import {BigNumber} from "ethers";

describe('TreeCore contract', () => {
  const TREE_TOKEN_ID = 0;

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
    return {contractFactory, contract, owner, addr1, addr2};
  }

  describe('Deployment', () => {
    it('Should set the right owner', async () => {
      const {contract, owner} = await loadFixture(deployTokenFixture);

      expect(await contract.owner()).to.equal(owner.address);
    });
    it('Should have 0 tokens as an initial supply', async () => {
      const {contract} = await loadFixture(deployTokenFixture);

      expect(await contract.totalSupply(TREE_TOKEN_ID)).to.equal(0);
    });
  });

  describe('MintTree', () => {
    describe('Payment', () => {
      it('Should transfer value to the contract when equal to 0.1 ether', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);

        await expect(
            contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.1")})
        ).to.changeEtherBalances([owner, contract], [ethers.utils.parseEther("-0.1"), ethers.utils.parseEther("0.1")]);
      });
      it('Should transfer value to the contract when greater than 0.1 ether', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);

        await expect(
            contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.2")})
        ).to.changeEtherBalances([owner, contract], [ethers.utils.parseEther("-0.2"), ethers.utils.parseEther("0.2")]);
      });
      it('Should revert with error when less than 0.1 ether', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);

        await expect(
            contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.05")})
        ).to.revertedWith("You must add a value of at least 0.1 ether");
      });
      it('Should revert with error when less than 0.1 ether', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);

        await expect(
            contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.05")})
        ).to.revertedWith("You must add a value of at least 0.1 ether");
      });
    });

    describe('Minting', () => {
      it('Should mint a token to caller when value is equal to 0.1', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);
        const currentTokenCount: BigNumber = await contract.getTokenCount();

        await contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.1")});

        expect(await contract.balanceOf(owner.address, currentTokenCount))
            .to.equal(1);
        expect(await contract.getTokenCount())
            .to.equal(currentTokenCount.add(1));
      });
      it('Should mint a token to caller when value is less than 0.1', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);
        const currentTokenCount = await contract.getTokenCount();

        await expect(contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.05")}))
            .to.reverted;

        expect(await contract.balanceOf(owner.address, currentTokenCount))
            .to.equal(0);
        expect(await contract.getTokenCount())
            .to.equal(currentTokenCount);
      });
      it('Should emit an event when value is equal to 0.1', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);
        const currentTokenCount: BigNumber = await contract.getTokenCount();

        await expect(contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.1")}))
            .to.emit(contract, 'TreeMinted').withArgs(owner.address, currentTokenCount);
      });
    });
  });
});
