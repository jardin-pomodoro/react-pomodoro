pragma solidity ^0.8.0;

import "./TreeToken.sol";
import "./BreedTree.sol";
import "./Forest.sol";
import "./TreeStats.sol";
import "./ForestSeeds.sol";


contract TreeCore is TreeToken, BreedTree, Forest, TreeStats, ForestSeeds {
    event TreeMinted(address indexed to, uint256 _tokenId);
    event TreePlanted(address indexed to, uint256 _tokenId, uint256 startTime);
    event TreeCollected(address indexed to, uint256 _tokenId, uint256 tokensCollected);

    function createTree(uint childSeed) private {
        uint256 _tokenId = mintTree(msg.sender, childSeed);
        addTreeStats(_tokenId, getTreeRarity(childSeed));
        register(_tokenId);
        emit TreeMinted(msg.sender, _tokenId);
    }

    function breedTree(uint256 _tokenId1, uint256 _tokenId2) external {
        require(_tokenId1 != _tokenId2, "Can't breed tree with itself");
        require(balanceOf(msg.sender, _tokenId1) == 1, "Not the owner of the tree");
        require(balanceOf(msg.sender, _tokenId2) == 1, "Not the owner of the tree");
        canTreeBreed(_tokenId1);
        canTreeBreed(_tokenId2);
        uint breedCost = treeBreedCost(getTreeRarity(getSeed(_tokenId1)), getTreeRarity(getSeed(_tokenId2)));
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
        _burn(msg.sender, TREE_TOKEN, cost);
        upgradeTrunk(_tokenId);
    }

    function upgradeTreeLeaves(uint256 _tokenId) external {
        require(balanceOf(msg.sender, _tokenId) == 1, "Not the owner of the tree");
        canUpgradeLeaves(_tokenId);
        uint seed = getSeed(_tokenId);
        uint cost = getLeavesUpgradeCost(_tokenId,getSeedLeavesStats(seed));
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
