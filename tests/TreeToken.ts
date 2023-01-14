import {ethers} from 'hardhat';
import {Contract, ContractFactory} from '@ethersproject/contracts';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {loadFixture, setBalance} from '@nomicfoundation/hardhat-network-helpers';
import {expect} from 'chai';
import {BigNumber} from "ethers";

describe('TreeCore contract', () => {
  async function deployTokenFixture(): Promise<{
    contractFactory: ContractFactory;
    contract: Contract;
    owner: SignerWithAddress;
    addr1: SignerWithAddress;
    addr2: SignerWithAddress;
  }> {
    const contractFactory = await ethers.getContractFactory('TreeCoreTest');
    const [owner, addr1, addr2] = await ethers.getSigners();

    const contract = await contractFactory.deploy();
    await contract.deployed();
    return {contractFactory, contract, owner, addr1, addr2};
  }

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
            .to.revertedWith('You must add a value of at least 0.1 ether');

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
      it('Should revert when tokenCount is greater than 10000', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);
        await contract.setTokenId(10001);

        await expect(contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.1")}))
            .to.revertedWith("Max available mints reached");
      });
    });
  });

  describe('Owner actions', () => {
    it('Should set the baseURI when owner called', async () => {
      const {contract, owner} = await loadFixture(deployTokenFixture);

      await contract.connect(owner).setURI("https://tree.com/");

      expect(await contract.baseTokenURI()).to.equal("https://tree.com/");
    });
    it('Should not set the baseURI when non owner called', async () => {
      const {contract, addr1} = await loadFixture(deployTokenFixture);

      await expect(contract.connect(addr1).setURI("https://tree.com/"))
          .to.revertedWith("Ownable: caller is not the owner");
    });
    it('Should withdraw funds when owner called', async () => {
      const {contract, owner} = await loadFixture(deployTokenFixture);
      await setBalance(contract.address, ethers.utils.parseEther("1"));

      await expect(
          await contract.connect(owner).withdraw()
      ).to.changeEtherBalances([contract, owner], [ethers.utils.parseEther("-1"), ethers.utils.parseEther("1")]);
    });
    it('Should not withdraw funds when non owner called', async () => {
      const {contract, addr1} = await loadFixture(deployTokenFixture);
      await setBalance(contract.address, ethers.utils.parseEther("1"));

      await expect(contract.connect(addr1).withdraw())
          .to.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe('Token actions', () => {
    it('Should return the correct tokenURI', async () => {
      const {contract, owner} = await loadFixture(deployTokenFixture);
      await contract.connect(owner).setURI("https://tree.com/");

      expect(await contract.uri(1)).to.equal("https://tree.com/1");
    });
    it('Should return the seed of newly minted tree when tokenId is greater or equal to 1', async () => {
      const {contract, owner} = await loadFixture(deployTokenFixture);
      await contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.1")});

      expect(await contract.getSeed(1)).to.match(/^[0-9]{1,6}$/);
    });
    it('Should revert when tokenId is lower than 1', async () => {
      const {contract} = await loadFixture(deployTokenFixture);

      await expect(contract.getSeed(0)).to.revertedWith("Token ID invalid");
    });
  });
});
