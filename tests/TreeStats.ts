import {Contract, ContractFactory} from "@ethersproject/contracts";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {expect} from "chai";

describe('TreeStats contract', () => {

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

    describe('Upgrade', () => {
        it('Should upgrade the trunk when max not reached', async () => {
            const {contract, owner} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});
            await contract.connect(owner).addTokens(200);

            await contract.connect(owner).upgradeTreeTrunk(1);

            expect(await contract.getTreeStats(1).trunkUpgrade)
                .to.emit(contract, 'TreeUpgraded');
        });
        it('Should upgrade the leaves when max not reached', async () => {
            const {contract, owner} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});
            await contract.connect(owner).addTokens(200);

            await contract.connect(owner).upgradeTreeLeaves(1);

            expect(await contract.getTreeStats(1).leavesUpgrade)
                .to.emit(contract, 'TreeUpgraded');
        });
        it('Should not upgrade the trunk when max reached', async () => {
            const {contract, owner} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});
            await contract.connect(owner).addTokens(200);

            let maxUpgrades = (await contract.getTreeStats(1)).maxUpgrades.toNumber();
            for(let i = 0; i <= maxUpgrades; i++) {
                await contract.connect(owner).upgradeTreeTrunk(1);
            }

            await expect(contract.connect(owner).upgradeTreeTrunk(1))
                .to.revertedWith('Max trunk level reached for this token');
        });
        it('Should not upgrade the leaves when max reached', async () => {
            const {contract, owner} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});
            await contract.connect(owner).addTokens(200);

            let maxUpgrades = (await contract.getTreeStats(1)).maxUpgrades.toNumber();
            for(let i = 0; i <= maxUpgrades; i++) {
                await contract.connect(owner).upgradeTreeLeaves(1);
            }

            await expect(contract.connect(owner).upgradeTreeLeaves(1))
                .to.revertedWith('Max leaves level reached for this token');
        });
        it('Should not upgrade the trunk when not enough tokens', async () => {
            const {contract, owner} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await expect(contract.connect(owner).upgradeTreeTrunk(1))
                .to.revertedWith("Not enough tokens to upgrade");
        });
        it('Should not upgrade the leaves when not enough tokens', async () => {
            const {contract, owner} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await expect(contract.connect(owner).upgradeTreeLeaves(1))
                .to.revertedWith("Not enough tokens to upgrade");
        });
        it('Should not upgrade the trunk when not owner', async () => {
            const {contract, owner, addr1} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await expect(contract.connect(addr1).upgradeTreeTrunk(1))
                .to.revertedWith("Not the owner of the tree");
        });
        it('Should not upgrade the leaves when not owner', async () => {
            const {contract, owner, addr1} = await deployTokenFixture();
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await expect(contract.connect(addr1).upgradeTreeLeaves(1))
                .to.revertedWith("Not the owner of the tree");
        });
    });
});