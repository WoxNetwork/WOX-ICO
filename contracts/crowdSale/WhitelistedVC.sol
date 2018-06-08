pragma solidity ^0.4.23;

import "../whitelist/whitelist.sol";
import "./TierLine.sol";
import "../ownership/Ownable.sol";

/**
 * @title WhtielistedVC
 * @dev 
 */
contract WhtielistedVC is TierLine, Ownable {
    using whitelist for whitelist.Whitelist;

    whitelist.Whitelist VC;

    /**
    * @dev 
    * @param
    */
    function addToVC(address _vc) public onlyOwner whitelistingAllowed {
        VC.add(_vc);
    }

    /**
    * @dev 
    * @param
    */
    function removeFromVC(address _vc) public onlyOwner whitelistingAllowed {
        VC.remove(_vc);
    }

    /**
    * @dev 
    * @param
    */
    function whtielistedAsVC(address _vc) public view returns (bool){
        return VC.has(_vc);
    }

    /**
    * @dev 
    * @param
    */
    modifier onlyVC(address _vc) {
        require(whtielistedAsVC(_vc));
        _;
    }

}