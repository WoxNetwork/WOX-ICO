pragma solidity ^0.4.23;

import "./FinalizableCrowdsale.sol";

/**
 * @title RefundableCrowdsale
 * @dev 
 */
contract RefundableCrowdsale is FinalizableCrowdsale {
    
    event Refunded(address _investor, uint256 _depositedValue);
    
    /**
    * @dev 
    * @param
    */
    function refund(address _investor) public {
        require(isFinalized);
        require(state == State.Refunding);
        require(depositedWei[_investor] != 0);
        uint256 refundValue = depositedWei[_investor];
        depositedWei[_investor] = 0;
        _investor.transfer(refundValue);
        emit Refunded(_investor, refundValue);
    }
}