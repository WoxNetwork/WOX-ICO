pragma solidity ^0.4.23;

import "./BasicCrowdsale.sol";

/**
 * @title FinalizableCrowdsale
 * @dev 
 */
contract FinalizableCrowdsale is BasicCrowdsale {
    enum State {Active, Refunding, Closed}
    State state;   
    bool isFinalized;
    
    event Finalized();
    event Closed();

    /**
    * @dev 
    * @param
    */
    function goalReached() public view returns(bool) {
        return weiRaised >= softcapWei;
    }

    /**
    * @dev 
    * @param
    */
    function finalize() public onlyOwner {
        require(!isFinalized);
        require(hasClosed());
        finalization();
        isFinalized = true;
        emit Finalized();
    }

    /**
    * @dev 
    * @param
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