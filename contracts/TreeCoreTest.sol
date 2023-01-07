pragma solidity ^0.8.0;

import "./TreeCore.sol";

contract TreeCoreTest is TreeCore {
    function setTokenId(uint256 _tokenId) public {
        tokenId = _tokenId;
    }

    function consumeSeeds(uint256 _tokenId) public {
        super.consumeSeed(_tokenId);
    }

    function addTokens(uint256 amount) public {
        _mint(msg.sender, TREE_TOKEN, amount, "");
    }
}
