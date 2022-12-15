pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TreeToken is ERC1155, Ownable, ERC1155Burnable {
    string public name = "Tree Collection";
    uint256 internal TREE_TOKEN = 0;
    uint256 private tokenId = 1;
    mapping(uint256 => uint32) private treeSeeds;

    constructor() ERC1155("https://pooetitu.fr/tree/") {
    }

    function mintTree(address _to, uint32 _seed) internal returns (uint256) {
        treeSeeds[tokenId] = _seed;
        uint256 _tokenId = tokenId;
        _mint(_to, _tokenId, 1, "");
        tokenId += 1;
        return _tokenId;
    }

    function setURI(string memory newUri) public onlyOwner {
        _setURI(newUri);
    }

    function uri(uint256 _tokenId) override public view returns (string memory) {
        return string(
            abi.encodePacked(
                super.uri(0),
                Strings.toString(_tokenId)
            )
        );
    }

    function baseTokenURI() public view returns (string memory) {
        return super.uri(0);
    }

    function getSeed(uint256 _tokenId) public view returns (uint32) {
        return treeSeeds[_tokenId];
    }
}

contract BreedTree {
    mapping(uint256 => uint8) private treeBreeds;

    function mutate(uint32 seed) private view returns (uint32) {
        uint32 mutations = seed;
        for (uint8 i = 0; i < 32; i++) {
            uint32 mutation = uint32(uint256(keccak256(abi.encodePacked(block.timestamp, seed, i))) % 5) - 2;
            mutations = mutations + mutation * uint32(10 ** i);
        }
        return mutations;
    }

    function breed(uint32 seed1, uint32 seed2) private pure returns (uint32) {
        uint32 seed = 0;
        for (uint8 i = 0; i < 6; i++) {
            seed += (seed1 % 10 + seed2 % 10) / 2;
            seed1 /= 10;
            seed2 /= 10;
            if (i < 5) {
                seed *= 10;
            }
        }
        return seed;
    }

    function breedTrees(uint256 _tokenId1, uint256 _tokenId2, uint32 seed1, uint32 seed2) internal returns (uint32) {
        treeBreeds[_tokenId1]++;
        treeBreeds[_tokenId2]++;
        uint32 seed = breed(seed1, seed2);
        return mutate(seed);
    }

    function canTreeBreed(uint256 _tokenId) internal view {
        require(treeBreeds[_tokenId] < 2, "Tree already breed");
    }

    function treeBreedCost(uint8 treeRarity1, uint8 treeRarity2) public pure returns (uint8) {
        return (treeRarity1 + treeRarity2) / 2;
    }
}

contract Forest {
    struct PlantedTree {
        uint256 tokenId;
        uint256 startTime;
        uint8 growingTime;
    }

    mapping(address => PlantedTree) plantedTrees;

    function getGrowingTime(uint8 _trunkStat) private pure returns (uint8) {
        return _trunkStat / 2;
    }

    function getProducedTokens(uint8 _leavesStat) private pure returns (uint8) {
        return _leavesStat * 2;
    }

    function plantTree(uint256 _tokenId, uint8 _trunkStat) internal {
        plantedTrees[msg.sender] = PlantedTree(_tokenId, block.timestamp, getGrowingTime(_trunkStat));
    }

    function getGrowingTree() public view returns (PlantedTree memory) {
        return plantedTrees[msg.sender];
    }

    function collectTree(uint8 _leavesStat) internal returns (uint8) {
        PlantedTree memory plantedTree = plantedTrees[msg.sender];
        require(block.timestamp - plantedTree.startTime / 3600 > plantedTree.growingTime);
        delete plantedTrees[msg.sender];
        uint8 tokens = getProducedTokens(_leavesStat);
        return tokens;
    }
}

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

contract ForestSeeds {
    struct ForestSeed {
        uint8 seeds;
        uint32 boughtSeeds;
        uint256 lastUpdate;
    }

    mapping(address => ForestSeed) private userSeeds;

    function consumeSeed() internal {
        if (userSeeds[msg.sender].seeds > 0) {
            userSeeds[msg.sender].seeds--;
        }
        else {
            userSeeds[msg.sender].boughtSeeds--;
        }
    }

    function updateSeeds() internal {
        if (userSeeds[msg.sender].lastUpdate / 86400 < block.timestamp / 86400) {
            userSeeds[msg.sender].seeds = 4;
            userSeeds[msg.sender].lastUpdate = block.timestamp;
        }
    }

    function getSeeds() public view returns (uint32) {
        return userSeeds[msg.sender].boughtSeeds + userSeeds[msg.sender].seeds;
    }
}

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
