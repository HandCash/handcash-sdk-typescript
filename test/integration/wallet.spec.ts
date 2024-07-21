import {describe, expect, it} from 'vitest';
import {authToken, handcashAppId, handcashAppSecret} from "../env";
import environments from "../../src/environments";
import {PaymentParameters} from "../../src/types";
import HandCashHttpService from "../../src/api/handcash_http_service";
import Wallet from "../../src/wallet";

describe('# Wallet - Integration Tests', () => {
    const wallet = new Wallet(
        new HandCashHttpService({
            authToken,
            baseEndpointHandCash: environments.iae.baseEndpointHandCash,
            baseEndpointTrustholder: environments.iae.baseEndpointTrustholder,
            appSecret: handcashAppSecret,
            appId: handcashAppId,
        }),
    );

    it('should pay to multiple people using handles and paymails', async () => {
        const paymentParameters: PaymentParameters = {
            note: 'Testing Connect SDK',
            instrumentCode: 'BSV',
            denominatedIn: 'USD',
            receivers: [
                {
                    to: 'rjseibane',
                    amount: 0.0001,
                },
                {
                    to: 'rafa@internal.handcash.io',
                    amount: 0.0001,
                },
            ],
        };
        const createdPaymentResult = await wallet.pay(paymentParameters);
        expect(createdPaymentResult.transactionId).toBeTypeOf('string');
        const participantAliases = createdPaymentResult.participants.map((p) => p.alias);
        expect(participantAliases).toContain('rafa@internal.handcash.io');
        expect(participantAliases).toContain('rjseibane');
    });

    it('should throw an error when using invalid parameters', async () => {
        const paymentParameters: PaymentParameters = {
            note: 'Testing Connect SDK',
            denominatedIn: 'USD',
            instrumentCode: 'BSV',
            receivers: [
                {
                    to: '',
                    amount: 0.0001,
                },
            ],
        };
        await expect(wallet.pay(paymentParameters)).rejects.toThrow(
            '"receivers[0].destination" does not match any of the allowed types'
        );
    });

    it('should retrieve the deposit info', async () => {
        const depositInfo = await wallet.getDepositInfo();
        expect(depositInfo.id).toBeTypeOf('string');
        expect(depositInfo.alias).toBeTypeOf('string');
        expect(depositInfo.paymail).toBeTypeOf('string');
        expect(depositInfo.base58Address).toBeTypeOf('string');
    });

    it('should retrieve a previous payment result', async () => {
        const transactionId = 'c10ae3048927ba7f18864c2849d7e718899a1ba8f9aef3475b0b7453539d2ff6';
        const paymentResult = await wallet.getPayment(transactionId);
        expect(paymentResult.transactionId).toBe(transactionId);
    });

    it('should retrieve the last 5 payments', async () => {
        const payments = await wallet.getPaymentHistory({from: 0, to: 5});
        expect(payments.items.length).toBe(5);
    });

    it('should get total balance in default currency', async () => {
        const balance = await wallet.getTotalBalance();
        expect(balance.fiatEquivalent.currencyCode).toBeTypeOf('string');
        expect(balance.fiatEquivalent.units).toBeGreaterThan(0);
        expect(balance.units).toBeGreaterThan(0);
    });

    it('should get exchange rate in USD', async () => {
        const exchangeRate = await wallet.getExchangeRate('USD');
        expect(exchangeRate.fiatSymbol).toBe('USD');
        expect(exchangeRate.rate).toBeGreaterThan(0);
    });
});
