pragma solidity ^0.4.23;

import "../Math/SafeMath.sol";

/**
 * @title TierLine
 * @dev TierLine contract intended to manage ICO Rounds with a set of specified parameters.
 * @author h.namazian
 */
contract TierLine {
    using SafeMath for uint256;

    enum TierStates {preWhitelist, preICO, Whitelist, ICORound1, ICORound2, ICORound3, ICORound4}

    /**
     *@dev Tier structure specifies main parameters of each ICO round.
     *@param state defines the ICO round.
     *@param opening Time from which this round stats.
     *@parma ending Time at which this round ends.
     *@param hardcapTokenWei Maximum number of tokens (showed in all decimals) could be sold at this round.
     *@param tokenWeisPerEtc Number of tokens (showed in all decimals) could be purchased in return for 1 ETH.
     *@param purchaseAllowed Specifies whether token purchase is allowed at this ICO round.
     */
    struct Tier {
        TierStates state;
        uint256 opening;
        uint256 ending;
        uint256 hardcapTokenWei;
        uint256 tokenWeisPerEth;
        bool purchaseAllowed;
    }
    Tier[] Tiers;

    /**
     * @dev Adds a new ICO round to the arrays of Tiers with a set of passed parameters.
     *@param state defines the ICO round.
     *@param opening Time from which this round stats.
     *@parma ending Time at which this round ends.
     *@param hardcapTokenWei Maximum number of tokens (showed in all decimals) could be sold at this round.
     *@param tokenWeisPerEtc Number of tokens (showed in all decimals) could be purchased in return for 1 ETH.
     *@param purchaseAllowed Specifies whether token purchase is allowed at this ICO round.
     */
    function addTier(
        TierStates _state,
        uint256 _opening, 
        uint256 _ending, 
        uint256 _hardcapTokenWei, 
        uint256 _tokenWeisPerEth,
        bool _purchaseAllowed)
    internal
    { 
        require(_ending > _opening);
        if (Tiers.length > 0) {
            require(_opening >= Tiers[Tiers.length-1].ending);
        }
        
        Tier memory newTier;
        newTier.state = _state;
        newTier.opening = _opening;
        newTier.ending = _ending;
        newTier.hardcapTokenWei = _hardcapTokenWei;
        newTier.tokenWeisPerEth = _tokenWeisPerEth;
        newTier.purchaseAllowed = _purchaseAllowed;
        Tiers.push(newTier);
    }

    /**
     * @dev Internal function returns the Index of ICO round running at this moment.
     */
    function _tierIndex() internal view onlyWhileIsOpened onlyWhileNotClosed returns (uint256) {
        for (uint256 i = 0; i < Tiers.length; i++) {
            if (now >= Tiers[i].opening && now <= Tiers[i].ending) {
                return i;
            }
        }
    }

    /**
     * @dev Returns the current ICO round with repect to TierStates Enum.
     */
    function currentTier() public view returns (TierStates) {
        return Tiers[_tierIndex()].state;
    }

    /**
     * @dev Returns maximum number of purchasable tokens assigned to the ICO round running at the moment.
     * @return A uint256 specifying total number of purchasable tokens assigned to this ICO round.
     */
    function currentTierHardcap() public view returns (uint256) {
        return Tiers[_tierIndex()].hardcapTokenWei;
    }

    /**
     * @dev Returns number of purchasable tokens assigned to the ICO round running at the moment in addition to 
     * remaining tokens not being sold in previous rounds.
     * @return A uint256 specifying total number of purcahsable tokens could be sold by the end of this ICO round.
     */
    function currentSaleTokenWeiHardcap() public view returns (uint256) {
        uint256 hardcaptoken;
        for (uint256 i = 0; i <= _tierIndex(); i++) {
            hardcaptoken = hardcaptoken.add(Tiers[i].hardcapTokenWei);
        }
        return hardcaptoken;
    }

    /**
     * @dev Returns number of tokens could be sold in return for 1 ETH.
     * @return A uint256 number of tokens in return for 1 ETH.
     */
    function currentTierTokenWeisPerEth() public view returns (uint256) {
        return Tiers[_tierIndex()].tokenWeisPerEth;
    }

    /**
     * @dev Requires the crowdsale has already been opened.
     */
    function hasOpened() public view returns (bool) {
        return (now >= Tiers[0].opening);
    }

    /**
     * @dev Requires the crowdsale has been already closed.
     */
    function hasClosed() public view returns (bool) {
        return (now > Tiers[Tiers.length-1].ending);
    }

    /**
     * @dev A modifier requiring the ICO is running at the specified round.
     * @param _tier Specifies an ICO round.
     */
    modifier onlyAtTier(TierStates _tier) {
        require(currentTier() == _tier);
        _;
    }

    /**
     * @dev A modifier requiring the crowdsale has already been opened.
     */
    modifier onlyWhileIsOpened() {
        require(hasOpened());
        _;
    }

    /**
     * @dev A modifier requiring the crowdsale has not yet been closed.
     */
    modifier onlyWhileNotClosed() {
        require(!hasClosed());
        _;
    }

    /**
     * @dev A modifier requiring token purchase is allowed at the moment.
     */
    modifier purchaseAllowed() {
        require(Tiers[_tierIndex()].purchaseAllowed);
        _;
    }

    /**
     * @dev A modifier requiring whitelisting process is allowed at the moment.
     */
    modifier whitelistingAllowed() {
        require(
            Tiers[_tierIndex()].state == TierStates.preWhitelist ||
            Tiers[_tierIndex()].state == TierStates.Whitelist);
        _;
    }

}