pragma solidity ^0.4.23;

import "./BasicCrowdsale.sol";

/**
 * @title BurnableCrowdsale
 * @dev BurnableCrowdsale inherits BasicCrowdsale and is intended to manage burning tokens.
 */
contract BurnableCrowdsale is BasicCrowdsale {
    event Burned(address _burner, address _burnedFrom, uint256 _burnAmount);

    /**
     * @dev Burns an amount of tokens only by owner. Reduces total amount of tokens
     * and the balances of msg.sender i.e owner.
     * @param _burnAmount Amount tokens supposed to be burnt.
     * @dev note Only owner is allowed to burn tokens.
     */
    function burnTokens(uint256 _burnAmount) public onlyOwner {
        token.Burn(_burnAmount);
        emit Burned(msg.sender, address(this), _burnAmount);
    }
}