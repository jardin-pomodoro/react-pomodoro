import {Contract, ContractFactory} from "@ethersproject/contracts";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {loadFixture, time} from "@nomicfoundation/hardhat-network-helpers";
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
    it('Should charge the correct price', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);
        await contract.connect(owner)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});

        expect(await contract.connect(owner).getSeedCost(1)).to.equal(2);
    });
    it('Should update the amount of seeds when day changed', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);
        await contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.1")});
        await contract.connect(owner).consumeSeeds(1);
        await time.increase(time.duration.days(1));

        expect(await contract.connect(owner).updateSeeds(1))
            .to.emit(contract, "SeedRefreshed").withArgs(owner.address, 1, 4);
        expect(await contract.connect(owner).getSeeds(1)).to.equal(4);
    });
    it('Should not update the amount of seeds when same day', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);
        await contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.1")});
        await contract.connect(owner).consumeSeeds(1);


        expect(await contract.connect(owner).updateSeeds(1))
            .not.to.emit(contract, "SeedRefreshed");
        expect(await contract.connect(owner).getSeeds(1)).to.equal(3);
    });
    it('Should consume boughtSeeds when no basic seeds left', async () => {
        const {contract, owner} = await loadFixture(deployTokenFixture);
        await contract.connect(owner).mintRandomTree({value: ethers.utils.parseEther("0.1")});
        await contract.connect(owner).addTokens(200);

        for (let i = 0; i < 4; i++) {
            await contract.connect(owner).consumeSeeds(1);
        }
        await contract.connect(owner).buySeeds(1, 1);
        await contract.connect(owner).consumeSeeds(1);
        expect(await contract.connect(owner).getSeeds(1)).to.equal(0);
    });
    describe('Bought seeds', () => {
        it('Should revert when trying to buy a seed with not enough funds', async () => {
            const {contract, owner} = await loadFixture(deployTokenFixture);
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await expect(contract.connect(owner).buySeeds(1, 1))
                .to.revertedWith("Not enough funds");
        });
        it('Should revert when trying to buy seeds for a tree not owned', async () => {
            const {contract, owner, addr1} = await loadFixture(deployTokenFixture);
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await expect(contract.connect(addr1).buySeeds(1, 1))
                .to.revertedWith("Not the owner of the tree");
        });
        it('Should revert when trying to buy invalid amount of seeds', async () => {
            const {contract, owner, addr1} = await loadFixture(deployTokenFixture);
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await expect(contract.connect(addr1).buySeeds(1, 0))
                .to.revertedWith("Amount must be greater than 0");
        });
        it('Should revert when trying to buy invalid tokenId', async () => {
            const {contract, owner, addr1} = await loadFixture(deployTokenFixture);
            await contract.connect(owner)
                .mintRandomTree({value: ethers.utils.parseEther("0.1")});

            await expect(contract.connect(addr1).buySeeds(0, 1))
                .to.revertedWith("Token ID must be greater than 0");
        });
    });
});