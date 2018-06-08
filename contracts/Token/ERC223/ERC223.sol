pragma solidity ^0.4.23;

/**
 *@title Standard ERC223 Token Interface.
 */
contract ERC223 {
    function balanceOf(address _who) public view returns (uint256);    
    function totalSupply() public view returns (uint256);

    function transfer(address _to, uint256 _value) public returns (bool);
    function transfer(address _to, uint256 _value, bytes _data) public returns (bool);
    function transfer(address _to, uint256 _value, bytes _data, string _custom_fallback) public returns (bool);
    
    function approve(address _spender, uint256 _value) public returns (bool);
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool);
    function transferFrom(address _from, address _to, uint256 _value, bytes _data) public returns (bool);
    function transferFrom(address _from, address _to, uint256 _value, bytes _data, string _custom_callback) public returns (bool);
    function allowance(address _owner, address _spender) public view returns (uint256);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}