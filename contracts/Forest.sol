pragma solidity ^0.8.0;

contract Forest {
    struct PlantedTree {
        uint256 tokenId;
        uint256 startTime;
        uint256 growingTime;
    }

    mapping(address => PlantedTree) plantedTrees;

    function getGrowingTime(uint256 _trunkStat) private pure returns (uint256) {
        return _trunkStat / 2;
    }

    function getProducedTokens(uint256 _leavesStat) private pure returns (uint256) {
        return _leavesStat * 2;
    }

    function plantTree(uint256 _tokenId, uint256 _trunkStat) internal {
        plantedTrees[msg.sender] = PlantedTree(_tokenId, block.timestamp, getGrowingTime(_trunkStat));
    }

    function getGrowingTree() public view returns (PlantedTree memory) {
        return plantedTrees[msg.sender];
    }

    function collectTree(uint _leavesStat) internal returns (uint256) {
        PlantedTree memory plantedTree = plantedTrees[msg.sender];
        require((block.timestamp - plantedTree.startTime) / 3600 > plantedTree.growingTime);
        delete plantedTrees[msg.sender];
        uint256 tokens = getProducedTokens(_leavesStat);
        return tokens;
    }
}
