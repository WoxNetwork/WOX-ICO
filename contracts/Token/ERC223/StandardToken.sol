pragma solidity ^0.4.23;

import "./ERC223.sol";
import "../../Math/SafeMath.sol";
import "../../AddressUtils.sol";
import "./contractReceiver.sol";
import "../../ownership/Ownable.sol";

/**
 * @title Standard ERC223 Token
 * @dev Implementation of basic ERC223 token
 * @dev Developed based on code by Dexaran https://github.com/Dexaran/ERC223-token-standard/tree/Recommended#erc23-token-standard
 */
contract StandardToken is ERC223, Ownable {
    using SafeMath for uint256;
    using AddressUtils for address;

    string public name;
    string public symbol;
    uint256 public decimals;
    uint256 public totalSupply;

    mapping (address => uint256) balances;
    mapping (address => mapping(address => uint256)) allowed;

    /**
     * @dev Returns Token name.
     */
    function name() public view returns (string) {
        return name;
    }

    /**
     * @dev Returns Token Symbol.
     */
    function symbol() public view returns (string) {
        return symbol;
    }

    /**
     * @dev Returns number of decimals is used to show tokens.
     */
    function decimals() public view returns (uint256) {
        return decimals;
    }

    /**
     * @dev Returns total number of tokens.
     */
    function totalSupply() public view returns (uint256) {
        return totalSupply;
    }

    /**
     * @dev Returns number of tokens owned by the specified address.
     * @param _owner The address to query the balance of.
     * @return An uin256 representing balance of passed address.
     */
    function balanceOf(address _owner) public view returns(uint256) {
        return balances[_owner];
    }

    /**
     * @dev Transfer a number of tokens from message sender address to a specified address.
     * @param _to The address which tokens should be transfered to.
     * @param _value Number of tokens should be transfered.
     * @return A bool that shows success or failure of process.
     */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value != 0);
        require(_value <= balances[msg.sender]);

        bytes memory empty;
        if(_to.isContract()) {
            return _transferToContract(msg.sender, _to, _value, empty);
        } else {
            return _transferToAddress(msg.sender, _to, _value);
        }
    }

    /**
     * @dev Transfer a number of tokens from message sender address to a specified address.
     * @param _to The address which tokens should be transfered to.
     * @param _value Number of tokens should be transfered.
     * @param _data Specified data should be sent to the address.
     * @return A bool that shows success or failure of process.
     */
    function transfer(address _to, uint256 _value, bytes _data) public returns (bool) {
        require(_to != address(0));
        require(_value != 0);
        require(_value <= balances[msg.sender]);

        if(_to.isContract()) {
            return _transferToContract(msg.sender, _to, _value, _data);
        } else {
            return _transferToAddress(msg.sender, _to, _value);
        }
    }

    /**
     * @dev Transfer a number of tokens from message sender address to a specified address.
     * @param _to The address which tokens should be transfered to.
     * @param _value Number of tokens should be transfered.
     * @param _data Specified data should be sent to the address.
     * @param _custom_fallback Receiver Contract fallback function interface must be called to inform the transaction.
     * @return A bool that shows success or failure of process.
     */
    function transfer(address _to, uint256 _value, bytes _data, string _custom_fallback) public returns (bool) {
        require(_to != address(0));
        require(_value != 0);
        require(_value <= balances[msg.sender]);

        if(_to.isContract()) {
            balances[msg.sender] = balances[msg.sender].sub(_value);
            balances[_to] = balances[_to].add(_value);
            assert(_to.call.gas(2300).value(0)(bytes4(keccak256(_custom_fallback)), msg.sender, _value, _data));
            emit Transfer(msg.sender, _to, _value);
            return true;
        }
        else {
            return _transferToAddress(msg.sender, _to, _value);
        }
    }

    /**
     * @dev Approves the passed address to spend a specified number of tokens on behalf of msg.sender.
     * @param _spender Address approved to spend the funds.
     * @param _value Number of tokens approveed to be spent.
     * @return A bool that shows success or failure of process.
     */
    function approve(address _spender, uint256 _value) public returns (bool) {
        require(_spender != address(0));
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    /**
     * @dev Transfers tokens from one address to another.
     * @param _from The address will send tokens.
     * @param _to The addrss will receive tokens.
     * @param _value Number of tokens will be transfered.
     * @return A bool that shows success or failure of process.
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value != 0);
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);
        
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);

        bytes memory empty;
        if (_to.isContract()) {
            return _transferToContract(_from, _to, _value, empty);
        } else {

            return _transferToAddress(_from, _to, _value);
        }
    }

    /**
     * @dev Transfers tokens from one address to another.
     * @param _from The address will send tokens.
     * @param _to The addrss will receive tokens.
     * @param _value Number of tokens will be transfered.
     * @param _data Specified data should be sent to the address.
     * @return A bool that shows success or failure of process.
     */
    function transferFrom(address _from, address _to, uint256 _value, bytes _data) public returns (bool) {
        require(_to != address(0));
        require(_value != 0);
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);

        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);

        if (_to.isContract()) {
            return _transferToContract(_from, _to, _value, _data);
        } else {
            return _transferToAddress(_from, _to, _value);
        }
    }

    /**
     * @dev Transfers tokens from one address to another.
     * @param _from The address will send tokens.
     * @param _to The addrss will receive tokens.
     * @param _value Number of tokens will be transfered.
     * @param _data Specified data should be sent to the address.
     * @param _custom_fallback Receiver Contract fallback function interface must be called to inform the transaction.
     * @return A bool that shows success or failure of process.
     */
    function transferFrom(address _from, address _to, uint256 _value, bytes _data, string _custom_fallback) public returns (bool) {
        require(_to != address(0));
        require(_value != 0);
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);

        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);

        if(_to.isContract()) {
            balances[_from] = balances[_from].sub(_value);
            balances[_to] = balances[_to].add(_value);
            assert(_to.call.gas(2300).value(0)(bytes4(keccak256(_custom_fallback)), msg.sender, _value, _data));
            emit Transfer(_from, _to, _value);
            return true;
        }
        else {
            return _transferToAddress(_from, _to, _value);
        }
    }

    /**
     * @dev Retuens number of tokens approved by an address to another.
     * @param _owner The address owns the funds.
     * @param _spender The address which will spend the funds.
     * @return An uint256 specifying remaining number of tokens can be spent.
     */
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowed[_owner][_spender];
    }

    /**
     * @dev Increases number of tokens approved by msg.sender to spender address.
     * @param _spender Address approved to spend the funds.
     * @param _addedValue Number of tokens to increase allowance.
     * @return A bool that shows success or failure of process.
     */
    function increaseApproval(address _spender, uint256 _addedValue) public returns (bool) {
        require(_spender != address(0));
        allowed[msg.sender][_spender] = allowed[msg.sender][_spender].add(_addedValue);
        emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
        return true;
    }

    /**
     * @dev Decreases number of tokens approved by msg.sender to spender address.
     * @param _spender Address approved to spend the funds.
     * @param _subtractedValue Number of tokens to decrease allowance.
     * @return A bool that shows success or failure of process.
     */
    function decreaseApproval(address _spender, uint256 _subtractedValue) public returns (bool) {
        require(_spender != address(0));
        uint256 oldValue = allowed[msg.sender][_spender];
        if (oldValue <= _subtractedValue) {
            allowed[msg.sender][_spender] = 0;
        } else {
            allowed[msg.sender][_spender] = allowed[msg.sender][_spender].sub(_subtractedValue);
        }
        emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
        return true;
    }

    /**
     * @dev Internal function which transfers tokens from and address to an EOA (Externally Owned Account).
     * @param _from The address will send tokens.
     * @param _to The addrss will receive tokens.
     * @param _value Number of tokens will be transfered.
     * @return A bool that shows success or failure of process.
     */
    function _transferToAddress(address _from, address _to, uint256 _value) internal returns (bool) {
        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }

    /**
     * @dev Internal function which transfers tokens from and address to an contract address.
     * @dev The contract must contain tokenFallback funciton which will be called to inform the transaction.
     * @param _from The address will send tokens.
     * @param _to The addrss will receive tokens.
     * @param _value Number of tokens will be transfered.
     * @param _data Specified data should be sent to the address.
     * @return A bool that shows success or failure of process.
     */
    function _transferToContract(address _from, address _to, uint256 _value, bytes _data) internal returns (bool) {
        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        contractReceiver receiver = contractReceiver(_to);
        receiver.tokenFallback(_from, _value, _data);
        emit Transfer(_from, _to, _value);
        return true;
    }
}