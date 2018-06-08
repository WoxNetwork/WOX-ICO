pragma solidity ^0.4.23;

library whitelist {
    struct Whitelist {
        mapping(address => bool) bearer;
    }

    function add(Whitelist storage wlist, address _address) internal {
        wlist.bearer[_address] = true;
    }

    function remove(Whitelist storage wlist, address _address) internal {
        wlist.bearer[_address] = false;
    }

    function has(Whitelist storage wlist, address _address) internal view returns (bool) {
        return wlist.bearer[_address];
    }

    function check(Whitelist storage wlist, address _address) internal view {
        require(has(wlist, _address));
    }

}