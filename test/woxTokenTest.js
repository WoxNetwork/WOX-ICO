const Web3 = require('web3');
const assert = require('chai').assert
const woxTokenContract = require('../compile/woxTokenCompile');
const fallbackedContract = require('../compile/fallbackedReceiver');
const nonfallbackedContract = require('../compile/nonfallbackedReceiver');

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const name = 'WOX.Network';
const symbol = 'WOX';
const decimals = 18;
const totalSupply = web3.utils.toWei('1000000000', 'ether');

let woxAddress;
let fallbackAddress;
let nonfallbackAddress;

let woxOwner;
let fallbackOwner;
let nonfallbackOwner;
let user;
let gasEstimate;

let getFreeBalance = function(user, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            freeBalance = await woxToken.methods.getFreeBalance(user).call({from:user, gas:gasEstimate});
            resolve(freeBalance);
        }, timeout);
    })
}


describe('woxToken', function(done) {
    this.timeout(0)

    before(async () => {
        const accounts = await web3.eth.getAccounts();
        woxOwner = accounts[0];
        fallbackOwner = accounts[1];
        nonfallbackOwner = accounts[2];
        user = accounts[3];

        let gas = await web3.eth.estimateGas({data:fallbackedContract.bytecode});
        fallback = await new web3.eth.Contract(JSON.parse(fallbackedContract.interface))
                .deploy({data:fallbackedContract.bytecode})
                .send({from:fallbackOwner, gas:gas});
        
        gas = await web3.eth.estimateGas({data:nonfallbackedContract.bytecode});
        nonfallback = await new web3.eth.Contract(JSON.parse(nonfallbackedContract.interface))
                .deploy({data:nonfallbackedContract.bytecode})
                .send({from:nonfallbackOwner, gas:gas});

        fallbackAddress = fallback.options.address;
        nonfallbackAddress = nonfallback.options.address;
    })

    beforeEach(async () => {
        gasEstimate = await web3.eth.estimateGas({data:woxTokenContract.bytecode});
        woxToken = await new web3.eth.Contract(JSON.parse(woxTokenContract.interface))
            .deploy({ data: woxTokenContract.bytecode })
            .send({ from: woxOwner, gas: gasEstimate });

        woxAddress = woxToken.options.address;
    });

    it('Checks Contract is deployed', () => {
        assert.ok(woxToken.options.address)
    });

    it('Checks Token Name', async () => {
        const name_ = await woxToken.methods.name().call()
        assert.equal(name, name_)
    })

    it('Checks Token Symbol', async () => {
        const symbol_ = await woxToken.methods.symbol().call()
        assert.equal(symbol, symbol_)
    })

    it('Checks Token decimals', async () => {
        const decimals_ = await woxToken.methods.decimals().call()
        assert.equal(decimals, decimals_)
    })

    it('Checks Token totalSupply', async () => {
        const totalSupply_ = await woxToken.methods.totalSupply().call()
        assert.equal(totalSupply, totalSupply_)
    })

    it('Checks Balance of Token Owner', async () => {
        const balance = await woxToken.methods.balanceOf(woxOwner).call()
        assert.equal(web3.utils.fromWei(balance, 'ether'), 1e9)
    })

    it('Checks Free balance of Contract Owner', async () => {
        const freeAmount = await woxToken.methods.getFreeBalance(woxOwner).call()
        assert.equal(totalSupply, freeAmount)
    })

    // Transfer
    it('Should Transfer tokens from Owner to User, emits empty data', async () => {
        const amount = web3.utils.toWei('1000', 'ether')

        await woxToken.methods.transfer(user, amount).send({from:woxOwner, gas:gasEstimate})
        const userBalance = await woxToken.methods.balanceOf(user).call()
        assert.equal(amount, userBalance);
        
        const ownerBalance = await woxToken.methods.balanceOf(woxOwner).call()
        assert.equal(totalSupply-amount, ownerBalance);
    })

    it('Should Transfer tokens from Owner to User, emits specified data', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const data = web3.utils.asciiToHex("random text");

        await woxToken.methods.transfer(user, amount, data).send({from:woxOwner, gas:gasEstimate})
        const userBalance = await woxToken.methods.balanceOf(user).call({from:user, gas:gasEstimate})
        assert.equal(amount, userBalance);
        
        const ownerBalance = await woxToken.methods.balanceOf(woxOwner).call({from:woxOwner, gas:gasEstimate})
        assert.equal(totalSupply-amount, ownerBalance);
    })

    it('Should Revert on transfering tokens from User to Owner', async () => {
        var revert;
        const amount = web3.utils.toWei('1000', 'ether')
        try { await woxToken.methods.transfer(woxOwner, amount).send({from:user, gas:gasEstimate}) } 
        catch(error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const userBalance = await woxToken.methods.balanceOf(user).call()
        assert.equal(0, userBalance);
        
        const ownerBalance = await woxToken.methods.balanceOf(woxOwner).call()
        assert.equal(totalSupply, ownerBalance);
    })

    it('Should Revert on transfering tokens and data from User to Owner', async () => {
        var revert;
        const amount = web3.utils.toWei('1000', 'ether');
        const data = web3.utils.asciiToHex("random text");
        
        try { await woxToken.methods.transfer(woxOwner, amount, data).send({from:user, gas:gasEstimate}) } 
        catch(error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const userBalance = await woxToken.methods.balanceOf(user).call()
        assert.equal(0, userBalance);
        
        const ownerBalance = await woxToken.methods.balanceOf(woxOwner).call()
        assert.equal(totalSupply, ownerBalance);
    })

    it('Should Transfer tokens from Owner to Contract, emits specified data', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const data = web3.utils.asciiToHex("random text");

        await woxToken.methods
        .transfer(fallbackAddress, amount, data).send({from:woxOwner, gas:gasEstimate})
        
        const userBalance = await woxToken.methods.balanceOf(fallbackAddress).call()
        assert.equal(amount, userBalance);

        let ownerBalance = await woxToken.methods.balanceOf(woxOwner).call()
        assert.equal(totalSupply-amount, ownerBalance);
    })

    it('Should Transfer tokens from Owner to Contract passing tokenFallback, emits specified data', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const data = web3.utils.asciiToHex("random text");

        await woxToken.methods
        .transfer(fallbackAddress, amount, data, 'tokenFallback(address,uint256,bytes)')
        .send({from:woxOwner, gas:gasEstimate})
        
        const userBalance = await woxToken.methods.balanceOf(fallbackAddress).call()
        assert.equal(amount, userBalance);

        let ownerBalance = await woxToken.methods.balanceOf(woxOwner).call()
        assert.equal(totalSupply-amount, ownerBalance);
    })

    it('Should Transfer tokens from user to Contract, emits specified data', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const data = web3.utils.asciiToHex("random text");

        try { await woxToken.methods.transfer(fallbackAddress, amount, data).send({from:user, gas:gasEstimate}) } 
        catch(error) { revert = error.message.includes('revert') }
        assert.isOk(revert);

        const contractBalance = await woxToken.methods.balanceOf(fallbackAddress).call()
        assert.equal(0, contractBalance);

        let userBalance = await woxToken.methods.balanceOf(user).call()
        assert.equal(0, userBalance);
    })

    // TransferFrom
    it('Should Transfer Approveed tokens from owner to user, emits empty data', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        await woxToken.methods.approve(user, amount).send({from:woxOwner, gas:gasEstimate});
        await woxToken.methods.transferFrom(woxOwner, user, amount).send({from:user, gas:gasEstimate})
        const userBalance = await woxToken.methods.balanceOf(user).call()
        assert.equal(amount, userBalance);
    })

    it('Should Transfer Approveed tokens from owner to user, emits specified data', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const data = web3.utils.asciiToHex("random text");
        await woxToken.methods.approve(user, amount).send({from:woxOwner, gas:gasEstimate});
        await woxToken.methods.transferFrom(woxOwner, user, amount, data).send({from:user, gas:gasEstimate})
        const userBalance = await woxToken.methods.balanceOf(user).call()
        assert.equal(amount, userBalance);
    })

    it('Should Transfer Approved Tokens from owner to contract, emits empty data', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const data = web3.utils.asciiToHex("random text");

        await woxToken.methods.approve(user, amount).send({from: woxOwner, gas: gasEstimate});

        await woxToken.methods
        .transferFrom(woxOwner, fallbackAddress, amount)
        .send({from:user, gas:gasEstimate})

        const userBalance = await woxToken.methods.balanceOf(fallbackAddress).call()
        assert.equal(amount, userBalance);

        let ownerBalance = await woxToken.methods.balanceOf(woxOwner).call()
        assert.equal(totalSupply-amount, ownerBalance);
    })

    it('Should Transfer Approved Tokens from owner to contract, emits specified data', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const data = web3.utils.asciiToHex("random text");

        await woxToken.methods.approve(user, amount).send({from: woxOwner, gas: gasEstimate});

        await woxToken.methods
        .transferFrom(woxOwner, fallbackAddress, amount, data)
        .send({from:user, gas:gasEstimate})

        const userBalance = await woxToken.methods.balanceOf(fallbackAddress).call()
        assert.equal(amount, userBalance);

        let ownerBalance = await woxToken.methods.balanceOf(woxOwner).call()
        assert.equal(totalSupply-amount, ownerBalance);
    })

    it('Should Transfer Approved Tokens from owner to contract passing tokenFallback, emits specified data', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const data = web3.utils.asciiToHex("random text");

        await woxToken.methods.approve(user, amount).send({from: woxOwner, gas: gasEstimate});

        await woxToken.methods
        .transferFrom(woxOwner, fallbackAddress, amount, data, 'tokenFallback(address,uint256,bytes)')
        .send({from:user, gas:gasEstimate})

        const userBalance = await woxToken.methods.balanceOf(fallbackAddress).call()
        assert.equal(amount, userBalance);

        let ownerBalance = await woxToken.methods.balanceOf(woxOwner).call()
        assert.equal(totalSupply-amount, ownerBalance);
    })

    it('Should Revert on Transfering tokens from user (0 blanceed) to owner', async () => {
        var revert;
        const amount = web3.utils.toWei('1000', 'ether');
        await woxToken.methods.approve(woxOwner, amount).send({from:user, gas:gasEstimate});
        try { await woxToken.methods.transferFrom(user, woxOwner, amount).send({from:woxOwner, gas:gasEstimate}) } 
        catch(error) { revert = error.message.includes('revert') }
        assert.isOk(revert)
    })

    // Approve
    it('Should Approve Tokens from owner to user', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        await woxToken.methods.approve(user, amount).send({from:woxOwner, gas:gasEstimate});
        const approval = await woxToken.methods.allowance(woxOwner, user).call({from:0, gas:gasEstimate});
        assert.equal(amount, approval);
    })

    it('Should Approve Tokens from user to owner', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        await woxToken.methods.approve(woxOwner, amount).send({from:user, gas:gasEstimate});
        const approval = await woxToken.methods.allowance(user, woxOwner).call();
        assert.equal(amount, approval);
    })

    it('Should Increase Approval Tokens from owner to user', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const increase = web3.utils.toWei('500', 'ether');
        const expected = web3.utils.toWei('1500', 'ether');
        await woxToken.methods.approve(user, amount).send({from:woxOwner, gas:gasEstimate});
        await woxToken.methods.increaseApproval(user, increase).send({from:woxOwner, gas:gasEstimate});
        const approval = await woxToken.methods.allowance(woxOwner, user).call();
        assert.equal(expected, approval);
    })

    it('Should Decrease Approval Tokens from owner to user', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const decrease = web3.utils.toWei('500', 'ether');
        const expected = web3.utils.toWei('500', 'ether');
        await woxToken.methods.approve(user, amount).send({from:woxOwner, gas:gasEstimate});
        await woxToken.methods.decreaseApproval(user, decrease).send({from:woxOwner, gas:gasEstimate});
        const approval = await woxToken.methods.allowance(woxOwner, user).call();
        assert.equal(expected, approval);
    })

    it('Should Decrease total Approval Tokens from owner to user', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const decrease = web3.utils.toWei('1500', 'ether');
        await woxToken.methods.approve(user, amount).send({from:woxOwner, gas:gasEstimate});
        await woxToken.methods.decreaseApproval(user, amount).send({from:woxOwner, gas:gasEstimate});
        const approval = await woxToken.methods.allowance(woxOwner, user).call();
        assert.equal(0, approval);
    })

    it('Should Approve Tokens from owner to contract', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        await woxToken.methods.approve(fallbackAddress, amount).send({from:woxOwner, gas:gasEstimate});
        const approval = await woxToken.methods.allowance(woxOwner, fallbackAddress).call();
        assert.equal(amount, approval);
    })

    it('Should Increase Approval Tokens from owner to contract', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const increase = web3.utils.toWei('500', 'ether');
        const expected = web3.utils.toWei('1500', 'ether');
        await woxToken.methods.approve(fallbackAddress, amount).send({from:woxOwner, gas:gasEstimate});
        await woxToken.methods.increaseApproval(fallbackAddress, increase).send({from:woxOwner, gas:gasEstimate});
        const approval = await woxToken.methods.allowance(woxOwner, fallbackAddress).call();
        assert.equal(expected, approval);
    })

    it('Should Decrease Approval Tokens from owner to contract', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const decrease = web3.utils.toWei('500', 'ether');
        const expected = web3.utils.toWei('500', 'ether');
        await woxToken.methods.approve(fallbackAddress, amount).send({from:woxOwner, gas:gasEstimate});
        await woxToken.methods.decreaseApproval(fallbackAddress, decrease).send({from:woxOwner, gas:gasEstimate});
        const approval = await woxToken.methods.allowance(woxOwner, fallbackAddress).call();
        assert.equal(expected, approval);
    })

    it('Should Decrease total Approval Tokens from owner to contract', async () => {
        const amount = web3.utils.toWei('1000', 'ether');
        const decrease = web3.utils.toWei('1500', 'ether');
        await woxToken.methods.approve(fallbackAddress, amount).send({from:woxOwner, gas:gasEstimate});
        await woxToken.methods.decreaseApproval(fallbackAddress, amount).send({from:woxOwner, gas:gasEstimate});
        const approval = await woxToken.methods.allowance(woxOwner, fallbackAddress).call();
        assert.equal(0, approval);
    })

    it('Should Transfer Locked Tokens from Owner to user', async () => {
        const block = await web3.eth.getBlock('latest')
        const _now = block.timestamp
        const _until = _now + 10;
        const amount = web3.utils.toWei('6754', 'ether');

        await woxToken.methods.transferLockedAmount(user, amount, _until).send({from:woxOwner, gas:gasEstimate})
        const userBalance = await woxToken.methods.balanceOf(user).call()
        assert.equal(amount, userBalance);

        const freedBalance = await woxToken.methods.getFreeBalance(user).call()
        assert.equal(0, freedBalance)
    })

    it('Should prohibts any transfering Locked Tokens', async () => {
        const block = await web3.eth.getBlock('latest')
        const _now = block.timestamp
        const _until = _now + 10;
        const amount = web3.utils.toWei('6754', 'ether');

        await woxToken.methods.transferLockedAmount(user, amount, _until).send({from:woxOwner, gas:gasEstimate})
        let userBalance = await woxToken.methods.balanceOf(user).call()
        assert.equal(amount, userBalance);

        var revert;
        try { await woxToken.methods.transfer(woxOwner, amount).send({from:user, gas:gasEstimate}) }
        catch(error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        userBalance = await woxToken.methods.balanceOf(user).call({from:0, gas:gasEstimate})
        assert.equal(amount, userBalance);
        const ownerBalance = await woxToken.methods.balanceOf(woxOwner).call({from:0, gas:gasEstimate})
        assert.equal(totalSupply-amount, ownerBalance);
    })

    it('Should Transfers unlocked Tokens', async () => {
        const block = await web3.eth.getBlock('latest')
        const _now = block.timestamp
        const _until = _now + 5;
        const amount = web3.utils.toWei('1000', 'ether');

        await woxToken.methods.transferLockedAmount(user, amount, _until).send({from:woxOwner, gas:gasEstimate})
        const freeBalance = await getFreeBalance(user, 10000)
        assert.equal(amount, freeBalance)

        await woxToken.methods.transfer(woxOwner, amount).send({from:user, gas:gasEstimate});
        userBalance = await woxToken.methods.balanceOf(user).call()
        assert.equal(0, userBalance);
        const ownerBalance = await woxToken.methods.balanceOf(woxOwner).call()
        assert.equal(totalSupply, ownerBalance);
    })

    it('Should Burn some Tokens from owner and reduces total supply', async () => {
        const burnAmount = web3.utils.toWei('50000000', 'ether');
        await woxToken.methods.Burn(burnAmount).send({from:woxOwner, gas:gasEstimate});
        const ownerBalance = await woxToken.methods.balanceOf(woxOwner).call();
        const totalSupply_ = await woxToken.methods.totalSupply().call()
        
        assert.equal(totalSupply-burnAmount, ownerBalance)
        assert.equal(totalSupply-burnAmount, totalSupply_)
    })

})

