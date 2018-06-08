pragma solidity ^0.4.23;

import "./StandardToken.sol";

/**
 * @title BurnableToken
 * @dev Token that can be irreversibly burned (destroyed).
 */
contract BurnableToken is StandardToken {

    event Burned(address burner, uint256 burnAmount);

    /**
     * @dev Burns a specified number of tokens owned by ms.sender.
     * @param _burnAmount Number of tokens to be burnt.
     */
    function Burn(uint256 _burnAmount) public {
        require(_burnAmount <= totalSupply);
        require(_burnAmount <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(_burnAmount);
        totalSupply = totalSupply.sub(_burnAmount);
        emit Burned(msg.sender, _burnAmount);
    }
}