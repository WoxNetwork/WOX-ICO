const solc = require('solc');
const fs = require('fs');

const file = './contracts/test/fallbackedReceiver.sol';

let input;

input = fs.readFileSync(file, 'utf8');

let output = solc.compile(input, 1);
// let abi = output.contracts[':fallbackedReceiver'].interface
// let bytecode = output.contracts[':fallbackedReceiver'].bytecode
// console.log(bytecode)

module.exports = output.contracts[':fallbackedReceiver']