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
    * @dev Initiates parameters of crowdsale.
    * @param _cliff determines the cliff time between contract deployment an ICO opening time.
    * @param _USD_PER_ETH USD to ETHER rate. (amount of USD per 1 ETHER).
    * @param _wallet Wallet address to which funds will be depositted to after goal reached.
    * @param _tokenAddress WOX Token contract address.
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
        
        /**
         * @dev Crowdsale Softcap is the minimum fund desired to be raised.
         * @param softacp Crowdsale softcap is 3 Millions of USD. If this amount of fund 
         * raises the goal is reached but the crowdsale will be running until
         * the end of ICO-4.
         * @param MaxRefferalTokens Only 30 Million Tokens are allowed to be paid as Refferals.
         */
        softcapWei = uint256(3e6).mul(1 ether).div(USD_PER_ETH);
        MaxReferralTokens = uint256(625e6).mul(10 ** decimals).mul(3).div(100);

        /**
         * @dev Investing limitations:
         * @param minVestingPreICO Minimum Investing rate at pre-ICO Tier 50K USD. 
         * Its equivallent ETHER value is computed and considered based on USD/ETH rate.
         * @param maxVestingPreICO ///////
         * @param minVestingICO Minimum Investing rate at pre-ICO Tier is 0.1 ETHER.
         * @param maxVestingICO Miaximum Investing rate at pre-ICO Tier is 300 ETHER.
         */
        minVestingWeiPreICO = uint256(50e3).mul(1 ether).div(USD_PER_ETH);
        maxVestingWeiPreICO = uint256(1e6).mul(1 ether).div(USD_PER_ETH); //// ?????
        minVestingWeiICO = 0.1 ether;
        maxVestingWeiICO = 300 ether;

        uint256 _openingTime = now + _cliff;

        /**
         * @dev Pre-Whitelist Tier will be running for 10 days since ICO opening.
         * Crowdsale Owner is supposed to insert VCs' address into VC Whitelist.
         * Token Purchase is not allowed during this Round.
         */
        addTier(
            TierStates.preWhitelist,
            _openingTime, 
            _openingTime + 10 days, 
            0, 
            0,
            false);

        /**
         * @dev Pre-ICO Tier will open immediately after per-Whitelist round finished and
         * will be running for 30 days. Token purchase is only allowed to whitelisted VCs.
         * The Hardcap of pre-ICO Tier is 120M tokens. The remaining tokens not sold at 
         * this round will be added to next rounds. Whitelisting is not allowed at this round.
         */
        addTier(
            TierStates.preICO,
            Tiers[Tiers.length-1].ending, 
            Tiers[Tiers.length-1].ending + 30 days, 
            uint256(120e6).mul(10 ** decimals), 
            uint256(USD_PER_ETH).mul(10 ** decimals).mul(100).div(8),            
            true);

        /**
         * @dev Whitelist Tier will open immediately after pre-ICO round finished and
         * will be running for 10 days. Token purchase is not allowed. ICO Owner will be able
         * to insert new VCs to VC Whitelist.
         */
        addTier(
            TierStates.Whitelist,
            Tiers[Tiers.length-1].ending, 
            Tiers[Tiers.length-1].ending + 10 days, 
            0, 
            0, 
            false);

        /**
         * @dev ICO-1 Tier will open immediately after Whitelist round finished and
         * will be running for 1 week. Token purchase is allowed for all participants.
         * The ICO-1 Hardcap is 125M tokens in addition to amount of tokens remained 
         * from previous rounds. The remaining tokens not sold at this round will be
         * added to next one. Whitelisting is not allowed at this tier.
         */
        addTier(
            TierStates.ICORound1,
            Tiers[Tiers.length-1].ending, 
            Tiers[Tiers.length-1].ending + 1 weeks, 
            uint256(125e6).mul(10 ** decimals), 
            uint256(USD_PER_ETH).mul(10 ** decimals).mul(100).div(12), 
            true);

        /**
         * @dev ICO-2 Tier will open immediately after ICO-1 round finished and
         * will be running for 1 week. Token purchase is allowed for all participants.
         * The ICO-2 Hardcap is 125M tokens in addition to amount of tokens remained 
         * from previous rounds. The remaining tokens not sold at this round will be
         * added to next one. Whitelisting is not allowed at this tier.
         */
        addTier(
            TierStates.ICORound2,
            Tiers[Tiers.length-1].ending, 
            Tiers[Tiers.length-1].ending + 1 weeks, 
            uint256(125e6).mul(10 ** decimals), 
            uint256(USD_PER_ETH).mul(10 ** decimals).mul(100).div(13), 
            true);

        /**
         * @dev ICO-3 Tier will open immediately after ICO-2 round finished and
         * will be running for 1 week. Token purchase is allowed for all participants.
         * The ICO-3 Hardcap is 125M tokens in addition to amount of tokens remained 
         * from previous rounds. The remaining tokens not sold at this round will be
         * added to next one. Whitelisting is not allowed at this tier.
         */
        addTier(
            TierStates.ICORound3,
            Tiers[Tiers.length-1].ending, 
            Tiers[Tiers.length-1].ending + 1 weeks, 
            uint256(125e6).mul(10 ** decimals), 
            uint256(USD_PER_ETH).mul(10 ** decimals).mul(100).div(14), 
            true);

        /**
         * @dev ICO-3 Tier will open immediately after ICO-2 round finished and
         * will be running for 1 week. Token purchase is allowed for all participants.
         * The ICO-3 Hardcap is 125M tokens in addition to amount of tokens remained 
         * from previous rounds. The remaining tokens not sold at this round will be
         * added to next one. Whitelisting is not allowed at this tier.
         */
        addTier(
            TierStates.ICORound4,
            Tiers[Tiers.length-1].ending, 
            Tiers[Tiers.length-1].ending + 1 weeks, 
            uint256(125e6).mul(10 ** decimals), 
            uint256(USD_PER_ETH).mul(10 ** decimals).mul(100).div(15), 
            true);
    }
}