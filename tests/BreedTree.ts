import {Contract, ContractFactory} from "@ethersproject/contracts";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {expect} from "chai";

describe('BreedTree contract', () => {

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

    it('Should not breed two trees if not enough tokens', async () => {
        const {contract, owner} = await deployTokenFixture();
        await contract.connect(owner)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});
        await contract.connect(owner)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});

        await expect(contract.connect(owner).breedTree(1, 2))
            .to.reverted;
    });
    it('Should not breed a tree with itself', async () => {
        const {contract, owner} = await deployTokenFixture();
        await contract.connect(owner)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});

        await expect(contract.connect(owner).breedTree(1, 1))
            .to.revertedWith("Can't breed tree with itself");
    });
    it('Should not breed a tree with a non existing tree', async () => {
        const {contract, owner} = await deployTokenFixture();
        await contract.connect(owner)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});

        await expect(contract.connect(owner).breedTree(1, 2))
            .to.revertedWith("Not the owner of the tree");
    });
    it('Should not breed a tree with a tree not owned', async () => {
        const {contract, owner, addr1} = await deployTokenFixture();
        await contract.connect(owner)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});
        await contract.connect(addr1)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});

        await expect(contract.connect(owner).breedTree(1, 2))
            .to.revertedWith("Not the owner of the tree");
    });
    it('Should not breed a tree with a tree not owned', async () => {
        const {contract, owner, addr1} = await deployTokenFixture();
        await contract.connect(owner)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});
        await contract.connect(addr1)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});

        await expect(contract.connect(owner).breedTree(2, 1))
            .to.revertedWith("Not the owner of the tree");
    });
    it('Should emit event when breeding', async () => {
        const {contract, owner} = await deployTokenFixture();
        await contract.connect(owner)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});
        await contract.connect(owner)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});
        await contract.connect(owner).addTokens(400);

        await expect(contract.connect(owner).breedTree(1, 2))
            .to.emit(contract, 'TreeMinted')
            .withArgs(owner.address, 3);
    });
    it('Should revert if breeding limit reached', async () => {
        const {contract, owner} = await deployTokenFixture();
        await contract.connect(owner)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});
        await contract.connect(owner)
            .mintRandomTree({value: ethers.utils.parseEther("0.1")});
        await contract.connect(owner).addTokens(400);

        contract.connect(owner).breedTree(1, 2);
        contract.connect(owner).breedTree(1, 2);
        await expect(contract.connect(owner).breedTree(1, 2))
            .to.revertedWith("Breeding limit reached");
    });
});