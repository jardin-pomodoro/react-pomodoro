pragma solidity ^0.8.0;

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
        require((block.timestamp - plantedTree.startTime) / 3600 > plantedTree.growingTime);
        delete plantedTrees[msg.sender];
        uint8 tokens = getProducedTokens(_leavesStat);
        return tokens;
    }
}
