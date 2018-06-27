pragma solidity ^0.4.23;

import "./BasicCrowdsale.sol";

/**
 * @title FinalizableCrowdsale
 * @dev FinalizableCrowdsale inherits BasicCrowdsale and intended to manage finalization process.
 */
contract FinalizableCrowdsale is BasicCrowdsale {
    enum State {Active, Refunding, Closed}
    State state;   
    bool isFinalized;
    
    event Finalized();
    event Closed();

    /**
     * @dev Checks if softcap goal is reached.
     * @return A bool showing whether the softcap goal is reached.
     */
    function goalReached() public view returns(bool) {
        return weiRaised >= softcapWei;
    }

    /**
     * @dev Finalizes the ICO.
     * @dev note Only owner is allowed to finalizing the crowdsale.
     * @dev note Only when the crowdsale is reached to its ending, finalization is allowed.
     * @param toBeClosed A bool determines crowdsale must be colsed or refunded.
     */
    function finalize(bool toBeClosed) public onlyOwner {
        require(!isFinalized);
        require(hasClosed());
        finalization(toBeClosed);
        isFinalized = true;
        emit Finalized();
    }

    /**
     * @dev Internal function executes the finalization process.
     * @dev note If the softcap goal is reached this action would change the crowdsale state to 'Closed' state.
     * @dev note If the desired softcap goal is not raised this action would change the crowdsale state to 'Rfunding' state.
     * and since then every participant could refund his/her invests back.
     * @param toBeClosed A bool determines crowdsale must be colsed or refunded.
     */
    function finalization(bool toBeClosed) internal {
        require(state == State.Active);
        if (toBeClosed) {
            state = State.Closed;
            wallet.transfer(address(this).balance);
            emit Closed();
        } else {
            state = State.Refunding;
        }
    }
}