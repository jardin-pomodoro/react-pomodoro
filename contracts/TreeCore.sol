pragma solidity ^0.8.0;

import "./TreeToken.sol";
import "./BreedTree.sol";
import "./Forest.sol";
import "./TreeStats.sol";
import "./ForestSeeds.sol";


contract TreeCore is TreeToken, BreedTree, Forest, TreeStats, ForestSeeds {
    function breed(uint256 _tokenId1, uint256 _tokenId2) external {
        require(balanceOf(msg.sender, _tokenId1) == 1, "Not the owner of the tree");
        require(balanceOf(msg.sender, _tokenId2) == 1, "Not the owner of the tree");
        updateSeeds();
        require(getSeeds() > 0, "No seeds left");
        canTreeBreed(_tokenId1);
        canTreeBreed(_tokenId2);
        uint8 breedCost = treeBreedCost(getTreeRarity(getSeed(_tokenId1)), getTreeRarity(getSeed(_tokenId1)));
        _burn(msg.sender, TREE_TOKEN, breedCost);
        consumeSeed();
        uint32 seed = breedTrees(_tokenId1, _tokenId2, getSeed(_tokenId1), getSeed(_tokenId2));
        uint256 tokenId = mintTree(msg.sender, seed);
        addTreeStats(tokenId, getTreeRarity(seed));
    }

    function plantTree(uint256 _tokenId) external {
        require(balanceOf(msg.sender, _tokenId) == 1, "Not the owner of the tree");
        TreeUpgrade memory stats = getTreeStats(_tokenId);
        uint32 seed = getSeed(_tokenId);
        plantTree(_tokenId, getSeedTrunkStats(seed) + stats.trunkUpgrade);
    }

    function collectTree() external {
        uint256 token = getGrowingTree().tokenId;
        uint32 seed = getSeed(token);
        TreeUpgrade memory stats = getTreeStats(token);
        uint8 tokens = collectTree(getSeedLeavesStats(seed) + stats.leavesUpgrade);
        _mint(msg.sender, TREE_TOKEN, tokens, "");
    }

    function upgradeTreeTrunk(uint256 _tokenId) external {
        require(balanceOf(msg.sender, _tokenId) == 1, "Not the owner of the tree");
        canUpgradeTrunk(_tokenId);
        uint32 seed = getSeed(_tokenId);
        uint8 cost = getTrunkUpgradeCost(_tokenId, getSeedTrunkStats(seed));
        _burn(msg.sender, TREE_TOKEN, cost);
        upgradeTrunk(_tokenId);
    }

    function upgradeTreeLeaves(uint256 _tokenId) external {
        require(balanceOf(msg.sender, _tokenId) == 1, "Not the owner of the tree");
        canUpgradeLeaves(_tokenId);
        uint32 seed = getSeed(_tokenId);
        uint8 cost = getLeavesUpgradeCost(_tokenId,getSeedLeavesStats(seed));
        _burn(msg.sender, TREE_TOKEN, cost);
        upgradeLeaves(_tokenId);
    }

    function getSeedLeavesStats(uint32 _seed) public pure returns (uint8) {
        uint32 seed = _seed % 1000;
        uint8 leavesStats = 0;
        for (uint8 i = 0; i < 3; i++) {
            leavesStats += uint8(seed % 10);
            seed /= 10;
        }
        return leavesStats;
    }

    function getSeedTrunkStats(uint32 _seed) public pure returns (uint8) {
        uint32 seed = _seed % 1000;
        uint8 trunkStats = 0;
        for (uint8 i = 0; i < 3; i++) {
            trunkStats += uint8(seed % 10);
            seed /= 10;
        }
        return trunkStats;
    }

    function getTreeRarity(uint32 _seed) public pure returns (uint8) {
        uint8 rarity = 0;
        for (uint8 i = 0; i < 6; i++) {
            rarity += uint8(_seed % 10);
            _seed /= 10;
        }
        return rarity;
    }
}
