# Introduction

The project consists of two main parts. WOX Token and WOX Crowdsale contracts. These smart contracts are developed in Solidity language and based on Ethereum Blockchain. The backbone of the smart contracts benefit from OpenZeppelin libraries and contracts which are well audted .

## WOX Token

WOX Token is developed based on Standard ERC223 token, completely compatible with ERC20 Tokens. The benefit behind using ERC223 Token is mainly leads to preventing 
tokens being transfered to contracts not supporting token transactions and consequents token lost. This feature makes ERC223 Tokens safer and more reliable. Besides WOX Token is featured for Token Burning and Locked Token Transfer.

## WOX Crowdsale

WOX Crowdsale is intended to manage the Crowdsale of WOX Tokens in an ICO event. It's promised to handle different ICO Rounds with specified features. WOX Crowdsale is equipped to support a vast variety of functionalities such as Public and Private Investors, Refundable Invest, Refferral Paiment, Burnable Token and Granting Supporters.

# WOX Token Explained

As mentioned WOX Token is based on ERC223 Token. Consequently, it's completely compatible with ERC20 Tokens but safer. Furthermore the contract is named "WOX.Network" with the symbol name of "WOX". Total Supply of the Token contract is 1 Billion WOX Tokens diplayed with 18 decimals.

There are 3 ways to transfer tokens from an address to another one:

## 1- Transfer methods

In this way the Message Sender demands to transfer an amount of tokens from his/her balance to a specified address. The source and destination addresses could be a contract or EOA (Externally Owned Account). 

In contrary to ERC20 Tokens if the destination contract doesn't support token transfer, the transaction would be reverted in order to preventiong form token lost. The contract should contain a fallback function named "tokenFallback" which accepts tokens. It's also possible for contracts to have such falback functions with any arbitrary names. In this case, the function interface should be passed too.

## 2- Approval method

Ones can also firstly approve an amount of tokens to a specified address in order that the receiver can then transfer that tokens to any address with all considerations mentioned above.

## 3- Locked Token Transfer method

This is a bran-new facility which ables token senders to conditionaly transfer tokens to any address with all considerations mentioned for contract receivers. A condition actually is a Lock Time means the tokens would be freed only after a period of time. Whenever the Lock Time expires, since then the ownr can spend tokens.

## Token Burning

Every token owner has the possibility to burn any amount of his/her tokens. Token burning causes reduction in total token supply too.

# WOX Crowdsale Explained

WOX Crowdsale includes different parameters, features, roles, processes, etc.

## Administration

The WOX Crowdsale has an owner (Administrator) with special authorities:

- Deployer of the Contract
- Initial Owner of Tokens
- Whitelisting VCs
- Whitelisting Grantees
- Granting Tokens
- Referral Payment
- Crowdsale Finalization
- Fund Withdrawal
- Burning Tokens

When the contract is deployed to ethereum blockchain the deployer of the contract is recognized as the Contract Owner. At the begining all of the tokens are belonged to the Owner. 

**Note**: In order that the contract can sell the tokens, the Owner should transfer enough tokens to the Crowdsale contract.

WOX Crowdsale Owner is the only person who can add/remove VCs and Grantees to/from whitelists, also the only one is able to grant tokens to supporters.

**Note**: Whitelisting is only allowed in pre-Whitelist and Whitelist Rounds.

**Note**: Granting tokens is only allowed immediately after pre-ICO and before ICO ending.

Referrers are paid tokens by the Owner in pre-ICO and ICO Rounds.

**Note**: Token Referral Payment is not allowed in pre-Whitelist or Whitelist Rounds.

The Owner has the authority to withdraw the funds acquired at any time. At the end of the crowdsale owner can finalize the crowdsale. If the desired goal is reached the remaining funds in the contract will be transfered to a specified wallet, otherwise the crowdsale will enter the Refunding phase, every investor can refund deposited values. Finally Burning unsold tokens can only be done by Owner.

## Participants and Beneficiaries

Everyone can participate in crowdsale to invest on WOX Tokens and purchasing them. However Venture Capitalists (VC) has the chance to purchase tokens cheaper but bigger. As mentioned, Private Investors should be whitelisted in pre-Whitelist Round by the Owner in order that they would be permitted to purchase tokens at pre-ICO Round. Note that the tokens being sold at this Round are cheaper but the participant must purchase a large portion (at least 50K of USD). VCs Whitelisted in the Whitelist Round can participate in ICO Rounds.

Public contributors who don't want to purchase a large portion of tokens, can buy tokens at 4 ICO Rounds at higher prices.

## Grantees

Team Developers and Advisors are granted by tokens. Tokens are grantable only after pre-ICO Round is reached to end. Crowdsale Owner is the only authority that can grant tokens. Take into consideration that Grantees must be whitelisted by the Owner in pre-Whitelist or Whitelist Rounds in order to receive grants.
However Granted tokens are transfered by LTT (Locked Token Transfer) Mechanism. Consequently 30% of granted tokens are freed after crowdsale ending while 365 days later the 70% remaining tokens would be freed.

## Referrals

30 Millions of WOX Tokens are assigned to be distributed amonggst Referrers by the Owner. Referral Token distribution is only allowed at pre-ICO and ICO Rounds.

## Staged Pricing

Tokens are sold at different rates of ETHER determined by an Staged Pricing Mechanism. The followingtable shows token prices in USD at different Rounds:


|Round| Pre-ICO  |  ICO-1   |  ICO-2   |  ICO-3   |  ICO-4   |
|----:|---------:|---------:|---------:|---------:|---------:|
|Price| 0.08 USD | 0.12 USD | 0.13 USD | 0.14 USD | 0.15 USD |

However, the ETHER prices of WOX Tokens are computed at deployment point based on the above table and USD-ETH rate. The ETHER prices would not change then after.


## Caps

Wox Token contains 1 Billion Tokens as total supply. However, 120 Million of WOX Tokens are considered as pre-ICO hardcap which are intended to be purchased by Whitelisted VCs. Besides, 500 Million tokens would be sold in 4 ICO Rounds, 125 Million Tokens per each, at different staged prices. That should be mentioned that the unsold remaining tokens at each Round will be added to the hardacp of next Rounds. In addition, 30 Million WOX Tokens are intended to be distributed as Referrals. Remaining Tokens would be granted or retained by contract.

Besides, 3 Million USD is considered as desired softcap. The goal would be reached if at least this fund raises. Otherwise, Owner would finalize the crowdsale and values deposited by investors would be refunded.

## Burning Tokens

Crowdsale Owner is able to unlimitedly burn tokens at anytime.

## Fund Withdrawal

All raised funds could be withdrawn by the Owner at any time unlimitedly.

## Finalization

When the last ICO Round reached to the end, the crowdsale would immediately closed and Owner should finalize the crowdsale. If goal is reached the raised funds will be automatically transfered to the wallet specified by the Owner. Otherwise, crowdsale would enter Refunding state and every investor can demands his/her values to be refunded.

Below is a graphical view of the WOX Crowdsale timeline.

![timeline](./TimeLine.jpg)