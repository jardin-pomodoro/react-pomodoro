pragma solidity ^0.8.0;

contract TreeStats {
    struct TreeUpgrade {
        uint maxUpgrades;
        uint leavesUpgrade;
        uint trunkUpgrade;
    }

    mapping(uint256 => TreeUpgrade) treeStats;

    function generateMaxUpgrades(uint rarity) private pure returns (uint) {
        return rarity / 6;
    }

    function addTreeStats(uint256 _tokenId, uint treeRarity) internal {
        treeStats[_tokenId] = TreeUpgrade(generateMaxUpgrades(treeRarity), 0, 0);
    }

    function canUpgradeTrunk(uint256 _tokenId) internal view {
        require(treeStats[_tokenId].trunkUpgrade <= treeStats[_tokenId].maxUpgrades, "Max trunk level reached for this token");
    }

    function canUpgradeLeaves(uint256 _tokenId) internal view {
        require(treeStats[_tokenId].leavesUpgrade <= treeStats[_tokenId].maxUpgrades, "Max leaves level reached for this token");
    }

    function getLeavesUpgradeCost(uint256 _tokenId, uint leavesBaseStates) public view returns (uint) {
        return treeStats[_tokenId].leavesUpgrade + leavesBaseStates / treeStats[_tokenId].maxUpgrades;
    }

    function getTrunkUpgradeCost(uint256 _tokenId, uint trunkBaseStats) public view returns (uint) {
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