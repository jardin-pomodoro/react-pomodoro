pragma solidity ^0.8.17;

contract TreeStats {
    event TreeUpgraded(address indexed to, uint256 indexed _tokenId, TreeUpgrade stats);

    struct TreeUpgrade {
        uint maxUpgrades;
        uint leavesUpgrade;
        uint trunkUpgrade;
    }

    mapping(uint256 => TreeUpgrade) treeStats;

    function generateMaxUpgrades(uint rarity) private pure returns (uint) {
        return (rarity / 6) + 1;
    }

    function registerStats(uint256 _tokenId, uint treeRarity) internal {
        treeStats[_tokenId] = TreeUpgrade(generateMaxUpgrades(treeRarity), 0, 0);
    }

    function canUpgradeTrunk(uint256 _tokenId) internal view {
        require(treeStats[_tokenId].trunkUpgrade <= treeStats[_tokenId].maxUpgrades, "Max trunk level reached for this token");
    }

    function canUpgradeLeaves(uint256 _tokenId) internal view {
        require(treeStats[_tokenId].leavesUpgrade <= treeStats[_tokenId].maxUpgrades, "Max leaves level reached for this token");
    }

    function getLeavesUpgradeCost(uint256 _tokenId, uint leavesBaseStates) public view returns (uint) {
        return ((leavesBaseStates + treeStats[_tokenId].leavesUpgrade + 1) / treeStats[_tokenId].maxUpgrades) ** 2;
    }

    function getTrunkUpgradeCost(uint256 _tokenId, uint trunkBaseStats) public view returns (uint) {
        return ((trunkBaseStats + treeStats[_tokenId].trunkUpgrade + 1) / treeStats[_tokenId].maxUpgrades) ** 2;
    }

    function upgradeTrunk(uint256 _tokenId) internal {
        treeStats[_tokenId].trunkUpgrade++;
        emit TreeUpgraded(msg.sender, _tokenId, treeStats[_tokenId]);
    }

    function upgradeLeaves(uint256 _tokenId) internal {
        treeStats[_tokenId].leavesUpgrade++;
        emit TreeUpgraded(msg.sender, _tokenId, treeStats[_tokenId]);
    }

    function getTreeStats(uint256 _tokenId) public view returns (TreeUpgrade memory) {
        return treeStats[_tokenId];
    }
}