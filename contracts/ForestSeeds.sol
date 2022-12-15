pragma solidity ^0.8.0;


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