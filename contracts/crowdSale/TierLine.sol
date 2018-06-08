pragma solidity ^0.4.23;

import "../Math/SafeMath.sol";

/**
 * @title TierLine
 * @dev 
 */
contract TierLine {
    using SafeMath for uint256;

    enum TierStates {preWhitelist, preICO, Whitelist, ICORound1, ICORound2, ICORound3, ICORound4}

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
     * @dev 
     * @param _state
     * @param _opening
     * @param _ending
     * @param _hardcapTokenWei
     * @param _tokenWeisPerEth
     * @param _purchaseAllowed
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
     * @dev 
     */
    function _tierIndex() internal view onlyWhileIsOpened onlyWhileNotClosed returns (uint256) {
        for (uint256 i = 0; i < Tiers.length; i++) {
            if (now >= Tiers[i].opening && now <= Tiers[i].ending) {
                return i;
            }
        }
    }

    /**
     * @dev 
     */
    function currentTier() public view returns (TierStates) {
        return Tiers[_tierIndex()].state;
    }

    /**
     * @dev 
     */
    function currentTierHardcap() public view returns (uint256) {
        return Tiers[_tierIndex()].hardcapTokenWei;
    }

    /**
     * @dev 
     */
    function currentTierTokenWeisPerEth() public view returns (uint256) {
        return Tiers[_tierIndex()].tokenWeisPerEth;
    }

    /**
     * @dev 
     */
    function currentSaleTokenWeiHardcap() public view returns (uint256) {
        uint256 hardcaptoken;
        for (uint256 i = 0; i <= _tierIndex(); i++) {
            hardcaptoken = hardcaptoken.add(Tiers[i].hardcapTokenWei);
        }
        return hardcaptoken;
    }

    /**
     * @dev 
     */
    function hasOpened() public view returns (bool) {
        return (now >= Tiers[0].opening);
    }

    /**
     * @dev 
     */
    function hasClosed() public view returns (bool) {
        return (now > Tiers[Tiers.length-1].ending);
    }

    /**
     * @dev 
     * @param _tier
     */
    modifier onlyAtTier(TierStates _tier) {
        require(currentTier() == _tier);
        _;
    }

    /**
     * @dev 
     */
    modifier onlyWhileIsOpened() {
        require(hasOpened());
        _;
    }

    /**
     * @dev 
     */
    modifier onlyWhileNotClosed() {
        require(!hasClosed());
        _;
    }

    /**
     * @dev 
     */
    modifier purchaseAllowed() {
        require(Tiers[_tierIndex()].purchaseAllowed);
        _;
    }

    /**
     * @dev 
     */
    modifier whitelistingAllowed() {
        require(
            Tiers[_tierIndex()].state == TierStates.preWhitelist ||
            Tiers[_tierIndex()].state == TierStates.Whitelist);
        _;
    }

}