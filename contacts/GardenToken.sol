// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract GardenToken {
    string public name = "Nospy Token";
    string public symbol = "NPT";

    // The fixed amount of tokens that will be created.
    uint256 public totalSupply = 1000000;

    // Used to store ethereum accounts.
    address public owner;

    // Used to store the balances of each account.
    mapping(address => uint) balances;
    address[] public _accounts;

    // The Transfer event helps off-chain applications understand
    // what happens within your contract.
    event Transfer(address indexed _from, address indexed _to, uint _tokens);

    // The constructor is a special function that is only executed
    // upon contract creation.
    constructor() {
        // The total supply is assigned to the contract's creator.
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
        _accounts.push(owner);
    }

    function transfer(address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(balances[msg.sender] >= amount, "ERC20: transfer amount exceeds balance");

        console.log("Transferring %s tokens from %s to %s", amount, msg.sender, to);

        // Transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;

        // Add the account to the accounts array if it doesn't exist
        _addAccount(to);

        // Notify off-chain applications of the transfer.
        emit Transfer(msg.sender, to, amount);
    }

    // This function returns the balance of the account specified.
    function balanceOf(address _account) external view returns (uint) {
        return balances[_account];
    }

    function accounts() external view returns (address[] memory) {
        return _accounts;
    }

    function _addAccount(address _account) internal {
        for (uint i = 0; i < _accounts.length; i++) {
            if (_accounts[i] == _account) {
                return;
            }
        }
        _accounts.push(_account);
    }
}
