const solc = require('solc');
const fs = require('fs');

const files = [
    './contracts/Token/ERC223/woxToken.sol',
    './contracts/Token/ERC223/contractReceiver.sol',
    './contracts/Token/ERC223/ERC223.sol',
    './contracts/Token/ERC223/StandardToken.sol',
    './contracts/Token/ERC223/BurnableToken.sol',
    './contracts/ownership/Ownable.sol',
    './contracts/Math/SafeMath.sol',
    './contracts/AddressUtils.sol'
]

let input = {};

files.map(s => {input[s] = fs.readFileSync(s, 'utf8')});

let output = solc.compile({sources : input}, 1);
// let abi = output.contracts['../contracts/Token/ERC223/woxToken.sol:woxToken'].interface
// let bytecode = output.contracts['../contracts/Token/ERC223/woxToken.sol:woxToken'].bytecode

module.exports = output.contracts['./contracts/Token/ERC223/woxToken.sol:woxToken']