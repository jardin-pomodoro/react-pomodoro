pragma solidity ^0.8.0;

contract TreeStats {
    struct TreeUpgrade {
        uint8 maxUpgrades;
        uint8 leavesUpgrade;
        uint8 trunkUpgrade;
    }

    mapping(uint256 => TreeUpgrade) treeStats;

    function generateMaxUpgrades(uint8 rarity) private pure returns (uint8) {
        return uint8(rarity / 6);
    }

    function addTreeStats(uint256 _tokenId, uint8 treeRarity) internal {
        treeStats[_tokenId] = TreeUpgrade(generateMaxUpgrades(treeRarity), 0, 0);
    }

    function canUpgradeTrunk(uint256 _tokenId) internal view {
        require(treeStats[_tokenId].trunkUpgrade <= treeStats[_tokenId].maxUpgrades, "Max trunk level reached for this token");
    }

    function canUpgradeLeaves(uint256 _tokenId) internal view {
        require(treeStats[_tokenId].leavesUpgrade <= treeStats[_tokenId].maxUpgrades, "Max leaves level reached for this token");
    }

    function getLeavesUpgradeCost(uint256 _tokenId, uint8 leavesBaseStates) public view returns (uint8) {
        return treeStats[_tokenId].leavesUpgrade + leavesBaseStates / treeStats[_tokenId].maxUpgrades;
    }

    function getTrunkUpgradeCost(uint256 _tokenId, uint8 trunkBaseStats) public view returns (uint8) {
        return treeStats[_tokenId].trunkUpgrade + trunkBaseStats / treeStats[_tokenId].maxUpgrades;
    }

    function upgradeTrunk(uint256 _tokenId) internal {
        treeStats[_tokenId].trunkUpgrade++;
    }

    function upgradeLeaves(uint256 _tokenId) internal {
        treeStats[_tokenId].leavesUpgrade++;
    }

    function getTreeStats(uint256 _tokenId) public view returns (TreeUpgrade memory) {
        return treeStats[_tokenId];
    }
}