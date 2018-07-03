pragma solidity ^0.4.23;

import "../ownership/Ownable.sol";
import "../Math/SafeMath.sol";
import "../Math/Math.sol";

contract pricing is Ownable {
    using SafeMath for uint256;
    using Math for uint256;

    struct Rate {
        uint256 rate;
        uint256 updatedDate;
    }

    Rate[] public ethRates;
    Rate public updatedRate;

    function insertNewEthRate(uint256 _ethRate) public onlyOwner {
        Rate memory newRate = Rate({rate: _ethRate, updatedDate: now});

        Rate memory lastUpdatedRate = (ethRates.length >= 1) ? 
            lastUpdatedRate = ethRates[ethRates.length-1] : 
            Rate(0,0);

        if ((now - lastUpdatedRate.updatedDate) < 1 days) {
            ethRates[ethRates.length-1] = newRate;
        } else {
            ethRates.push(newRate);
        }

        updateEthRate();
    }

    function updateEthRate() internal {
        uint256 lastIndex = ethRates.length-1;
        uint256 sum;
        uint256 count;
        
        for (uint256 i = 0; i <= Math.min256(2, lastIndex); i--) {
            if (now - ethRates[i].updatedDate < 3 days) {
                sum = sum.add(ethRates[lastIndex-i].rate);
                count = count.add(1);
            }
        }

        if (sum > 0) {
            updatedRate.rate = sum;
            updatedRate.updatedDate = now;
        }
    }

    function getUpdatedEthRate() public view returns (uint256) {
        return (updatedRate.rate);
    }

}