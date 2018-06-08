const Web3 = require('web3');
const assert = require('chai').assert
const woxCrowdsaleContract = require('../compile/woxCrowdsaleCompile');
const woxTokenContract = require('../compile/woxTokenCompile');

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

var owner;
var grantee1;
var grantee2
var VC1;
var VC2;
var referrer;
var user;
var user2;

var gas;

var woxTokenAddress;
var woxCrowdsaleAddress;

var tier;

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}

function itRunsPreSaleTest() {
    it('Cliff: Contrats are deployed', async () => {
        assert.isOk(woxTokenAddress);
        assert.isOk(woxCrowdsaleAddress);
    })

    it('Cliff: Should Check ICO is not Opened and not Closed', async () => {
        const opened = await woxCrowdsale.methods.hasOpened().call()
        const closed = await woxCrowdsale.methods.hasClosed().call()
        assert.isNotOk(opened)
        assert.isNotOk(closed)
    })

    it('Cliff: Should transfer Tokens to crowdsale contract', async () => {
        const tokens = web3.utils.toWei('650000000', 'ether');
        const data = web3.utils.asciiToHex('random text');
        await woxToken.methods.transfer(woxCrowdsaleAddress, tokens, data).send({ from: owner, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(woxCrowdsaleAddress).call();
        assert.equal(tokens, balance);
    })

    it('Cliff: Should Burn Tokens from crowdsale balance', async () => {
        var BN = web3.utils.BN;

        const burnedTokens = web3.utils.toWei('150000000', 'ether');
        const totalSupply = await woxToken.methods.totalSupply().call();
        const initBalance = await woxToken.methods.balanceOf(woxCrowdsaleAddress).call();
        const expectedSupply = new BN(totalSupply).sub(new BN(burnedTokens));
        const expectedBalance = new BN(initBalance).sub(new BN(burnedTokens));

        await woxCrowdsale.methods.burnTokens(burnedTokens).send({ from: owner, gas: 3000000 });
        const supply = await woxToken.methods.totalSupply().call();
        const balance = await woxToken.methods.balanceOf(woxCrowdsaleAddress).call();

        assert.equal(expectedBalance, balance);
        assert.equal(expectedSupply, supply);
    })

    it('Cliff: Should Revert on getting Tier Hardcap', async () => {
        var revert;
        try { await woxCrowdsale.methods.currentTierHardcap().call() }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Cliff: Should Revert on getting Sale Hardcap', async () => {
        var revert;
        try { await woxCrowdsale.methods.currentSaleTokenWeiHardcap().call() }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Cliff: Should Revert on getting Number of Tokens Per Ether', async () => {
        var revert;
        try { await woxCrowdsale.methods.currentTierTokenWeisPerEth().call() }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Cliff: Should Revert on getting Current Tier', async () => {
        var revert;
        try { tier = await woxCrowdsale.methods.currentTier().call() }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Cliff: Should Revert on getting min investing', async () => {
        var revert;
        try { await woxCrowdsale.methods.minVestingWei().call() }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Cliff: Should Revert on getting min investing', async () => {
        var revert;
        try { await woxCrowdsale.methods.maxVestingWei().call() }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Cliff: Should Revert on getting goal reached', async () => {
        const goalReached = await woxCrowdsale.methods.goalReached().call();
        assert.isNotOk(goalReached);
    })

    it('Cliff: Should Revert on Finalizing ICO', async () => {
        var revert;
        try { await woxCrowdsale.methods.finalize().send({ from: owner, gaa: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Cliff: Should Revert on adding to VC', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(owner).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Cliff: Should Revert on adding to Grantee', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(owner).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Cliff: Should Revert on payment to referrer', async () => {
        var revert;
        try { await woxCrowdsale.methods.PayReferral(user, 1).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Cliff: Should Revert on buying tokens', async () => {
        var revert;
        try { await woxCrowdsale.methods.buyTokens(user).send({ from: owner, value: web3.utils.toWei('1', 'ether'), gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Cliff: Should Revert on refund', async () => {
        var revert;
        try { await woxCrowdsale.methods.refund(user).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })
}

function itRunspreWhitelistTest() {
    it('preWhitelist: Checks ICO is Opened and not Closed', async () => {
        const opened = await woxCrowdsale.methods.hasOpened().call()
        const closed = await woxCrowdsale.methods.hasClosed().call()
        assert.isOk(opened)
        assert.isNotOk(closed)
    })

    it('preWhitelist: Should Return 0 on getting Tier Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentTierHardcap().call();
        assert.equal(0, hardcap);
    })

    it('preWhitelist: Should Return 0 on getting Sale Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentSaleTokenWeiHardcap().call();
        assert.equal(0, hardcap);
    })

    it('preWhitelist: Should Return 0 on getting Number of Tokens Per Ether', async () => {
        const tokensPerEth = await woxCrowdsale.methods.currentTierTokenWeisPerEth().call();
        assert.equal(0, tokensPerEth);
    })

    it('preWhitelist: Should Return 0 on getting Current Tier', async () => {
        const tier = await woxCrowdsale.methods.currentTier().call();
        assert.equal(0, tier);
    })

    it('preWhitelist: Should Revert on getting min investing', async () => {
        var revert;
        try { await woxCrowdsale.methods.minVestingWei().call() }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('preWhitelist: Should Revert on getting max investing', async () => {
        var revert;
        try { await woxCrowdsale.methods.maxVestingWei().call(); }
        catch (error) { revert = error.message.includes('revert'); }
        assert.isOk(revert);
    })

    it('preWhitelist: Should return False on getting goal reached', async () => {
        const goalReached = await woxCrowdsale.methods.goalReached().call();
        assert.isNotOk(goalReached);
    })

    it('preWhitelist: Should Revert on Finalizing ICO', async () => {
        var revert;
        try { await woxCrowdsale.methods.finalize().send({ from: owner, gaa: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        assert.isOk(revert);
    })

    it('preWhitelist: Should add VC1 to VC whitelist by owner', async () => {
        await woxCrowdsale.methods.addToVC(VC1).send({ from: owner, gas: 3000000 });
        const checked = await woxCrowdsale.methods.whtielistedAsVC(VC1).call();
        assert.isOk(checked)
    })

    it('preWhitelist: Should Revert on adding VC2 to VC whitelist by others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(VC2).send({ from: VC2, gas: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        const checked = await woxCrowdsale.methods.whtielistedAsVC(VC2).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('preWhitelist: Should remove added user from VC whitelist by owner', async () => {
        await woxCrowdsale.methods.addToVC(user).send({ from: owner, gas: 3000000 });
        var checked = await woxCrowdsale.methods.whtielistedAsVC(user).call();
        assert.isOk(checked);

        await woxCrowdsale.methods.removeFromVC(user).send({ from: owner, gas: 3000000 });
        checked = await woxCrowdsale.methods.whtielistedAsVC(user).call();
        assert.isNotOk(checked);
    })

    it('preWhitelist: Should Revert on removing added user from VC whitelist by others', async () => {
        await woxCrowdsale.methods.addToVC(VC1).send({ from: owner, gas: 3000000 });
        var checked = await woxCrowdsale.methods.whtielistedAsVC(VC1).call();
        assert.isOk(checked);

        var revert;
        try { await woxCrowdsale.methods.addToVC(VC1).send({ from: user, gas: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        checked = await woxCrowdsale.methods.whtielistedAsVC(VC1).call();
        assert.isOk(revert);
        assert.isOk(checked);
    })

    it('preWhitelist: Should add grantee1 to Grantee whitelist by owner', async () => {
        await woxCrowdsale.methods.addToGrantees(grantee1).send({ from: owner, gas: 3000000 });
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked)
    })

    it('preWhitelist: Should remove added grantee2 from Grantee whitelist by owner', async () => {
        await woxCrowdsale.methods.addToGrantees(grantee2).send({ from: owner, gas: 3000000 });
        var checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee2).call();
        assert.isOk(checked);

        await woxCrowdsale.methods.removeFromGrantees(grantee2).send({ from: owner, gas: 3000000 });
        checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee2).call();
        assert.isNotOk(checked);
    })

    it('preWhitelist: Should Revert on adding user to Grantee whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('preWhitelist: Should Revert on removing added grantee1 from Grantee whitelist by others', async () => {
        var revert;
        await woxCrowdsale.methods.addToGrantees(grantee1).send({ from: owner, gas: 3000000 });
        try { await woxCrowdsale.methods.removeFromGrantees(grantee1).send({ from: user, gas: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(revert);
        assert.isOk(checked);
    })

    it('preWhitelist: Should Revert on granting tokens', async () => {
        var revert;

        await woxCrowdsale.methods.addToGrantees(grantee1).send({ from: owner, gas: 3000000 });
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked);

        try { await woxCrowdsale.methods.grantTokens(grantee1, web3.utils.toWei('1', 'ether')).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);

        const balance = await woxToken.methods.balanceOf(grantee1).call();
        assert.equal(0, balance);
    })

    it('preWhitelist: Should Revert on refunding', async () => {
        var revert;
        try { await woxCrowdsale.methods.refund(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('preWhitelist: Should Revert on payment to referrer', async () => {
        var revert;
        try { await woxCrowdsale.methods.PayReferral(user, 1).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('preWhitelist: Should Revert on buying tokens', async () => {
        var revert;
        const value = web3.utils.toWei('20', 'ether');
        try { await woxCrowdsale.methods.buyTokens(user).send({ from: user, value: value, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('preWhitelist: Should Revert on buying tokens by VCs', async () => {
        var revert;
        const value = web3.utils.toWei('20', 'ether');
        try { await woxCrowdsale.methods.buyTokens(VC1).send({ from: VC1, value: value, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })
}

function itRunsPreICOTest() {
    it('preICO: Checks ICO is Opened and not Closed', async () => {
        const opened = await woxCrowdsale.methods.hasOpened().call()
        const closed = await woxCrowdsale.methods.hasClosed().call()
        assert.isOk(opened)
        assert.isNotOk(closed)
    })

    it('preICO: Checks ICO is Opened and not Closed', async () => {
        const opened = await woxCrowdsale.methods.hasOpened().call()
        const closed = await woxCrowdsale.methods.hasClosed().call()
        assert.isOk(opened)
        assert.isNotOk(closed)
    })

    it('preICO: Should Return 120000000 on getting Tier Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentTierHardcap().call();
        assert.equal(web3.utils.toWei('120000000', 'ether'), hardcap);
    })

    it('preICO: Should Return 120000000 on getting Sale Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentSaleTokenWeiHardcap().call();
        assert.equal(web3.utils.toWei('120000000', 'ether'), hardcap);
    })

    it('preICO: Should Return 34125 on getting Number of Tokens Per Ether', async () => {
        const tokensPerEth = await woxCrowdsale.methods.currentTierTokenWeisPerEth().call();
        assert.equal(web3.utils.toWei('34125', 'ether'), tokensPerEth);
    })

    it('preICO: Should Return 1 on getting Current Tier', async () => {
        const tier = await woxCrowdsale.methods.currentTier().call();
        assert.equal(1, tier);
    })

    it('preICO: Should get min investing', async () => {
        var BN = web3.utils.BN;
        const expected = new BN(web3.utils.toWei('50000', 'ether')).div(new BN('2730'))
        const minVesting = await woxCrowdsale.methods.minVestingWei().call();
        assert.equal(expected.toString(), minVesting)
    })

    it('preICO: Should get max investing', async () => {
        var BN = web3.utils.BN;
        const expected = new BN(web3.utils.toWei('500000', 'ether')).div(new BN('2730'))
        const maxVesting = await woxCrowdsale.methods.maxVestingWei().call();
        assert.equal(expected.toString(), maxVesting)
    })

    it('preICO: Should return False on getting goal reached', async () => {
        const goalReached = await woxCrowdsale.methods.goalReached().call();
        assert.isNotOk(goalReached);
    })

    it('preICO: Should Revert on Finalizing ICO', async () => {
        var revert;
        try { await woxCrowdsale.methods.finalize().send({ from: owner, gaa: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        assert.isOk(revert);
    })

    it('preICO: Should Revert on adding user to VC whitelist by owner', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(user).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whtielistedAsVC(user).call()
        assert.isOk(revert)
        assert.isNotOk(checked)
    })

    it('preICO: Should Revert on adding VC1 to VC whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whtielistedAsVC(user).call()
        assert.isOk(revert)
        assert.isNotOk(checked)
    })

    it('preICO: Should Revert on adding user to Grantee by owner', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(user).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('preICO: Should Revert on adding user to Grantee whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('preICO: Should Revert on granting tokens to grantee1 by owner', async () => {
        var BN = web3.utils.BN;

        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked);

        const initBalance = await woxToken.methods.balanceOf(grantee1).call();

        const grant = web3.utils.toWei('1000000', 'ether');
        var revert;
        try { await woxCrowdsale.methods.grantTokens(grantee1, grant).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const balance = await woxToken.methods.balanceOf(grantee1).call();
        assert.equal(initBalance, balance);
    })

    it('preICO: Should Revert on granting tokens to grantee1 by others', async () => {
        var BN = web3.utils.BN;

        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked);

        const initBalance = await woxToken.methods.balanceOf(grantee1).call();

        const grant = web3.utils.toWei('1000000', 'ether');
        var revert;
        try { await woxCrowdsale.methods.grantTokens(grantee1, grant).send({ from: grantee1, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const balance = await woxToken.methods.balanceOf(grantee1).call();
        assert.equal(initBalance, balance);
    })

    it('preICO: Should Pay to referrer by owner', async () => {
        var BN = web3.utils.BN;

        var initBalance = await woxToken.methods.balanceOf(referrer).call();
        const tokens = web3.utils.toWei('1', 'ether');
        const expected = new BN(initBalance).add(new BN(tokens));

        await woxCrowdsale.methods.PayReferral(referrer, tokens).send({ from: owner, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(referrer).call();

        assert.equal(expected.toString(), (new BN(balance)).toString());

    })

    it('preICO: Should Revert on Paying to referrer by others', async () => {
        var initBalance = await woxToken.methods.balanceOf(referrer).call();
        const tokens = web3.utils.toWei('1', 'ether');

        var revert;
        try { await woxCrowdsale.methods.PayReferral(referrer, tokens).send({ from: referrer, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const balance = await woxToken.methods.balanceOf(referrer).call();
        assert.equal(initBalance, balance);

    })

    it('preICO: Should Revert on buying tokens by publics', async () => {
        const initBalance = await woxToken.methods.balanceOf(user).call();

        const value = web3.utils.toWei('1', 'ether');
        var revert;
        try { await woxCrowdsale.methods.buyTokens(user).send({ from: user, value: value, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);

        const balance = await woxToken.methods.balanceOf(user).call();
        assert.equal(initBalance, balance);
    })

    it('preICO: Should Revert on buying less than 50K USD (18.32 ETH) by VCs', async () => {
        const initBalance = await woxToken.methods.balanceOf(user).call();

        const value = web3.utils.toWei('18.31', 'ether');
        var revert;
        try { await woxCrowdsale.methods.buyTokens(VC1).send({ from: VC1, value: value, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);

        const balance = await woxToken.methods.balanceOf(VC1).call();
        assert.equal(initBalance, balance);
    })

    it('preICO: Should buy token by Whitelisted VCs', async () => {
        var BN = web3.utils.BN;

        const value = web3.utils.toWei('18.32', 'ether');
        const initBalance = await woxToken.methods.balanceOf(VC1).call();
        const tokens = web3.utils.toWei((18.32 * 2730 / 0.08).toString(), 'ether');
        const expected = new BN(initBalance).add(new BN(tokens));

        await woxCrowdsale.methods.buyTokens(VC1).send({ from: VC1, value: value, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(VC1).call();
        assert.equal(expected.toString(), (new BN(balance)).toString());
    })

    it('preICO: Should Revert on refunding', async () => {
        var revert;
        try { await woxCrowdsale.methods.refund(user).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })
}

function itRunsWhitelistTest() {
    it('Whitelist: Checks ICO is Opened and not Closed', async () => {
        const opened = await woxCrowdsale.methods.hasOpened().call()
        const closed = await woxCrowdsale.methods.hasClosed().call()
        assert.isOk(opened)
        assert.isNotOk(closed)
    })

    it('Whitelist: Should Return 0 on getting Tier Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentTierHardcap().call();
        assert.equal(0, hardcap);
    })

    it('Whitelist: Should Return 120000000 on getting Sale Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentSaleTokenWeiHardcap().call();
        assert.equal(web3.utils.toWei('120000000', 'ether'), hardcap);
    })

    it('Whitelist: Should Return 0 on getting Number of Tokens Per Ether', async () => {
        const tokensPerEth = await woxCrowdsale.methods.currentTierTokenWeisPerEth().call();
        assert.equal(0, tokensPerEth);
    })

    it('Whitelist: Should Return 2 on getting Current Tier', async () => {
        const tier = await woxCrowdsale.methods.currentTier().call();
        assert.equal(2, tier);
    })

    it('Whitelist: Should Revert on getting min investing', async () => {
        var revert;
        try { await woxCrowdsale.methods.minVestingWei().call(); }
        catch (error) { revert = error.message.includes('revert'); }
        assert.isOk(revert);
    })

    it('Whitelist: Should Revert on getting max investing', async () => {
        var revert;
        try { await woxCrowdsale.methods.maxVestingWei().call(); }
        catch (error) { revert = error.message.includes('revert'); }
        assert.isOk(revert);
    })

    it('Whitelist: Should return False on getting goal reached', async () => {
        const goalReached = await woxCrowdsale.methods.goalReached().call();
        assert.isNotOk(goalReached);
    })

    it('Whitelist: Should Revert on Finalizing ICO', async () => {
        var revert;
        try { await woxCrowdsale.methods.finalize().send({ from: owner, gaa: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        assert.isOk(revert);
    })

    it('Whitelist: Should add VC2 to VC whitelist by owner', async () => {
        await woxCrowdsale.methods.addToVC(VC2).send({ from: owner, gas: 3000000 });
        const checked = await woxCrowdsale.methods.whtielistedAsVC(VC2).call();
        assert.isOk(checked)
    })

    it('Whitelist: Should Revert on adding user to VC whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(user).send({ from: user, gas: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        const checked = await woxCrowdsale.methods.whtielistedAsVC(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('Whitelist: Should remove added VC1 from VC whitelist by owner', async () => {
        await woxCrowdsale.methods.addToVC(user).send({ from: owner, gas: 3000000 });
        await woxCrowdsale.methods.removeFromVC(user).send({ from: owner, gas: 3000000 });
        const checked = await woxCrowdsale.methods.whtielistedAsVC(user).call();
        assert.isNotOk(checked);
    })

    it('Whitelist: Should Revert on removing added VC1 from VC whitelist by others', async () => {
        await woxCrowdsale.methods.addToVC(VC1).send({ from: owner, gas: 3000000 });
        var checked = await woxCrowdsale.methods.whtielistedAsVC(VC1).call();
        assert.isOk(checked);

        var revert;
        try { await woxCrowdsale.methods.addToVC(VC1).send({ from: user, gas: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        checked = await woxCrowdsale.methods.whtielistedAsVC(VC1).call();
        assert.isOk(revert);
        assert.isOk(checked);
    })

    it('Whitelist: Should add grantee1 to Grantee whitelist by owner', async () => {
        await woxCrowdsale.methods.addToGrantees(grantee1).send({ from: owner, gas: 3000000 });
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked)
    })

    it('Whitelist: Should Revert on adding user to Grantee whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('Whitelist: Should remove added user from Grantee whitelist by owner', async () => {
        await woxCrowdsale.methods.addToGrantees(user).send({ from: owner, gas: 3000000 });
        await woxCrowdsale.methods.removeFromGrantees(user).send({ from: owner, gas: 3000000 });
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isNotOk(checked);
    })

    it('Whitelist: Should Revert on removing added grantee1 from Grantee whitelist by others', async () => {
        var revert;
        await woxCrowdsale.methods.addToGrantees(grantee1).send({ from: owner, gas: 3000000 });
        try { await woxCrowdsale.methods.removeFromGrantees(grantee1).send({ from: user, gas: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(revert);
        assert.isOk(checked);
    })

    it('Whitelist: Should grant tokens to grantee1', async () => {
        var BN = web3.utils.BN;

        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked);

        const initBalance = await woxToken.methods.balanceOf(grantee1).call();
        const grant = web3.utils.toWei('1000000', 'ether');
        var expected = new BN(initBalance).add(new BN(grant))

        await woxCrowdsale.methods.grantTokens(grantee1, grant).send({ from: owner, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(grantee1).call();
        assert.equal(expected.toString(), new BN(balance).toString());

        const freeBalance = await woxToken.methods.getFreeBalance(grantee1).call();
        assert.equal(0, freeBalance);
    })

    it('Whitelist: Should Revert on refunding', async () => {
        var revert;
        try { await woxCrowdsale.methods.refund(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Whitelist: Should Revert on payment to referrer', async () => {
        var revert;
        try { await woxCrowdsale.methods.PayReferral(user, 1).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Whitelist: Should Revert on buying tokens', async () => {
        var revert;
        const value = web3.utils.toWei('20', 'ether');
        try { await woxCrowdsale.methods.buyTokens(user).send({ from: user, value: value, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })

    it('Whitelist: Should Revert on buying tokens by VCs', async () => {
        var revert;
        const value = web3.utils.toWei('20', 'ether');
        try { await woxCrowdsale.methods.buyTokens(VC1).send({ from: VC1, value: value, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })
}

function itRunsICO1Test() {
    it('ICO1: Checks ICO is Opened and not Closed', async () => {
        const opened = await woxCrowdsale.methods.hasOpened().call()
        const closed = await woxCrowdsale.methods.hasClosed().call()
        assert.isOk(opened)
        assert.isNotOk(closed)
    })

    it('ICO1: Should Return 125000000 on getting Tier Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentTierHardcap().call();
        assert.equal(web3.utils.toWei('125000000', 'ether'), hardcap);
    })

    it('ICO1: Should Return 245000000 on getting Sale Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentSaleTokenWeiHardcap().call();
        assert.equal(web3.utils.toWei('245000000', 'ether'), hardcap);
    })

    it('ICO1: Should Return 22750 on getting Number of Tokens Per Ether', async () => {
        const tokensPerEth = await woxCrowdsale.methods.currentTierTokenWeisPerEth().call();
        assert.equal(web3.utils.toWei('22750', 'ether'), tokensPerEth);
    })

    it('ICO1: Should Return 3 on getting Current Tier', async () => {
        const tier = await woxCrowdsale.methods.currentTier().call();
        assert.equal(3, tier);
    })

    it('ICO1: Should return 0.1 ETH on getting min investing', async () => {
        const minVesting = await woxCrowdsale.methods.minVestingWei().call();
        assert.equal(web3.utils.toWei('0.1', 'ether'), minVesting)
    })

    it('ICO1: Should return 300 ETH on getting min investing', async () => {
        const maxVesting = await woxCrowdsale.methods.maxVestingWei().call();
        assert.equal(web3.utils.toWei('300', 'ether'), maxVesting)
    })

    it('ICO1: Should return False on getting goal reached', async () => {
        const goalReached = await woxCrowdsale.methods.goalReached().call();
        assert.isNotOk(goalReached);
    })

    it('ICO1: Should Revert on Finalizing ICO', async () => {
        var revert;
        try { await woxCrowdsale.methods.finalize().send({ from: owner, gaa: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        assert.isOk(revert);
    })

    it('ICO1: Should Revert on adding user to VC whitelist by owner', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(user).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whtielistedAsVC(user).call()
        assert.isOk(revert)
        assert.isNotOk(checked)
    })

    it('ICO1: Should Revert on adding VC1 to VC whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whtielistedAsVC(user).call()
        assert.isOk(revert)
        assert.isNotOk(checked)
    })

    it('ICO1: Should Revert on adding user to Grantee by owner', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(user).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('ICO1: Should Revert on adding user to Grantee whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('ICO1: Should grant tokens to grantee1 by owner', async () => {
        var BN = web3.utils.BN;

        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked);

        const initBalance = await woxToken.methods.balanceOf(grantee1).call();
        const grant = web3.utils.toWei('1000000', 'ether');
        var expected = new BN(initBalance).add(new BN(grant))

        await woxCrowdsale.methods.grantTokens(grantee1, grant).send({ from: owner, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(grantee1).call();
        assert.equal(expected.toString(), new BN(balance).toString());

        const freeBalance = await woxToken.methods.getFreeBalance(grantee1).call();
        assert.equal(0, freeBalance);
    })

    it('ICO1: Should Revert on granting tokens to grantee1 by others', async () => {
        var BN = web3.utils.BN;

        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked);

        const initBalance = await woxToken.methods.balanceOf(grantee1).call();

        const grant = web3.utils.toWei('1000000', 'ether');
        var revert;
        try { await woxCrowdsale.methods.grantTokens(grantee1, grant).send({ from: grantee1, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const balance = await woxToken.methods.balanceOf(grantee1).call();
        assert.equal(initBalance, balance);
    })

    it('ICO1: Should Pay to referrer by owner', async () => {
        var BN = web3.utils.BN;

        var initBalance = await woxToken.methods.balanceOf(referrer).call();
        const tokens = web3.utils.toWei('1', 'ether');
        const expected = new BN(initBalance).add(new BN(tokens));

        await woxCrowdsale.methods.PayReferral(referrer, tokens).send({ from: owner, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(referrer).call();

        assert.equal(expected.toString(), (new BN(balance)).toString());

    })

    it('ICO1: Should Revert on Paying to referrer by others', async () => {
        var initBalance = await woxToken.methods.balanceOf(referrer).call();
        const tokens = web3.utils.toWei('1', 'ether');

        var revert;
        try { await woxCrowdsale.methods.PayReferral(referrer, tokens).send({ from: referrer, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const balance = await woxToken.methods.balanceOf(referrer).call();
        assert.equal(initBalance, balance);

    })

    it('ICO1: Should Revert on buying less than 0.1 ether', async () => {
        const initBalance = await woxToken.methods.balanceOf(user2).call();

        const value = web3.utils.toWei('0.01', 'ether');
        var revert;
        try { await woxCrowdsale.methods.buyTokens(user2).send({ from: user2, value: value, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);

        const balance = await woxToken.methods.balanceOf(user2).call();
        assert.equal(initBalance, balance);
    })

    it('ICO1: Should buy token by user', async () => {
        var BN = web3.utils.BN;

        const initBalance = await woxToken.methods.balanceOf(user).call();
        const value = web3.utils.toWei('1', 'ether');
        const tokens = web3.utils.toWei((1 * 273000 / 12).toString(), 'ether');
        const expected = new BN(initBalance).add(new BN(tokens));

        await woxCrowdsale.methods.buyTokens(user).send({ from: user, value: value, gas: 3000000 });
        var balance = await woxToken.methods.balanceOf(user).call();
        assert.equal(expected.toString(), (new BN(balance)).toString());
    })

    it('ICO1: Should buy more than 0.1 ether token by Whitelisted VCs', async () => {
        var BN = web3.utils.BN;

        const value = web3.utils.toWei('0.1', 'ether');
        const initBalance = await woxToken.methods.balanceOf(VC2).call();
        const tokens = web3.utils.toWei((0.1 * 2730 / 0.12).toString(), 'ether');
        const expected = new BN(initBalance).add(new BN(tokens));

        await woxCrowdsale.methods.buyTokens(VC2).send({ from: VC2, value: value, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(VC2).call();
        assert.equal(expected.toString(), (new BN(balance)).toString());
    })

    it('ICO1: Should Revert on refunding', async () => {
        var revert;
        try { await woxCrowdsale.methods.refund(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })
}

function itRunsICO2Test() {
    it('ICO2: Checks ICO is Opened and not Closed', async () => {
        const opened = await woxCrowdsale.methods.hasOpened().call()
        const closed = await woxCrowdsale.methods.hasClosed().call()
        assert.isOk(opened)
        assert.isNotOk(closed)
    })

    it('ICO2: Should Return 125000000 on getting Tier Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentTierHardcap().call();
        assert.equal(web3.utils.toWei('125000000', 'ether'), hardcap);
    })

    it('ICO2: Should Return 370000000 on getting Sale Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentSaleTokenWeiHardcap().call();
        assert.equal(web3.utils.toWei('370000000', 'ether'), hardcap);
    })

    it('ICO2: Should Return 21000 on getting Number of Tokens Per Ether', async () => {
        const tokensPerEth = await woxCrowdsale.methods.currentTierTokenWeisPerEth().call();
        assert.equal(web3.utils.toWei('21000', 'ether'), tokensPerEth);
    })

    it('ICO2: Should Return 4 on getting Current Tier', async () => {
        const tier = await woxCrowdsale.methods.currentTier().call();
        assert.equal(4, tier);
    })

    it('ICO2: Should return 0.1 ETH on getting min investing', async () => {
        const minVesting = await woxCrowdsale.methods.minVestingWei().call();
        assert.equal(web3.utils.toWei('0.1', 'ether'), minVesting)
    })

    it('ICO2: Should return 300 ETH on getting min investing', async () => {
        const maxVesting = await woxCrowdsale.methods.maxVestingWei().call();
        assert.equal(web3.utils.toWei('300', 'ether'), maxVesting)
    })

    it('ICO2: Should return False on getting goal reached', async () => {
        const goalReached = await woxCrowdsale.methods.goalReached().call();
        assert.isNotOk(goalReached);
    })

    it('ICO2: Should Revert on Finalizing ICO', async () => {
        var revert;
        try { await woxCrowdsale.methods.finalize().send({ from: owner, gaa: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        assert.isOk(revert);
    })

    it('ICO2: Should Revert on adding user to VC whitelist by owner', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(user).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whtielistedAsVC(user).call()
        assert.isOk(revert)
        assert.isNotOk(checked)
    })

    it('ICO2: Should Revert on adding VC1 to VC whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whtielistedAsVC(user).call()
        assert.isOk(revert)
        assert.isNotOk(checked)
    })

    it('ICO2: Should Revert on adding user to Grantee by owner', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(user).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('ICO2: Should Revert on adding user to Grantee whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('ICO2: Should grant tokens to grantee1 by owner', async () => {
        var BN = web3.utils.BN;

        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked);

        const initBalance = await woxToken.methods.balanceOf(grantee1).call();
        const grant = web3.utils.toWei('1000000', 'ether');
        var expected = new BN(initBalance).add(new BN(grant))

        await woxCrowdsale.methods.grantTokens(grantee1, grant).send({ from: owner, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(grantee1).call();
        assert.equal(expected.toString(), new BN(balance).toString());

        const freeBalance = await woxToken.methods.getFreeBalance(grantee1).call();
        assert.equal(0, freeBalance);
    })

    it('ICO2: Should Revert on granting tokens to grantee1 by others', async () => {
        var BN = web3.utils.BN;

        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked);

        const initBalance = await woxToken.methods.balanceOf(grantee1).call();

        const grant = web3.utils.toWei('1000000', 'ether');
        var revert;
        try { await woxCrowdsale.methods.grantTokens(grantee1, grant).send({ from: grantee1, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const balance = await woxToken.methods.balanceOf(grantee1).call();
        assert.equal(initBalance, balance);
    })

    it('ICO2: Should Pay to referrer by owner', async () => {
        var BN = web3.utils.BN;

        var initBalance = await woxToken.methods.balanceOf(referrer).call();
        const tokens = web3.utils.toWei('1', 'ether');
        const expected = new BN(initBalance).add(new BN(tokens));

        await woxCrowdsale.methods.PayReferral(referrer, tokens).send({ from: owner, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(referrer).call();

        assert.equal(expected.toString(), (new BN(balance)).toString());

    })

    it('ICO2: Should Revert on Paying to referrer by others', async () => {
        var initBalance = await woxToken.methods.balanceOf(referrer).call();
        const tokens = web3.utils.toWei('1', 'ether');

        var revert;
        try { await woxCrowdsale.methods.PayReferral(referrer, tokens).send({ from: referrer, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const balance = await woxToken.methods.balanceOf(referrer).call();
        assert.equal(initBalance, balance);

    })

    it('ICO2: Should buy token by user', async () => {
        var BN = web3.utils.BN;

        const initBalance = await woxToken.methods.balanceOf(user).call();
        const value = web3.utils.toWei('1', 'ether');
        const tokens = web3.utils.toWei((1 * 273000 / 13).toString(), 'ether');
        const expected = new BN(initBalance).add(new BN(tokens));

        await woxCrowdsale.methods.buyTokens(user).send({ from: user, value: value, gas: 3000000 });
        var balance = await woxToken.methods.balanceOf(user).call();
        assert.equal(expected.toString(), (new BN(balance)).toString());
    })

    it('ICO2: Should Revert on buying less than 0.1 ether', async () => {
        const initBalance = await woxToken.methods.balanceOf(user2).call();

        const value = web3.utils.toWei('0.01', 'ether');
        var revert;
        try { await woxCrowdsale.methods.buyTokens(user2).send({ from: user2, value: value, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);

        const balance = await woxToken.methods.balanceOf(user2).call();
        assert.equal(initBalance, balance);
    })

    it('ICO2: Should Revert on refunding', async () => {
        var revert;
        try { await woxCrowdsale.methods.refund(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })
}

function itRunsICO3Test() {
    it('ICO3: Checks ICO is Opened and not Closed', async () => {
        const opened = await woxCrowdsale.methods.hasOpened().call()
        const closed = await woxCrowdsale.methods.hasClosed().call()
        assert.isOk(opened)
        assert.isNotOk(closed)
    })

    it('ICO3: Should Return 125000000 on getting Tier Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentTierHardcap().call();
        assert.equal(web3.utils.toWei('125000000', 'ether'), hardcap);
    })

    it('ICO3: Should Return 495000000 on getting Sale Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentSaleTokenWeiHardcap().call();
        assert.equal(web3.utils.toWei('495000000', 'ether'), hardcap);
    })

    it('ICO3: Should Return 19500 on getting Number of Tokens Per Ether', async () => {
        const tokensPerEth = await woxCrowdsale.methods.currentTierTokenWeisPerEth().call();
        assert.equal(web3.utils.toWei('19500', 'ether'), tokensPerEth);
    })

    it('ICO3: Should Return 5 on getting Current Tier', async () => {
        const tier = await woxCrowdsale.methods.currentTier().call();
        assert.equal(5, tier);
    })

    it('ICO3: Should return 0.1 ETH on getting min investing', async () => {
        const minVesting = await woxCrowdsale.methods.minVestingWei().call();
        assert.equal(web3.utils.toWei('0.1', 'ether'), minVesting)
    })

    it('ICO3: Should return 300 ETH on getting min investing', async () => {
        const maxVesting = await woxCrowdsale.methods.maxVestingWei().call();
        assert.equal(web3.utils.toWei('300', 'ether'), maxVesting)
    })

    it('ICO3: Should return False on getting goal reached', async () => {
        const goalReached = await woxCrowdsale.methods.goalReached().call();
        assert.isNotOk(goalReached);
    })

    it('ICO3: Should Revert on Finalizing ICO', async () => {
        var revert;
        try { await woxCrowdsale.methods.finalize().send({ from: owner, gaa: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        assert.isOk(revert);
    })

    it('ICO3: Should Revert on adding user to VC whitelist by owner', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(user).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whtielistedAsVC(user).call()
        assert.isOk(revert)
        assert.isNotOk(checked)
    })

    it('ICO3: Should Revert on adding VC1 to VC whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whtielistedAsVC(user).call()
        assert.isOk(revert)
        assert.isNotOk(checked)
    })

    it('ICO3: Should Revert on adding user to Grantee by owner', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(user).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('ICO3: Should Revert on adding user to Grantee whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('ICO3: Should grant tokens to grantee1 by owner', async () => {
        var BN = web3.utils.BN;

        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked);

        const initBalance = await woxToken.methods.balanceOf(grantee1).call();
        const grant = web3.utils.toWei('1000000', 'ether');
        var expected = new BN(initBalance).add(new BN(grant))

        await woxCrowdsale.methods.grantTokens(grantee1, grant).send({ from: owner, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(grantee1).call();
        assert.equal(expected.toString(), new BN(balance).toString());

        const freeBalance = await woxToken.methods.getFreeBalance(grantee1).call();
        assert.equal(0, freeBalance);
    })

    it('ICO3: Should Revert on granting tokens to grantee1 by others', async () => {
        var BN = web3.utils.BN;

        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked);

        const initBalance = await woxToken.methods.balanceOf(grantee1).call();

        const grant = web3.utils.toWei('1000000', 'ether');
        var revert;
        try { await woxCrowdsale.methods.grantTokens(grantee1, grant).send({ from: grantee1, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const balance = await woxToken.methods.balanceOf(grantee1).call();
        assert.equal(initBalance, balance);
    })

    it('ICO3: Should Pay to referrer by owner', async () => {
        var BN = web3.utils.BN;

        var initBalance = await woxToken.methods.balanceOf(referrer).call();
        const tokens = web3.utils.toWei('1', 'ether');
        const expected = new BN(initBalance).add(new BN(tokens));

        await woxCrowdsale.methods.PayReferral(referrer, tokens).send({ from: owner, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(referrer).call();

        assert.equal(expected.toString(), (new BN(balance)).toString());

    })

    it('ICO3: Should Revert on Paying to referrer by others', async () => {
        var initBalance = await woxToken.methods.balanceOf(referrer).call();
        const tokens = web3.utils.toWei('1', 'ether');

        var revert;
        try { await woxCrowdsale.methods.PayReferral(referrer, tokens).send({ from: referrer, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const balance = await woxToken.methods.balanceOf(referrer).call();
        assert.equal(initBalance, balance);

    })

    it('ICO3: Should buy token by user', async () => {
        var BN = web3.utils.BN;

        const initBalance = await woxToken.methods.balanceOf(user).call();
        const value = web3.utils.toWei('1', 'ether');
        const tokens = web3.utils.toWei((1 * 273000 / 14).toString(), 'ether');
        const expected = new BN(initBalance).add(new BN(tokens));

        await woxCrowdsale.methods.buyTokens(user).send({ from: user, value: value, gas: 3000000 });
        var balance = await woxToken.methods.balanceOf(user).call();
        assert.equal(expected.toString(), (new BN(balance)).toString());
    })

    it('ICO3: Should Revert on buying less than 0.1 ether', async () => {
        const initBalance = await woxToken.methods.balanceOf(user2).call();

        const value = web3.utils.toWei('0.01', 'ether');
        var revert;
        try { await woxCrowdsale.methods.buyTokens(user2).send({ from: user2, value: value, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);

        const balance = await woxToken.methods.balanceOf(user2).call();
        assert.equal(initBalance, balance);
    })

    it('ICO3: Should Revert on refunding', async () => {
        var revert;
        try { await woxCrowdsale.methods.refund(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })
}

function itRunsICO4Test() {
    it('ICO4: Checks ICO is Opened and not Closed', async () => {
        const opened = await woxCrowdsale.methods.hasOpened().call()
        const closed = await woxCrowdsale.methods.hasClosed().call()
        assert.isOk(opened)
        assert.isNotOk(closed)
    })

    it('ICO4: Should Return 125000000 on getting Tier Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentTierHardcap().call();
        assert.equal(web3.utils.toWei('125000000', 'ether'), hardcap);
    })

    it('ICO4: Should Return 620000000 on getting Sale Hardcap', async () => {
        const hardcap = await woxCrowdsale.methods.currentSaleTokenWeiHardcap().call();
        assert.equal(web3.utils.toWei('620000000', 'ether'), hardcap);
    })

    it('ICO4: Should Return 18200 on getting Number of Tokens Per Ether', async () => {
        const tokensPerEth = await woxCrowdsale.methods.currentTierTokenWeisPerEth().call();
        assert.equal(web3.utils.toWei('18200', 'ether'), tokensPerEth);
    })

    it('ICO4: Should Return 6 on getting Current Tier', async () => {
        const tier = await woxCrowdsale.methods.currentTier().call();
        assert.equal(6, tier);
    })

    it('ICO4: Should return 0.1 ETH on getting min investing', async () => {
        const minVesting = await woxCrowdsale.methods.minVestingWei().call();
        assert.equal(web3.utils.toWei('0.1', 'ether'), minVesting)
    })

    it('ICO4: Should return 300 ETH on getting min investing', async () => {
        const maxVesting = await woxCrowdsale.methods.maxVestingWei().call();
        assert.equal(web3.utils.toWei('300', 'ether'), maxVesting)
    })

    it('ICO4: Should return False on getting goal reached', async () => {
        const goalReached = await woxCrowdsale.methods.goalReached().call();
        assert.isNotOk(goalReached);
    })

    it('ICO4: Should Revert on Finalizing ICO', async () => {
        var revert;
        try { await woxCrowdsale.methods.finalize().send({ from: owner, gaa: 3000000 }); }
        catch (error) { revert = error.message.includes('revert'); }
        assert.isOk(revert);
    })

    it('ICO4: Should Revert on adding user to VC whitelist by owner', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(user).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whtielistedAsVC(user).call()
        assert.isOk(revert)
        assert.isNotOk(checked)
    })

    it('ICO4: Should Revert on adding VC1 to VC whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToVC(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whtielistedAsVC(user).call()
        assert.isOk(revert)
        assert.isNotOk(checked)
    })

    it('ICO4: Should Revert on adding user to Grantee by owner', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(user).send({ from: owner, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('ICO4: Should Revert on adding user to Grantee whitelist by Others', async () => {
        var revert;
        try { await woxCrowdsale.methods.addToGrantees(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(user).call();
        assert.isOk(revert);
        assert.isNotOk(checked);
    })

    it('ICO4: Should grant tokens to grantee1 by owner', async () => {
        var BN = web3.utils.BN;

        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked);

        const initBalance = await woxToken.methods.balanceOf(grantee1).call();
        const grant = web3.utils.toWei('1000000', 'ether');
        var expected = new BN(initBalance).add(new BN(grant))

        await woxCrowdsale.methods.grantTokens(grantee1, grant).send({ from: owner, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(grantee1).call();
        assert.equal(expected.toString(), new BN(balance).toString());

        const freeBalance = await woxToken.methods.getFreeBalance(grantee1).call();
        assert.equal(0, freeBalance);
    })

    it('ICO4: Should Revert on granting tokens to grantee1 by others', async () => {
        var BN = web3.utils.BN;

        const checked = await woxCrowdsale.methods.whitelistedAsGrantee(grantee1).call();
        assert.isOk(checked);

        const initBalance = await woxToken.methods.balanceOf(grantee1).call();

        const grant = web3.utils.toWei('1000000', 'ether');
        var revert;
        try { await woxCrowdsale.methods.grantTokens(grantee1, grant).send({ from: grantee1, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const balance = await woxToken.methods.balanceOf(grantee1).call();
        assert.equal(initBalance, balance);
    })

    it('ICO4: Should Pay to referrer by owner', async () => {
        var BN = web3.utils.BN;

        var initBalance = await woxToken.methods.balanceOf(referrer).call();
        const tokens = web3.utils.toWei('1', 'ether');
        const expected = new BN(initBalance).add(new BN(tokens));

        await woxCrowdsale.methods.PayReferral(referrer, tokens).send({ from: owner, gas: 3000000 });
        const balance = await woxToken.methods.balanceOf(referrer).call();

        assert.equal(expected.toString(), (new BN(balance)).toString());

    })

    it('ICO4: Should Revert on Paying to referrer by others', async () => {
        var initBalance = await woxToken.methods.balanceOf(referrer).call();
        const tokens = web3.utils.toWei('1', 'ether');

        var revert;
        try { await woxCrowdsale.methods.PayReferral(referrer, tokens).send({ from: referrer, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert)

        const balance = await woxToken.methods.balanceOf(referrer).call();
        assert.equal(initBalance, balance);

    })

    it('ICO4: Should buy token by user', async () => {
        var BN = web3.utils.BN;

        const initBalance = await woxToken.methods.balanceOf(user).call();
        const value = web3.utils.toWei('1', 'ether');
        const tokens = web3.utils.toWei((1 * 273000 / 15).toString(), 'ether');
        const expected = new BN(initBalance).add(new BN(tokens));

        await woxCrowdsale.methods.buyTokens(user).send({ from: user, value: value, gas: 3000000 });
        var balance = await woxToken.methods.balanceOf(user).call();
        assert.equal(expected.toString(), (new BN(balance)).toString());
    })

    it('ICO4: Should Revert on buying less than 0.1 ether', async () => {
        const initBalance = await woxToken.methods.balanceOf(user2).call();

        const value = web3.utils.toWei('0.01', 'ether');
        var revert;
        try { await woxCrowdsale.methods.buyTokens(user2).send({ from: user2, value: value, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);

        const balance = await woxToken.methods.balanceOf(user2).call();
        assert.equal(initBalance, balance);
    })

    it('ICO4: Should Revert on refunding', async () => {
        var revert;
        try { await woxCrowdsale.methods.refund(user).send({ from: user, gas: 3000000 }) }
        catch (error) { revert = error.message.includes('revert') }
        assert.isOk(revert);
    })
}


describe('WOX Crowdsale', function () {
    this.timeout(0);

    before(async () => {
        const accounts = await web3.eth.getAccounts();
        owner = accounts[0];
        grantee1 = accounts[1];
        grantee3 = accounts[2];
        VC1 = accounts[3];
        VC2 = accounts[4];
        referrer = accounts[5];
        user = accounts[6];
        user2 = accounts[7];

        gas = await web3.eth.estimateGas({ data: woxTokenContract.bytecode });
        woxToken = await new web3.eth.Contract(JSON.parse(woxTokenContract.interface))
            .deploy({ data: woxTokenContract.bytecode })
            .send({ from: owner, gas: gas });
        woxTokenAddress = woxToken.options.address;

        woxCrowdsale = await new web3.eth.Contract(JSON.parse(woxCrowdsaleContract.interface))
            .deploy({
                data: woxCrowdsaleContract.bytecode,
                arguments: [3, 2730, owner, woxTokenAddress]
            })
            .send({ from: owner, gas: 4000000 });
        woxCrowdsaleAddress = woxCrowdsale.options.address;

        console.log("crowdsale test")
    })

    itRunsPreSaleTest();

    it('pre Whitelist Tier is reached', async () => {
        while (tier != 0) {
            try {
                tier = await woxCrowdsale.methods.currentTier().call();
            } catch (error) {

            }
            await sleep(100)
        }
    })

    itRunspreWhitelistTest();

    it('preICO Tier is reached', async () => {
        while (tier != 1) {
            tier = await woxCrowdsale.methods.currentTier().call();
            await sleep(100)
        }
    })

    itRunsPreICOTest();

    it('Whitelist Tier is reached', async () => {
        while (tier != 2) {
            tier = await woxCrowdsale.methods.currentTier().call();
            await sleep(100)
        }
    })

    itRunsWhitelistTest();

    it('ICO1 Tier is reached', async () => {
        while (tier != 3) {
            tier = await woxCrowdsale.methods.currentTier().call();
            await sleep(500)
        }
    })

    itRunsICO1Test();

    it('ICO2 Tier is reached', async () => {
        while (tier != 4) {
            tier = await woxCrowdsale.methods.currentTier().call();
            await sleep(500)
        }
    })

    itRunsICO2Test();

    it('ICO3 Tier is reached', async () => {
        while (tier != 5) {
            tier = await woxCrowdsale.methods.currentTier().call();
            await sleep(500)
        }
    })

    itRunsICO3Test();

    it('ICO4 Tier is reached', async () => {
        while (tier != 6) {
            tier = await woxCrowdsale.methods.currentTier().call();
            await sleep(500)
        }
    })

    itRunsICO4Test();

})