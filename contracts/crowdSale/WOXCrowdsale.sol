pragma solidity ^0.4.23;

import "./BasicCrowdsale.sol";
import "./FinalizableCrowdsale.sol";
import "./GrantedCrowdsale.sol";
import "./RefundableCrowdsale.sol";
import "./ReferralCorwdsale.sol";
import "./tokenReceiver.sol";
import "./BurnableCrowdsale.sol";

/**
 * @title WOXCrowdsale
 * @dev 
 */
contract WOXCrowdsale is 
    BasicCrowdsale,
    FinalizableCrowdsale,
    GrantedCrowdsale,
    RefundableCrowdsale,
    ReferralCrowdsale,
    BurnableCrowdsale,
    tokenReceiver
{
    
    /**
    * @dev 
    * @param
    */
    constructor(
        uint256 _cliff,
        uint256 _USD_PER_ETH,
        address _wallet,
        address _tokenAddress
        ) 
        public 
    {
        require(_wallet != address(0));
        require(_tokenAddress != address(0));
        
        USD_PER_ETH = _USD_PER_ETH;
        wallet = _wallet;
        state = State.Active;
        isFinalized = false;
        
        token = woxToken(_tokenAddress);
        totalSupply = token.totalSupply();
        decimals = token.decimals();
        tokenName = token.name();
        tokenSymbol = token.symbol();

        softcapWei = uint256(3e6).mul(1 ether).div(USD_PER_ETH);
        MaxReferralTokens = uint256(30e6).mul(10 ** decimals);

        minVestingWeiPreICO = uint256(50e3).mul(1 ether).div(USD_PER_ETH);
        maxVestingWeiPreICO = uint256(1e6).mul(1 ether).div(USD_PER_ETH); //// ?????
        minVestingWeiICO = 0.1 ether;
        maxVestingWeiICO = 300 ether;

        uint256 _openingTime = now + _cliff;

        addTier(
            TierStates.preWhitelist,
            _openingTime, 
            _openingTime + 10 days, 
            0, 
            0,
            false);

        addTier(
            TierStates.preICO,
            Tiers[Tiers.length-1].ending, 
            Tiers[Tiers.length-1].ending + 30 days, 
            uint256(120e6).mul(10 ** 18), 
            uint256(USD_PER_ETH).mul(10 ** 18).mul(100).div(8),            
            true);

        addTier(
            TierStates.Whitelist,
            Tiers[Tiers.length-1].ending, 
            Tiers[Tiers.length-1].ending + 10 days, 
            0, 
            0, 
            false);

        addTier(
            TierStates.ICORound1,
            Tiers[Tiers.length-1].ending, 
            Tiers[Tiers.length-1].ending + 7 days, 
            uint256(125e6).mul(10 ** 18), 
            uint256(USD_PER_ETH).mul(10 ** 18).mul(100).div(12), 
            true);

        addTier(
            TierStates.ICORound2,
            Tiers[Tiers.length-1].ending, 
            Tiers[Tiers.length-1].ending + 7 days, 
            uint256(125e6).mul(10 ** 18), 
            uint256(USD_PER_ETH).mul(10 ** 18).mul(100).div(13), 
            true);

        addTier(
            TierStates.ICORound3,
            Tiers[Tiers.length-1].ending, 
            Tiers[Tiers.length-1].ending + 7 days, 
            uint256(125e6).mul(10 ** 18), 
            uint256(USD_PER_ETH).mul(10 ** 18).mul(100).div(14), 
            true);

        addTier(
            TierStates.ICORound4,
            Tiers[Tiers.length-1].ending, 
            Tiers[Tiers.length-1].ending + 7 days, 
            uint256(125e6).mul(10 ** 18), 
            uint256(USD_PER_ETH).mul(10 ** 18).mul(100).div(15), 
            true);
    }
}