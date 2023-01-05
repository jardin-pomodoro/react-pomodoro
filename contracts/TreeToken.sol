pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TreeToken is  ERC1155Supply, Ownable {
    string public name = "Tree Collection";
    address public CONTRACT_OWNER;
    uint256 internal TREE_TOKEN = 0;
    uint256 internal tokenId = 1;
    mapping(uint256 => uint) private treeSeeds;

    constructor() ERC1155("https://pooetitu.fr/tree/") {
    }

    function mintTree(address _to, uint _seed) internal returns (uint256) {
        treeSeeds[tokenId] = _seed;
        uint256 _tokenId = tokenId;
        _mint(_to, _tokenId, 1, "");
        tokenId += 1;
        return _tokenId;
    }

    function setURI(string memory newUri) public onlyOwner {
        _setURI(newUri);
    }

    function withdraw() public payable onlyOwner {
        payable(msg.sender).call{value : address(this).balance}("");
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

    function getSeed(uint256 _tokenId) public view returns (uint) {
        require(_tokenId > 0, "Token ID invalid");
        return treeSeeds[_tokenId];
    }

    function getTokenCount() public view returns (uint256) {
        return tokenId;
    }
}

