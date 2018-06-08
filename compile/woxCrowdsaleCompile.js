const solc = require('solc');
const fs = require('fs');

const files = [
    './contracts/test/WOXCrowdsaleTest.sol',
    './contracts/crowdSale/tokenReceiver.sol',
    './contracts/crowdSale/BasicCrowdsale.sol',
    './contracts/crowdSale/BurnableCrowdsale.sol',
    './contracts/crowdSale/FinalizableCrowdsale.sol',
    './contracts/crowdSale/ReferralCorwdsale.sol',
    './contracts/crowdSale/RefundableCrowdsale.sol',
    './contracts/crowdSale/WhitelistedVC.sol',
    './contracts/crowdSale/GrantedCrowdsale.sol',
    './contracts/crowdSale/TierLine.sol',
    './contracts/whitelist/whitelist.sol',
    './contracts/Token/ERC223/woxToken.sol',
    './contracts/Token/ERC223/contractReceiver.sol',
    './contracts/Token/ERC223/ERC223.sol',
    './contracts/Token/ERC223/StandardToken.sol',
    './contracts/Token/ERC223/BurnableToken.sol',
    './contracts/ownership/Ownable.sol',
    './contracts/Math/SafeMath.sol',
    './contracts/AddressUtils.sol',
]

let input = {};

files.map(s => {
    input[s] = fs.readFileSync(s, 'utf8')
});

let output = solc.compile({sources : input}, 1);
// let abi = output.contracts['./contracts/crowdSale/WOXCrowdsale.sol:WOXCrowdsale'].interface
// let bytecode = output.contracts['./contracts/crowdSale/WOXCrowdsale.sol:WOXCrowdsale'].bytecode

module.exports = output.contracts['./contracts/test/WOXCrowdsaleTest.sol:WOXCrowdsaleTest']