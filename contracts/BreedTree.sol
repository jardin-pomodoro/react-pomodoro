pragma solidity ^0.8.0;


contract BreedTree {
    mapping(uint256 => uint8) private treeBreeds;

    function mutate(uint seed) private view returns (uint) {
        uint mutation = uint256(keccak256(abi.encodePacked(block.difficulty, seed))) % seed;
        uint op = uint256(keccak256(abi.encodePacked(block.difficulty, seed))) % 2;
        if(op == 1) {
            return mutation - seed % 1000000;
        }
        return mutation + seed % 1000000;
    }

    function breed(uint seed1, uint seed2) private pure returns (uint) {
        uint seed = 0;
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

    function breedTrees(uint256 _tokenId1, uint256 _tokenId2, uint seed1, uint seed2) internal returns (uint) {
        treeBreeds[_tokenId1]++;
        treeBreeds[_tokenId2]++;
        uint seed = breed(seed1, seed2);
        return mutate(seed);
    }

    function canTreeBreed(uint256 _tokenId) internal view {
        require(treeBreeds[_tokenId] < 2, "Tree already breed");
    }

    function treeBreedCost(uint8 treeRarity1, uint8 treeRarity2) public pure returns (uint8) {
        return (treeRarity1 + treeRarity2) / 2;
    }
}
