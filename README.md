# Introduction

The project consists of two main parts. WOX Token and WOX Crowdsale contracts. These smart contracts are developed in Solidity language and based on Ethereum Blockchain. The backbone of the smart contracts benefit from OpenZeppelin libraries and contracts which are well audted .

## WOX Token

WOX Token is developed based on Standard ERC223 token, completely compatible with ERC20 Tokens. The benefit behind using ERC223 Token is mainly leads to preventing 
tokens being transfered to contracts not supporting token transactions and consequents token lost. This feature makes ERC223 Tokens safer and more reliable. Besides WOX Token is featured for Token Burning and Locked Token Transfer.

## WOX Crowdsale

WOX Crowdsale is intended to manage the Crowdsale of WOX Tokens in an ICO event. It's promised to handle different ICO Rounds with specified features. WOX Crowdsale is equipped to support a vast variety of functionalities such as Public and Private Investors, Refundable Invest, Refferral Paiment, Burnable Token and Granting Supporters.

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

Everyone can participate in crowdsale to invest on WOX Tokens and purchasing them. However Venture Capitalists (VC) has the chance to purchase tokens cheaper but bigger. As mentioned, Private Investors should be whitelisted in pre-Whitelist Round by the Owner in order that they would be permitted to purchase tokens at pre-ICO Round. Note that the tokens being sold at this Round are cheaper but the participant must purchase a large portion (at least 50K of USD).

Public contributors who don't want to purchase a large portion of tokens, can buy tokens at 4 ICO Rounds at higher prices.

## Grantess

Team Developers and Advisors are granted by tokens. Tokens are grantable only after pre-ICO Round is reached to end. Crowdsale Owner is the only authority that can grant tokens. Take into consideration that Grantees must be whitelisted by the Owner in pre-Whitelist or Whitelist Rounds in order to receive grants.
However Granted tokens are transfered by LTT (Locked Token Transfer) Mechanism. Consequently 30% of granted tokens are freed after crowdsale ending while 365 days later the 70% remaining tokens would be freed.

