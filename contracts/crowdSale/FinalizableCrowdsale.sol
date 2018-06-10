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
    * @note Only owner is allowed to finalizing the crowdsale.
    * @note Only when the crowdsale is reached to its ending, finalization is allowed.
    */
    function finalize() public onlyOwner {
        require(!isFinalized);
        require(hasClosed());
        finalization();
        isFinalized = true;
        emit Finalized();
    }

    /**
    * @dev Internal function executes the finalization process.
    * @note If the softcap goal is reached this action would change the crowdsale state to 'Closed' state.
    * @note If the desired softcap goal is not raised this action would change the crowdsale state to 'Rfunding' state.
    * and since then every participant could refund his/her invests back.
    */
    function finalization() internal {
        require(state == State.Active);
        if (goalReached()) {
            state = State.Closed;
            wallet.transfer(address(this).balance);
            emit Closed();
        } else {
            state = State.Refunding;
        }
    }
}