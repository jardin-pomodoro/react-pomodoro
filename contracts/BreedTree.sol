pragma solidity ^0.8.0;


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
