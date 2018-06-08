pragma solidity ^0.4.23;

/**
 *@title Teoken Receiver contract interface.
 */
contract contractReceiver {
    function tokenFallback(address _from, uint256 _value, bytes _data) public pure;
}