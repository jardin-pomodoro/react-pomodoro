pragma solidity ^0.8.0;


contract ForestSeeds {
    struct ForestSeed {
        uint8 seeds;
        uint32 boughtSeeds;
        uint256 lastUpdate;
    }

    mapping(uint256 => ForestSeed) private userSeeds;

    function consumeSeed(uint256 _tokenId) internal {
        if (userSeeds[_tokenId].seeds > 0) {
            userSeeds[_tokenId].seeds--;
        }
        else {
            userSeeds[_tokenId].boughtSeeds--;
        }
    }

    function updateSeeds(uint256 _tokenId) internal {
        if (userSeeds[_tokenId].lastUpdate / 86400 < block.timestamp / 86400) {
            userSeeds[_tokenId].seeds = 4;
            userSeeds[_tokenId].lastUpdate = block.timestamp;
        }
    }

    function getSeeds(uint256 _tokenId) public view returns (uint32) {
        return userSeeds[_tokenId].boughtSeeds + userSeeds[_tokenId].seeds;
    }

    function getSeedCost(uint256 _tokenId) public view returns (uint256) {
        return 0.01 * (userSeeds[_tokenId].boughtSeeds + 1);
    }

    function addSeed(uint256 _tokenId, uint256 amount) internal {
        userSeeds[_tokenId].boughtSeeds += amount;
    }
}