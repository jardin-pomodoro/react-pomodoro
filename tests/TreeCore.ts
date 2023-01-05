import {Contract, ContractFactory} from "@ethersproject/contracts";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";


describe('TreeCore contract', () => {
    const TREE_TOKEN_ID = 0;

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
});