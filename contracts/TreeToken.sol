pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TreeToken is ERC1155, Ownable, ERC1155Burnable {
    struct TreeAttributes {
        string seed;
        uint8 trunkUpgradeCount;
        uint8 leavesUpgradeCount;
        uint8 breedCount;
    }

    string public name = "Tree Collection";
    uint256 private TREE_TOKEN = 0;
    uint256 private tokenId = 1;
    mapping(uint256 => TreeAttributes) private treeAttributes;

    constructor() ERC1155("http://pooetitu.fr/tree/") {
        _mint(msg.sender, TREE_TOKEN, 4 * 10 ** 6, "");
        treeAttributes[tokenId] = TreeAttributes("999999", 0, 0, 0);
        _mint(msg.sender, tokenId, 1, "");
        tokenId += 1;
        treeAttributes[tokenId] = TreeAttributes("999999", 0, 0, 0);
        _mint(msg.sender, tokenId, 1, "");
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
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

    function seed(uint256 _tokenId) public view returns (string memory) {
        return treeAttributes[_tokenId].seed;
    }

    function attributes(uint256 _tokenId) public view returns (TreeAttributes memory) {
        return treeAttributes[_tokenId];
    }
}
