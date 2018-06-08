pragma solidity ^0.4.23;

import "./BasicCrowdsale.sol";

/**
 * @title BurnableCrowdsale
 * @dev 
 */
contract BurnableCrowdsale is BasicCrowdsale {
    event Burned(address _burner, address _burnedFrom, uint256 _burnAmount);

    /**
    * @dev 
    * @param
    */
    function burnTokens(uint256 _burnAmount) public onlyOwner {
        token.Burn(_burnAmount);
        emit Burned(msg.sender, address(this), _burnAmount);
    }
}