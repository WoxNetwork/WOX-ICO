pragma solidity ^0.4.23;

import "../whitelist/whitelist.sol";
import "./TierLine.sol";
import "../ownership/Ownable.sol";

/**
 * @title WhtielistedVC
 * @dev WhtielistedVC is intended to manage VC Whitelisting process. It looks like
 * CRUD implementation.
 */
contract WhtielistedVC is TierLine, Ownable {
    using whitelist for whitelist.Whitelist;

    whitelist.Whitelist VC;

    /**
     * @dev Adds new VC to the whitelist. 
     * @param _vc Address of VC must be added to whitelist.
     * This action is allowed only in pre-Whitelist and Whitelist Rounds.
     */
    function addToVC(address _vc) public onlyOwner whitelistingAllowed {
        VC.add(_vc);
    }

    /**
     * @dev Removes new VC from whitelist.
     * @param _vc Address of VC must be removed from whitelist.
     * This action is allowed only in pre-Whitelist and Whitelist Rounds.
    */
    function removeFromVC(address _vc) public onlyOwner whitelistingAllowed {
        VC.remove(_vc);
    }

    /**
     * @dev Checks if a specified VC address has been insrted to VC Whitelist.
     * @param _vc The address of VC must be checked.
     * @return A bool showing the passed address is whitelisted before.
    */
    function whtielistedAsVC(address _vc) public view returns (bool){
        return VC.has(_vc);
    }

    /**
     * @dev A modifier requires a specified address is whitelisted as VC.
     * @param _vc The address of VC must be checked.
     */
    modifier onlyVC(address _vc) {
        require(whtielistedAsVC(_vc));
        _;
    }

}