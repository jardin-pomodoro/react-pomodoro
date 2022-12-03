pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/";

contract TreeNFT is ERC721, Ownable  {

    struct TreeAttributes {
        string seed;
        uint8 trunkUpgradeCount;
        uint8 leavesUpgradeCount;
        uint8 breedCount;
    }

    string private _uri = "https://pooetitu.fr/tree";
    uint256 private tokenId = 1;
    mapping(uint256 => TreeAttributes) private treeAttributes;

    constructor() ERC721("TreeToken", "TTK") {
        _mintTree(TreeAttributes("999999", 0, 0, 0));
        _mintTree(TreeAttributes("999999", 0, 0, 0));
    }

    function _mintTree(TreeAttributes memory tree) private {
        tokenId += 1;
        treeAttributes[tokenId] = tree;
        _safeMint(msg.sender, tokenId);
    }

    function seed(uint256 _tokenId) public view returns (string memory) {
        return treeAttributes[_tokenId].seed;
    }

    function attributes(uint256 _tokenId) public view returns (TreeAttributes memory) {
        return treeAttributes[_tokenId];
    }

    function setURI(string memory newUri) public onlyOwners {
        _uri = newUri;
    }

    function baseTokenURI() public view returns (string memory) {
        return _uri;
    }
}
