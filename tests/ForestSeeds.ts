import {Contract, ContractFactory} from "@ethersproject/contracts";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";

describe('ForestSeeds contract', () => {
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

    it('Should have 4 seeds by default', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);
        await contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.1")});

        expect(await contract.connect(owner).getSeeds(1)).to.equal(4);
    });
});