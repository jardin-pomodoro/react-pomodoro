pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Context.sol";

abstract contract Ownables is Context {
    address[] private _owners;
    uint8 constant private _ownersCount = 20;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _owners = new address[](_ownersCount);
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owners.
     */
    modifier onlyOwners() {
        _checkOwners();
        _;
    }

    /**
     * @dev Throws if the sender is not one of the owners.
     */
    function _checkOwners() internal view {
        bool isOwner = false;
        for (uint256 i = 0; i < _owners.length; i++) {
            if (_owners[i] == _msgSender()) {
                isOwner = true;
                break;
            }
        }

        require(isOwner, "Ownables: caller is not one of the owner");
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public onlyOwners {
        require(newOwner != address(0), "Ownables: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal {
        for (uint256 i = 0; i < _owners.length; i++) {
            if (_owners[i] == _msgSender()) {
                _owners[i] = newOwner;
                break;
            }
        }

        emit OwnershipTransferred(_msgSender(), newOwner);
    }

    /**
     * @dev Returns the address of the owners.
     */
    function owners() public view returns (address[] memory) {
        return _owners;
    }

    /**
     * @dev Adds a new owner.
     */
    function addOwner(address newOwner) public onlyOwners {
        require(newOwner != address(0), "Ownables: new owner is the zero address");
        require(newOwner != _msgSender(), "Ownables: new owner is already one of the owners");
        require(_owners.length < _ownersCount, "Ownables: owners count is already max");

        _owners.push(newOwner);
    }

    /**
     * @dev Removes an owner.
     */
    function removeOwner(address ownerRemoval) public onlyOwners {
        require(ownerRemoval != address(0), "Ownables: new owner is the zero address");
        require(ownerRemoval != _msgSender(), "Ownables: can't exclude self");

        for (uint256 i = 0; i < _owners.length; i++) {
            if (_owners[i] == ownerRemoval) {
                _owners[i] = _owners[_owners.length - 1];
                _owners.pop();
                break;
            }
        }
    }
}
