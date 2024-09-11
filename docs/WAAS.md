# Wallet-as-a-service

WaaS is a service that allows you to create and manage non-custodial wallets for your users. These wallets are protected
by MPC and only users can authorize delegated access upon email verification.

Our SDK provides a simple way create wallets, get balances, make payments, and more.

## Getting started

### Developer dashboard

1. Create and account in the developer [dashboard](https://dashboard.handcash.io) or sign in.
2. Create or select an application. Copy your `appId` and `appSecret`.

### Install the HandCash SDK

`npm i @handcash/sdk`

## Create a new non-custodial wallet

```typescript
import { WalletService, Crypto } from '@handcash/sdk';

const walletService = new WalletService({
	appId: '<YOUR-APP-ID>',
	appSecret: '<YOUR-APP-SECRET>',
});

// Request email verification code
const requestId = await walletService.requestSignUpEmailCode(email);

// Verify email code
const verificationCode = '01234567';
const keyPair = Crypto.generateAuthenticationKeyPair();
await walletService.verifyEmailCode(requestId, verificationCode, keyPair.publicKey);

// Create new wallet
const isAvailableHandle = await walletService.isAliasAvailable(handle);
if(!isAvailableHandle) throw new Error('handle is not available');
await walletService.createWalletAccount(keyPair.publicKey, email, handle);

// Store the authentication key in a secure place so the user can access the wallet later
await storeAuthenticationkey(keyPair.privateKey);

// Get access to the new wallet
const account = walletService.getWalletAccountFromAuthToken(keyPair.privateKey);
```

## Get access to an existing wallet

```typescript
import { WalletService, Crypto } from '@handcash/sdk';

const walletService = new WalletService({
	appId: '<YOUR-APP-ID>',
	appSecret: '<YOUR-APP-SECRET>',
});

// Request email verification code
const requestId = await walletService.requestSignInEmailCode(email);

// Verify email code
const verificationCode = '01234567';
const keyPair = Crypto.generateAuthenticationKeyPair();
await walletService.verifyEmailCode(requestId, verificationCode, keyPair.publicKey);

// Store the authentication key in a secure place so the user can access the wallet later
await storeAuthenticationkey(keyPair.privateKey);

// Get access to the wallet account
const account = walletService.getWalletAccountFromAuthToken(keyPair.privateKey);
```

## Get deposit methods

```typescript
const account = walletService.getWalletAccountFromAuthToken(keyPair.privateKey);
const accountInfo = await account.getInfo();

console.log(accountInfo);
```

```json
{
  "id": "63b4cdab6d9bbb40a077c31d",
  "paymail": "jack@lamint.io",
  "alias": "jack",
  "base58Address": "16HcSyxRkCDS9omL6kLxrPkM7q9KZm9apA",
  "createdAt": "2024-07-12T16:02:34.171Z"
}
```

You can use the follow deposit methods:

- `id` or `alias` to send from other wallets using our SDK.
- `paymail` to send P2P from other BSV wallets who support this protocol.
- `base58Address` to send from any BSV wallet or exchange.

## Get wallet balance

```typescript
const account = walletService.getWalletAccountFromAuthToken(keyPair.privateKey);

const balance = await account.wallet.getBalance();
console.log(balance);
```

```json
{
  "items": [
    {
      "currency": {
        "code": "BSV",
        "logoUrl": "https://res.cloudinary.com/hn8pdtayf/image/upload/v1721318886/54b1047685c48c267bc7b8183af42954.jpg",
        "symbol": ""
      },
      "units": 0.20801351,
      "fiatEquivalent": {
        "currencyCode": "USD",
        "units": 9.18837276372
      }
    }
  ]
}
```

## Make a payment

```typescript
const account = walletService.getWalletAccountFromAuthToken(keyPair.privateKey);
const accountInfo = await account.getInfo();

const paymentParameters = {
	description: 'Sending to myself',
	payments: [
		{ destination: accountInfo.paymail, currencyCode: 'BSV', denominatedIn: 'USD', sendAmount: 0.01 },
		// You can add multiple destinations
	],
};
const paymentResult = await account.wallet.pay(paymentParameters);
console.log(paymentResult);
```

```json
{
    "transactionId": "c6df6b9ea763ace4dccc94d244717c07295c3c52bd54ea9d1a66e21eede852b5",
    "note": "",
    "type": "send",
    "time": 1726070984,
    "units": 0.00019879,
    "satoshiFees": 0,
    "fiatEquivalent": {
        "currencyCode": "USD",
        "units": 0.009999812886000001
    },
    "currency": {
        "code": "BSV",
        "logoUrl": "",
        "symbol": "BSV"
    },
    "participants": [
        {
            "type": "user",
            "id": "612cba70e108780b4f6817ad",
            "alias": "rafa",
            "displayName": "Rafa Jimenez",
            "profilePictureUrl": "https://res.cloudinary.com/handcash-iae/image/upload/v1712916589/ccfdc5631f145c1ceb4a305754812d3f.jpg",
            "avatarMetadata": {},
            "responseNote": "",
            "tags": []
        }
    ],
    "attachments": [],
}
```

## Get wallet payments

```typescript
const account = walletService.getWalletAccountFromAuthToken(keyPair.privateKey);

const payments = await account.wallet.getPaymentsHistory({ from: 0, to: 5 });
console.log(payments);
```

```json
{
  "from": 0,
  "to": 5,
  "items": [
    {
      "transactionId": "917674cbea0f14bbe24c1a9a6f967763a499c4a3a9f20e9bbc1bad8a152a5357",
      "note": "External deposit",
      "type": "receive",
      "time": 1716311894,
      "currencyCode": "BSV",
      "currencyUnits": 0.0154,
      "fiatEquivalent": {
        "currencyCode": "USD",
        "units": 1.0826816
      },
      "participants": [
        {
          "type": "user",
          "id": "641f16f0365bc7609e582352",
          "alias": "rjseibane",
          "profilePictureUrl": "https://cloud.handcash.io/v2/users/profilePicture/rjseibane",
          "tags": []
        }
      ]
    }
    // More payments here
  ]
}
```


### Configure Paymail Domain (optional)
To have wallet addressable by `alias@<yourdomain.com>` from other wallets in the BSV ecosystem you can configure a custom paymail domain for your users wallets

#### Step 1: Add SRV Record

Add an SRV record to your domain's DNS settings with the following details:

- **Type:** SRV Record
- **Name:** _bsvalias._tcp
- **Value:** 10 10 443 cloud.handcash.io

#### Step 2: Enable DNSSEC

Enable DNSSEC for your domain. This is typically done through your domain registrar or DNS provider's settings.

#### Step 3: Update Paymail Domain

1. Go to the HandCash developer dashboard: https://dashboard.handcash.io/
2. Update your Paymail domain settings in the dashboard

After completing these steps, your domain should be properly configured for Paymail use with HandCash Wallet as a Service.

Example using NameCheap.com

![Namecheap.com example](./namecheap_DNS_example.png)