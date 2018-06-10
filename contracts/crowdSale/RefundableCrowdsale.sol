pragma solidity ^0.4.23;

import "./FinalizableCrowdsale.sol";

/**
 * @title RefundableCrowdsale
 * @dev RefundableCrowdsale inherits FinalizableCrowdsale and intended to manage Refunding process.
 */
contract RefundableCrowdsale is FinalizableCrowdsale {
    
    event Refunded(address _investor, uint256 _depositedValue);
    
    /**
    * @dev Refunds the investing ETHERs back to participants.
    * @param _investor Address of investor supposed to be refunded.
    * @note Refunding process would be occured if the desired softcap is not reached and 
    * the owner finalizes the crowdsale after its ending.
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