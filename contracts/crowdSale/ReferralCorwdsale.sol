pragma solidity ^0.4.23;

import "./BasicCrowdsale.sol";

/**
 * @title ReferralCrowdsale
 * @dev 
 */
contract ReferralCrowdsale is BasicCrowdsale {

    uint256 public MaxReferralTokens;

    uint256 public referralTokens;
    
    mapping(address => uint256) referrals;

    event ReferralTokenPaid(address indexed sender, address indexed referre, uint256 amount);

    /**
    * @dev 
    * @param
    */
    function PayReferral(address _referrer, uint256 _amount) 
    public 
    onlyOwner 
    onlyWhileIsOpened
    onlyWhileNotClosed
    purchaseAllowed
    {
        require(_referrer != address(0));
        require(_amount != 0);
        require(referralTokens.add(_amount) <= MaxReferralTokens);
        referrals[_referrer] = referrals[_referrer].add(_amount);
        referralTokens = referralTokens.add(_amount);
        token.transfer(_referrer, _amount);
        emit ReferralTokenPaid(owner, _referrer, _amount);
    }

}