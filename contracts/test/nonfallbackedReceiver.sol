pragma solidity ^0.4.23;

contract nonfallbackedReceiver {
    uint256 val;
    constructor() public {
        val = 0;   
    }
}