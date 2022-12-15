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
        _mint(msg.sender, TREE_TOKEN, 4 * 10 ** 6, "");
    }

    function mintTree(address to, uint32 seed) internal {
        treeSeeds[tokenId] = seed;
        _mint(to, tokenId, 1, "");
        tokenId += 1;
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
        return treeSeeds[tokenId];
    }
}

contract BreedTree {
    mapping(uint256 => uint8) private treeBreeds;

    function mutate(uint32 seed) private returns (uint32) {
        uint32 mutations = seed;
        for (uint8 i = 0; i < 32; i++) {
            uint32 mutation = uint32(uint256(keccak256(abi.encodePacked(block.timestamp, seed, i))) % 5) - 2;
            mutations = mutations + mutation * uint32(10 ** i);
        }
        return mutations;
    }

    function breed(uint32 seed1, uint32 seed2) private returns (uint32) {
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

    function canTreeBreed(uint256 _tokenId) internal {
        require(treeBreeds[_tokenId] < 2, "Tree already breed");
    }

    function treeBreedCost(uint256 _tokenId) public view returns (uint8) {
        return 20;
    }
}

contract TreeCore is TreeToken, BreedTree, Forest {
    function breed(uint256 _tokenId1, uint256 _tokenId2) external {
        require(balanceOf(msg.sender, _tokenId1) == 1, "Not the owner of the tree");
        require(balanceOf(msg.sender, _tokenId2) == 1, "Not the owner of the tree");
        canTreeBreed(_tokenId1);
        canTreeBreed(_tokenId2);
        uint8 breedCost = treeBreedCost(_tokenId1) + treeBreedCost(_tokenId2);
        _burn(msg.sender, TREE_TOKEN, breedCost);
        uint32 seed = breedTrees(_tokenId1, _tokenId2, getSeed(_tokenId1), getSeed(_tokenId2));
        mintTree(msg.sender, seed);
    }

    function plantTree(uint256 _tokenId) external {
        require(balanceOf(msg.sender, _tokenId) == 1, "Not the owner of the tree");
        plantTree(_tokenId, 0);
    }
}

contract Forest {
    struct PlantedTree {
        uint256 tokenId;
        uint256 startTime;
        uint8 growingTime;
    }

    mapping(address => PlantedTree) plantedTrees;

    function getGrowingTime(uint8 trunkStat) private returns (uint8) {
        return trunkStat / 2;
    }

    function getProducedTokens(uint8 leavesStat) private returns (uint8) {
        return leavesStat / 2;
    }


    function plantTree(uint256 tokenId, uint8 trunkStat) internal {
        plantedTrees[msg.sender] = PlantedTree(tokenId, now, getGrowingTime(trunkStat));
    }

    function getGrowingTree() external view {
        return plantTrees[msg.sender];
    }

    function collectTree(uint8 leavesStat) internal returns (uint8) {
        PlantedTree memory plantedTree = plantedTrees[msg.sender];
        require(now - plantedTree.startTime / 3600 > plantedTree.growingTime);
        delete plantedTrees[msg.sender];
        uint8 tokens = getProducedTokens(leavesStat);
        return tokens;
    }
}
