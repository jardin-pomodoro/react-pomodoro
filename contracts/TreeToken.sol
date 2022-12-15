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
    }

    function mintTree(address _to, uint32 _seed) internal returns (uint256) {
        treeSeeds[tokenId] = _seed;
        uint256 _tokenId = tokenId;
        _mint(_to, _tokenId, 1, "");
        tokenId += 1;
        return _tokenId;
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
        return treeSeeds[_tokenId];
    }
}

