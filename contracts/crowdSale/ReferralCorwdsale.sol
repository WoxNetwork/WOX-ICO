pragma solidity ^0.4.23;

import "./BasicCrowdsale.sol";

/**
 * @title ReferralCrowdsale
 * @dev ReferralCrowdsale inherrits BasicCrowdsale and intended to manage payment Referrals to Referrers.
 */
contract ReferralCrowdsale is BasicCrowdsale {

    uint256 public MaxReferralTokens;

    uint256 public referralTokens;
    
    mapping(address => uint256) referrals;

    event ReferralTokenPaid(address indexed sender, address indexed referre, uint256 amount);

    /**
    * @dev Transfers an amount of tokens to a referrer address.
    * @param _referrer Addreess to which Referrals are supposed to be paid.
    * @param _amount Number of tokens must be paid to a specified referrer as Referral.
    * @note Only owner is allowed to pay Referrals.
    * @note Only while ICO is running, except both whitelisting Rounds, Referral process is allowed.
    * @note Only 30 Million Tokens are allowed to be paid as Refferals.
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