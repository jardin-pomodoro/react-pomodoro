pragma solidity ^0.8.0;

import "./TreeCore.sol";

contract TreeCoreTest is TreeCore {
    function setTokenId(uint256 _tokenId) public {
        tokenId = _tokenId;
    }
}
