const solc = require('solc');
const fs = require('fs');

const file = './contracts/test/nonfallbackedReceiver.sol';

let input;

input = fs.readFileSync(file, 'utf8');

let output = solc.compile(input, 1);
// let abi = output.contracts[':nonfallbackedReceiver'].interface
// let bytecode = output.contracts[':nonfallbackedReceiver'].bytecode
// console.log(bytecode)

module.exports = output.contracts[':nonfallbackedReceiver']