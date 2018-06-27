pragma solidity ^0.4.23;

import "./BasicCrowdsale.sol";
import "./TierLine.sol";
import "../whitelist/whitelist.sol";

/**
 * @title GrantedCrowdsale
 * @dev GrantedCrowdsale inherits BasicCrowdsale and intended to manage whitelist process
 * od Grantees and funding them.
 */
contract GrantedCrowdsale is BasicCrowdsale {
    using whitelist for whitelist.Whitelist;

    uint256 public grantHardcapToken;
    uint256 public grantHardcapTokenPerEach;

    whitelist.Whitelist Grantees;

    uint256 public grantedTokens;
    mapping(address => uint256) granted;

    event TokenGranted(address indexed sender, address indexed grantee, uint256 amount);

    /**
     * @dev Adds a new Grantee to the whitelist.
     * @param _grantee Address of grantee must be added into whitelist.
     * This action is only allowed in pre-Whitelist and Whitelist Tiers.
     */
    function addToGrantees(address _grantee) public whitelistingAllowed onlyOwner {
        Grantees.add(_grantee);
    }

    /**
     * @dev Removes a passed granteed address from whitelist.
     * @param _grantee Address of grantee must be removed from whitelist.
     * This action is allowed only in pre-Whitelist and Whitelist Rounds.
     */
    function removeFromGrantees(address _grantee) public whitelistingAllowed onlyOwner {
        Grantees.remove(_grantee);
    }

    /**
     * @dev Checks if a specified address is whitelisted as grantee.
     * @param _grantee Address must be evaluated whether has been whitelisted or not.
     * @return A bool showing the passed Address is whitelisted or not.
     */
    function whitelistedAsGrantee(address _grantee) public view returns (bool) {
        return Grantees.has(_grantee);
    }

    /**
     * @dev Grants an amount of tokens to a passed whitelisted grantee.
     * @param _grantee The address of a whitelisted grnatee supposed to be granted.
     * @param _tokenAmount The amount of tokens must be granted.
     * @dev note This action is allowed in Grant Time.
     * @dev note Only whitelisted Grantee could be granted.
     * @dev note Only the ICO Owner is allowed to grant tokens.
     * @dev note Tokens are transfered in locked mode i.e tokens would be freed after a specified period of time.
     * @dev note 30% of granted tokens would be freed after crowdsale is ended.
     * @dev note 70% of granted tokens would be freed 365 days after ending date of the crowdsale.
     */
    function grantTokens(address _grantee, uint256 _tokenAmount)
    public
    onlyOwner
    onlyGrantTime
    onlyGrantee(_grantee) 
    {
        require(_grantee != address(0));
        require(_tokenAmount != 0);
        // require(granted[_grantee].add(_tokenAmount) <= grantHardcapTokenPerEach); //// commented as grantHardcapTokenPerEach not defined
        require(grantedTokens.add(_tokenAmount).add(tokenWeisSold) <= totalSupply);
        
        granted[_grantee] = granted[_grantee].add(_tokenAmount);
        grantedTokens = grantedTokens.add(_tokenAmount);

        token.transferLockedAmount(_grantee, _tokenAmount.mul(3).div(10), Tiers[Tiers.length-1].ending);
        token.transferLockedAmount(_grantee, _tokenAmount.mul(7).div(10), Tiers[Tiers.length-1].ending + (365 days));
        emit TokenGranted(msg.sender, _grantee, _tokenAmount);
    }

    /**
     * @dev A modifier requires a specified address is whitelisted as grantee.
     * @param _grantee The address of Grantee must be checked.
     */
    modifier onlyGrantee(address _grantee) {
        require(whitelistedAsGrantee(_grantee));
        _;
    }

    /**
     * @dev A modifier requires an action to be measured in Grant Time i.e. 
     * immediately after pre-ICO round is ended, but before the ending od ICO corwdsale.
     */
    modifier onlyGrantTime() {
        require(hasOpened());
        require(!hasClosed());
        require(currentTier() != TierStates.preWhitelist);
        require(currentTier() != TierStates.preICO);
        _;
    }

}