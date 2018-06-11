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

