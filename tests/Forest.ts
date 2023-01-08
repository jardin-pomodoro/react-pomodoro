import {Contract, ContractFactory} from "@ethersproject/contracts";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {expect} from "chai";
import {time} from "@nomicfoundation/hardhat-network-helpers";

describe('Forest contract', () => {
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


    describe('Plant Tree', () => {
        it('Should revert when is not owner of the tree', async () => {
            const {contract, owner, addr1} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await expect(contract.connect(addr1).plantTree(1))
                .to.revertedWith('Not the owner of the tree');
        });
        it('Should revert when no seeds left', async () => {
            const {contract, owner} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            for (let i = 0; i < 4; i++) {
                await contract.connect(owner).consumeSeeds(1);
            }

            await expect(contract.connect(owner).plantTree(1))
                .to.revertedWith('No seeds left');
        });
        it('Should emit an event when tree planted', async () => {
            const {contract, owner} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await expect(contract.connect(owner).plantTree(1))
                .to.emit(contract, 'TreePlanted');
        });
        it('Should remove one seed when tree planted', async () => {
            const {contract, owner} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await contract.connect(owner).plantTree(1);

            expect(await contract.getSeeds(1)).to.equal(3);
        });
    });
    describe('Collect Tree', () => {
        it('Should revert when time is not passed', async () => {
            const {contract, owner} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await contract.connect(owner).plantTree(1);

            await expect(contract.connect(owner).collectTree())
                .to.revertedWith('Tree is not ready to be harvested');
        });
        it('Should emit collect tree when time is passed', async () => {
            const {contract, owner} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await contract.connect(owner).plantTree(1);
            const growingTree = await contract.connect(owner).getGrowingTree();

            await time.increase(time.duration.hours(growingTree.growingTime.toNumber()));

            await expect(contract.connect(owner).collectTree())
                .to.emit(contract, 'TreeCollected');
            expect(await contract.balanceOf(owner.address, TREE_TOKEN_ID))
                .to.greaterThan(0);
        });
    });
});
