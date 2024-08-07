HandCash SDK is a server-side Node.js SDK designed for secure interaction with HandCash Wallets.

## Requirements

-  Node `v16.X` or higher
-  Only for NodeJS, i.e. it doesn't work on the browser side as it's a server-side library for security reasons.

## Documentation

-  [Getting started](#getting-started)
-  [Wallet-as-a-service](#Wallet-as-a-service)

## Getting started

### Developer dashboard

This SDK requires an `appId` to represent your application and an `appSecret` to ensure the SDK is securely invoked under your control.

> Don't have an app yet? Sign-up for [dashboard.handcash.io](https://dashboard.handcash.io) and create your first app.

### Installation

`npm i @handcash/handcash-sdk`

## Wallet-as-a-service

WaaS is a service that allows you to create and manage non-custodial wallets.

Check out the [WaaS documentation](docs/WAAS.md) for more information.
