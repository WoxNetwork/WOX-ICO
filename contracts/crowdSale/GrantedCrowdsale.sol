pragma solidity ^0.4.23;

import "./BasicCrowdsale.sol";
import "./TierLine.sol";
import "../whitelist/whitelist.sol";

/**
 * @title GrantedCrowdsale
 * @dev 
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
    * @dev 
    * @param
    */
    function addToGrantees(address _grantee) public whitelistingAllowed onlyOwner {
        Grantees.add(_grantee);
    }

    /**
    * @dev 
    * @param
    */
    function removeFromGrantees(address _grantee) public whitelistingAllowed onlyOwner {
        Grantees.remove(_grantee);
    }

    /**
    * @dev 
    * @param
    */
    function whitelistedAsGrantee(address _grantee) public view returns (bool) {
        return Grantees.has(_grantee);
    }

    /**
    * @dev 
    * @param
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
    * @dev 
    * @param
    */
    modifier onlyGrantee(address _grantee) {
        require(whitelistedAsGrantee(_grantee));
        _;
    }

    /**
    * @dev 
    * @param
    */
    modifier onlyGrantTime() {
        require(hasOpened());
        require(!hasClosed());
        require(currentTier() != TierStates.preWhitelist);
        require(currentTier() != TierStates.preICO);
        _;
    }

}