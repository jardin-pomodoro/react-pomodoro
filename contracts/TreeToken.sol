pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Ownables.sol";

contract TreeToken is ERC20, Ownables, ERC20Burnable {

    constructor() ERC20("TreeCoin","TC") {
        _mint(msg.sender, 4 * 10 ** 6);
    }

    function mintTokens(address to, uint256 amount) onlyOwners {
        _mint(to, amount);
    }

    function burnTokens(address to, uint256 amount) onlyOwners {
        _burn(to, amount);
    }
}
