pragma solidity ^0.4.23;

import "./BurnableToken.sol";
import "../../ownership/Heritable.sol";

/**
 * @title woxToken contract
 * @dev woxToken is an ERC223 Token compatible with ERC20 Tokens.
 */
contract woxToken is BurnableToken, Heritable {
    constructor() public {
        name = "WOX.Network";
        symbol = "WOX";
        decimals = 18;
        totalSupply = 1e9 * 10 ** decimals;
        balances[owner] = totalSupply;
    }
    
    struct Lock {
        uint256 amount;
        uint256 until;
        bool isLocked;
    }
    mapping(address => Lock[]) Locks;

    /**
     * @dev Transfers a specified number of tokens from msg.sender balance to a specified address 
     * @dev And locks these tokens so as not to be spent by receiver until lock time expires.
     * @param _to Address to which tokens will be transfered.
     * @param _amount Number of tokens to be transfered.
     * @param _until Due time the tokens are locked.
     * @return A bool that shows success or failure of process.
     */
    function transferLockedAmount(address _to, uint256 _amount, uint256 _until) 
    public returns (bool) {
        require(_to != address(0));
        require(_amount > 0);
        require(_amount <= balances[msg.sender]);
        
        Lock memory newLock;
        newLock.amount = _amount;
        newLock.until = _until;
        newLock.isLocked = true;
        Locks[_to].push(newLock);

        return transfer(_to, _amount);
    }

    /**
     * @dev Transfers a specified number of tokens from msg.sender balance to a specified address 
     * @dev And locks these tokens so as not to be spent by receiver until lock time expires.
     * @param _to Address to which tokens will be transfered.
     * @param _amount Number of tokens to be transfered.
     * @param _until Due time the tokens are locked.
     * @param _data Specified data should be sent to the address.
     * @return A bool that shows success or failure of process.
     */
    function transferLockedAmount(address _to, uint256 _amount, uint256 _until, bytes _data) 
    public returns (bool) {
        require(_to != address(0));
        require(_amount > 0);
        require(_amount <= balances[msg.sender]);
        
        Lock memory newLock;
        newLock.amount = _amount;
        newLock.until = _until;
        newLock.isLocked = true;
        Locks[_to].push(newLock);

        return transfer(_to, _amount, _data);
    }

    /**
     * @dev Transfers a specified number of tokens from msg.sender balance to a specified address 
     * @dev And locks these tokens so as not to be spent by receiver until lock time expires.
     * @param _to Address to which tokens will be transfered.
     * @param _amount Number of tokens to be transfered.
     * @param _until Due time the tokens are locked.
     * @param _data Specified data should be sent to the address.
     * @param _custom_fallback Receiver Contract fallback function interface must be called to inform the transaction.
     * @return A bool that shows success or failure of process.
     */
    function transferLockedAmount(address _to, uint256 _amount, uint256 _until, bytes _data, string _custom_fallback) 
    public returns (bool) {
        require(_to != address(0));
        require(_amount > 0);
        require(_amount <= balances[msg.sender]);
        
        Lock memory newLock;
        newLock.amount = _amount;
        newLock.until = _until;
        newLock.isLocked = true;
        Locks[_to].push(newLock);

        if(_to.isContract()) {
            balances[msg.sender] = balances[msg.sender].sub(_amount);
            balances[_to] = balances[_to].add(_amount);
            assert(_to.call.gas(2300).value(0)(_custom_fallback, msg.sender, _amount, _data));
            emit Transfer(msg.sender, _to, _amount);
            return true;
        }
        else {
            return _transferToAddress(msg.sender, _to, _amount);
        }
    }

    /**
     * @dev Returns the freed number of tokens owned by an address at this moment.
     * @param _address The address whose freed balance must be returned.
     * @return A uint256 specifying freed balacne of passed address.
     */
    function getFreeBalance(address _address) public view returns (uint256) {
        Lock[] memory AllLocks = Locks[_address];
        uint256 lockedBalance = 0;
        for (uint256 i = 0; i < AllLocks.length; i++) {
            if (AllLocks[i].until > now && AllLocks[i].isLocked == true) {
                lockedBalance = lockedBalance.add(AllLocks[i].amount);
            }
        }
        assert(balances[_address].sub(lockedBalance) >= 0);
        return balances[_address].sub(lockedBalance);
    }

    /**
     * @dev Overrides parent by transfering tokens of freed balance.
     * @param _to The address which tokens should be transfered to.
     * @param _value Number of tokens should be transfered.
     * @return A bool that shows success or failure of process.
     */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value <= getFreeBalance(msg.sender));
        super.transfer(_to, _value);
    }

    /**
     * @dev Overrides parent by transfering tokens of freed balance.
     * @param _to The address which tokens should be transfered to.
     * @param _value Number of tokens should be transfered.
     * @param _data Specified data should be sent to the address.
     * @return A bool that shows success or failure of process.
     */
    function transfer(address _to, uint256 _value, bytes _data) public returns (bool) {
        require(_value <= getFreeBalance(msg.sender));
        super.transfer(_to, _value, _data);
    }

    /**
     * @dev Overrides parent by transfering tokens of freed balance.
     * @param _to The address which tokens should be transfered to.
     * @param _value Number of tokens should be transfered.
     * @param _data Specified data should be sent to the address.
     * @param _custom_fallback Receiver Contract fallback function interface must be called to inform the transaction.
     * @return A bool that shows success or failure of process.
     */
    function transfer(address _to, uint256 _value, bytes _data, string _custom_fallback) public returns (bool) {
        require(_value <= getFreeBalance(msg.sender));
        super.transfer(_to, _value, _data, _custom_fallback);
    }

    /**
     * @dev Overrides parent by transfering tokens of freed balance.
     * @param _from The address will send tokens.
     * @param _to The address which tokens should be transfered to.
     * @param _value Number of tokens should be transfered.
     * @return A bool that shows success or failure of process.
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_value <= getFreeBalance(_from));
        super.transferFrom(_from, _to, _value);
    }

    /**
     * @dev Overrides parent by transfering tokens of freed balance.
     * @param _from The address will send tokens.
     * @param _to The address which tokens should be transfered to.
     * @param _value Number of tokens should be transfered.
     * @param _data Specified data should be sent to the address.
     * @return A bool that shows success or failure of process.
     */
    function transferFrom(address _from, address _to, uint256 _value, bytes _data) public returns (bool) {
        require(_value <= getFreeBalance(_from));
        super.transferFrom(_from, _to, _value, _data);
    }

    /**
     * @dev Overrides parent by transfering tokens of freed balance.
     * @param _from The address will send tokens.
     * @param _to The address which tokens should be transfered to.
     * @param _value Number of tokens should be transfered.
     * @param _data Specified data should be sent to the address.
     * @param _custom_fallback Receiver Contract fallback function interface must be called to inform the transaction.
     * @return A bool that shows success or failure of process.
     */
    function transferFrom(address _from, address _to, uint256 _value, bytes _data, string _custom_fallback) public returns (bool) {
        require(_value <= getFreeBalance(_from));
        super.transferFrom(_from, _to, _value, _data, _custom_fallback);
    }

}