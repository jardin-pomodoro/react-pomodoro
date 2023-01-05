pragma solidity ^0.8.0;


contract ForestSeeds {
    event SeedRefreshed(address indexed to, uint256 _tokenId, uint256 _seedCount);

    struct ForestSeed {
        uint256 seeds;
        uint256 boughtSeeds;
        uint256 lastUpdate;
    }

    mapping(uint256 => ForestSeed) private userSeeds;

    function registerSeeds(uint256 _tokenId) internal {
        userSeeds[_tokenId] = ForestSeed(4, 0, block.timestamp);
    }

    function consumeSeed(uint256 _tokenId) internal {
        if (userSeeds[_tokenId].seeds > 0) {
            userSeeds[_tokenId].seeds--;
        }
        else {
            userSeeds[_tokenId].boughtSeeds--;
        }
    }

    function updateSeeds(uint256 _tokenId) public {
        if (userSeeds[_tokenId].lastUpdate / 86400 < block.timestamp / 86400) {
            userSeeds[_tokenId].seeds = 4;
            userSeeds[_tokenId].lastUpdate = block.timestamp;
            emit SeedRefreshed(msg.sender, _tokenId, getSeeds(_tokenId));
        }
    }

    function getSeeds(uint256 _tokenId) public view returns (uint256) {
        return userSeeds[_tokenId].boughtSeeds + userSeeds[_tokenId].seeds;
    }

    function getSeedCost(uint256 _tokenId) public view returns (uint256) {
        return 2 * (userSeeds[_tokenId].boughtSeeds + 1);
    }

    function addSeeds(uint256 _tokenId, uint256 amount) internal {
        userSeeds[_tokenId].boughtSeeds += amount;
    }
}