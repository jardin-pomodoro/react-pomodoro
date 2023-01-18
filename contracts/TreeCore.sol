pragma solidity ^0.8.17;

import "./TreeToken.sol";
import "./BreedTree.sol";
import "./Forest.sol";
import "./TreeStats.sol";
import "./ForestSeeds.sol";


contract TreeCore is TreeToken, BreedTree, Forest, TreeStats, ForestSeeds {
    event TreeMinted(address indexed to, uint256 _tokenId);
    event TreePlanted(address indexed to, uint256 _tokenId, uint256 startTime);
    event TreeCollected(address indexed to, uint256 _tokenId, uint256 tokensCollected);

    constructor() {
        uint256 _tokenId1 = mintTree(0x6B1ff62b68c5cF9C216168E39cd5e02e8e189913, 111111);
        registerStats(_tokenId1, getTreeRarity(111111));
        registerSeeds(_tokenId1);
        registerBreed(_tokenId1);
        emit TreeMinted(msg.sender, _tokenId1);
        uint256 _tokenId2 = mintTree(0x6B1ff62b68c5cF9C216168E39cd5e02e8e189913, 888888);
        registerStats(_tokenId2, getTreeRarity(888888));
        registerSeeds(_tokenId2);
        registerBreed(_tokenId2);
        emit TreeMinted(msg.sender, _tokenId2);
        _mint(0x6B1ff62b68c5cF9C216168E39cd5e02e8e189913, TREE_TOKEN, 1000, "");

        uint256 _tokenId3 = mintTree(0x7746786D2A28B7E826Ac8ca473676E61C807205d, 222222);
        registerStats(_tokenId3, getTreeRarity(222222));
        registerSeeds(_tokenId3);
        registerBreed(_tokenId3);
        emit TreeMinted(msg.sender, _tokenId3);
        uint256 _tokenId4 = mintTree(0x7746786D2A28B7E826Ac8ca473676E61C807205d, 999999);
        registerStats(_tokenId4, getTreeRarity(999999));
        registerSeeds(_tokenId4);
        registerBreed(_tokenId4);
        emit TreeMinted(msg.sender, _tokenId4);
        _mint(0x7746786D2A28B7E826Ac8ca473676E61C807205d, TREE_TOKEN, 1000, "");
    }

    function createTree(uint childSeed) private {
        uint256 _tokenId = mintTree(msg.sender, childSeed);
        registerStats(_tokenId, getTreeRarity(childSeed));
        registerSeeds(_tokenId);
        registerBreed(_tokenId);
        emit TreeMinted(msg.sender, _tokenId);
    }

    function breedTree(uint256 _tokenId1, uint256 _tokenId2) external {
        require(_tokenId1 != _tokenId2, "Can't breed tree with itself");
        require(balanceOf(msg.sender, _tokenId1) == 1, "Not the owner of the tree");
        require(balanceOf(msg.sender, _tokenId2) == 1, "Not the owner of the tree");
        canTreeBreed(_tokenId1);
        canTreeBreed(_tokenId2);
        uint breedCost = treeBreedCost(getTreeRarity(getSeed(_tokenId1)), getTreeRarity(getSeed(_tokenId2)));
        require(balanceOf(msg.sender, TREE_TOKEN) >= breedCost, "Not enough tokens to upgrade");
        _burn(msg.sender, TREE_TOKEN, breedCost);
        uint childSeed = breedTrees(_tokenId1, _tokenId2, getSeed(_tokenId1), getSeed(_tokenId2));
        createTree(childSeed);
    }

    function plantTree(uint256 _tokenId) external {
        require(balanceOf(msg.sender, _tokenId) == 1, "Not the owner of the tree");
        updateSeeds(_tokenId);
        require(getSeeds(_tokenId) > 0, "No seeds left");
        consumeSeed(_tokenId);
        TreeUpgrade memory stats = getTreeStats(_tokenId);
        uint seed = getSeed(_tokenId);
        plantTree(_tokenId, getSeedTrunkStats(seed) + stats.trunkUpgrade);
        emit TreePlanted(msg.sender, _tokenId, block.timestamp);
    }

    function collectTree() external {
        uint256 _tokenId = getGrowingTree().tokenId;
        uint seed = getSeed(_tokenId);
        TreeUpgrade memory stats = getTreeStats(_tokenId);
        uint256 tokens = collectTree(getSeedLeavesStats(seed) + stats.leavesUpgrade);
        _mint(msg.sender, TREE_TOKEN, tokens, "");
        emit TreeCollected(msg.sender, _tokenId, tokens);
    }

    function upgradeTreeTrunk(uint256 _tokenId) external {
        require(balanceOf(msg.sender, _tokenId) == 1, "Not the owner of the tree");
        canUpgradeTrunk(_tokenId);
        uint seed = getSeed(_tokenId);
        uint cost = getTrunkUpgradeCost(_tokenId, getSeedTrunkStats(seed));
        require(balanceOf(msg.sender, TREE_TOKEN) >= cost, "Not enough tokens to upgrade");
        _burn(msg.sender, TREE_TOKEN, cost);
        upgradeTrunk(_tokenId);
    }

    function upgradeTreeLeaves(uint256 _tokenId) external {
        require(balanceOf(msg.sender, _tokenId) == 1, "Not the owner of the tree");
        canUpgradeLeaves(_tokenId);
        uint seed = getSeed(_tokenId);
        uint cost = getLeavesUpgradeCost(_tokenId, getSeedLeavesStats(seed));
        require(balanceOf(msg.sender, TREE_TOKEN) >= cost, "Not enough tokens to upgrade");
        _burn(msg.sender, TREE_TOKEN, cost);
        upgradeLeaves(_tokenId);
    }

    function getSeedLeavesStats(uint _seed) public pure returns (uint) {
        uint seed = _seed % 1000;
        uint leavesStats = 0;
        for (uint i = 0; i < 3; i++) {
            leavesStats += seed % 10;
            seed /= 10;
        }
        return leavesStats;
    }

    function getSeedTrunkStats(uint _seed) public pure returns (uint) {
        uint seed = _seed % 1000;
        uint trunkStats = 0;
        for (uint256 i = 0; i < 3; i++) {
            trunkStats += seed % 10;
            seed /= 10;
        }
        return trunkStats;
    }

    function getTreeRarity(uint _seed) public pure returns (uint) {
        uint rarity = 0;
        for (uint i = 0; i < 6; i++) {
            rarity += _seed % 10;
            _seed /= 10;
        }
        return rarity;
    }

    function mintRandomTree() external payable {
        require(tokenId <= 10000, "Max available mints reached");
        require(msg.value >= 0.1 ether, "You must add a value of at least 0.1 ether");
        uint seed = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))) % 1000000;
        createTree(seed);
    }

    function buySeeds(uint256 _tokenId, uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_tokenId > 0, "Token ID must be greater than 0");
        require(balanceOf(msg.sender, _tokenId) == 1, "Not the owner of the tree");
        require(getSeedCost(_tokenId) * _amount < balanceOf(msg.sender, TREE_TOKEN), "Not enough funds");
        uint256 cost = getSeedCost(_tokenId);
        _burn(msg.sender, TREE_TOKEN, cost);
        addSeeds(_tokenId, _amount);
    }
}
