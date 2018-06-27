pragma solidity ^0.4.23;

import "../Token/ERC223/woxToken.sol";
import "../Math/SafeMath.sol";
import "./WhitelistedVC.sol";

/**
 * @title BasicCrowdsale
 * @dev BasicCrowdsale is the base contract of managing woxTeoken crowdsale,
 * allowing investors purchasing tokens with ether.  This contract implements
 * such functionality in its most fundamental form and can be extended to provide additional
 * functionality and/or custom behavior.
 * This code is developed based on OpenZeppelin Crowdsale code: 
 * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/crowdsale/Crowdsale.sol
 */
contract BasicCrowdsale is WhtielistedVC {
    using SafeMath for uint256;

    woxToken public token;

    address public wallet;

    uint256 internal softcapWei;

    uint256 public totalSupply;
    uint256 public decimals;
    string public tokenName;
    string public tokenSymbol;

    uint256 minVestingWeiPreICO;
    uint256 maxVestingWeiPreICO;
    uint256 minVestingWeiICO;
    uint256 maxVestingWeiICO;

    uint256 internal USD_PER_ETH;
 
    uint256 public weiRaised;
    mapping(address => uint256) depositedWei;

    uint256 public tokenWeisSold;

    event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    /**
     * @dev low level token purchase.
     * @param _beneficiary Address performs token purchase with ether. 
     * Note: Token purchase only allowed while ICO is running in pre-ICO and ICO rounds.
     */
    function buyTokens(address _beneficiary) 
    public 
    payable
    onlyWhileIsOpened
    onlyWhileNotClosed
    purchaseAllowed
    returns (uint256)
    {
        uint256 weiAmount = msg.value;
        uint256 tokenWeis = _getTokenAmount(weiAmount);

        _preValidatePurchase(_beneficiary, weiAmount, tokenWeis);

        _updatePurchasingState(_beneficiary, weiAmount, tokenWeis);

        _processPurchase(_beneficiary, tokenWeis);

        emit TokenPurchase(msg.sender, _beneficiary, weiAmount, tokenWeis);
    }

    /**
     * @dev Requirements for validation of token purchase.
     * Note: At each round of ICO crowdsale only a limitted amount of tokens could be sold.
     * Note: Each purchaser must buy a minimum and can buy a maximum amount of tokens.
     * Note: Mentioned limitations depends on that round of ICO.
     * Note: Only whitelisted VCs can purchase tokens in pre-ICO round.
     * Note: Will revert on violation of required conditions.
     * @param _beneficiary Address performing token purchase. 
     * @param _weiAmount Value in wei paid for token purchase.
     * @param _tokenAmount Number of tokens will be sold to purchase.
     */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount, uint256 _tokenAmount) internal view {
        require(_beneficiary != address(0));
        require(_weiAmount != 0);
        require(tokenWeisSold.add(_tokenAmount) <= currentSaleTokenWeiHardcap());
        require(depositedWei[_beneficiary].add(_weiAmount) >= minVestingWei());
        require(depositedWei[_beneficiary].add(_weiAmount) <= maxVestingWei());
        if (currentTier() == TierStates.preICO) {
            require(whtielistedAsVC(_beneficiary));
        }
    }

    /**
     * @dev Executes a validated token purchase.
     * @param _beneficiary Address performing token purchase. 
     * @param _tokenAmount Number of tokens will be sold to purchase.
     */
    function _processPurchase(address _beneficiary, uint256 _tokenAmount) internal {
        token.transfer(_beneficiary, _tokenAmount);
    }

    /**
     * @dev Updates relevant pusrchase states:
     * Total number of tokens sold,
     * Total amount of Wies raised,
     * Total amount of Weis depositted by the passed address.
     * @param _beneficiary Address performing token purchase. 
     * @param _weiAmount Value in wei paid for token purchase.
     * @param _tokenAmount Number of tokens will be sold to purchase.
     */
    function _updatePurchasingState(address _beneficiary, uint256 _weiAmount, uint256 _tokenAmount) internal {
        depositedWei[_beneficiary] = depositedWei[_beneficiary].add(_weiAmount);
        tokenWeisSold = tokenWeisSold.add(_tokenAmount);
        weiRaised = weiRaised.add(_weiAmount);
    }

    /**
     * @dev Returns minimum amount of weis must be depositted by each purchaser at each ICO round.
     * Note: Will revert on calling the function in rounds which puchase is not allowed.
     * @return A uint256 specifying minimum value of wei must be depositted.
     */
    function minVestingWei() public view onlyWhileIsOpened onlyWhileNotClosed purchaseAllowed returns (uint256) {
        if (currentTier() == TierStates.preICO) {
            return minVestingWeiPreICO;
        } else {
            return minVestingWeiICO;
        }
    }

    /**
     * @dev Returns maximum amount of weis could be depositted by each purchaser at each ICO round.
     * Note: Will revert on calling the function in rounds which puchase is not allowed.
     * @return A uint256 specifying maximum value of wei could be depositted.
     */
    function maxVestingWei() public view onlyWhileIsOpened onlyWhileNotClosed purchaseAllowed returns (uint256) {
        if (currentTier() == TierStates.preICO) {
            return maxVestingWeiPreICO;
        } else {
            return maxVestingWeiICO;
        }
    }

    /**
     * @dev Returns number of tokens could be purchased with respect to a specified amiunt of weis.
     * @param _weiAmount An amount wei to be converted into number of tokens.
     * @return A uint256 specifying number of tokens could be purchased with the specified _weiAmount.
     */
    function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
        uint256 _tokeWeisPerEth = currentTierTokenWeisPerEth();
        return _weiAmount.mul(_tokeWeisPerEth).div(10 ** decimals);
    }

    /**
     * @dev Returns total value depositted in weis.
     * @return A uint256 specifying depositted values in wei.
     */
    function getWeiRaised() public view returns(uint256) {
        return weiRaised;
    }

    /**
     * @dev Transfer a specified amount of values depositted in wei to passed address.
     * Note: Only the contract owner can withdraw values.
     * @param _wallet The address to which a specified amount of depositted values must be transfered.
     * @param _weiAmount Amount values in wei must be withdrawn.
    */
    function withdraw(address _wallet, uint256 _weiAmount) onlyOwner {
        require(_wallet != address(0));
        require(_weiAmount != 0);
        require(_weiAmount <= weiRaised);
        _wallet.transfer(_weiAmount);
    }
}
