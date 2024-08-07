import { describe, expect, it } from 'vitest';
import { handcashAppId, handcashAppSecret } from '../env';
import environments from '../../src/environments';
import { Crypto, WalletService } from '../../src';

describe('# Wallet - Integration Tests', () => {
	const walletService = new WalletService({
		appSecret: handcashAppSecret,
		appId: handcashAppId,
		env: environments.iae,
	});
	const nonExistingAccountEmail = 'jajape9384+2@modotso.com';
	const existingAccountEmail = 'jajape9384@modotso.com';

	it.skip('should create a new account', async () => {
		const requestId = await walletService.requestSignUpEmailCode(nonExistingAccountEmail);
		expect(requestId).toBeTypeOf('string');
		console.log('requestId: ', requestId);
	});

	it.skip('should verify email code for a non-existing account and create it', async () => {
		const verificationCode = '01234567';
		const requestId = '123456';
		const handle = nonExistingAccountEmail.split('@')[0];
		const keyPair = Crypto.generateAuthenticationKeyPair();

		await walletService.verifyEmailCode(requestId, verificationCode, keyPair.publicKey);
		await walletService.createWalletAccount(keyPair.publicKey, nonExistingAccountEmail, handle!);

		const account = walletService.getWalletAccountFromAuthToken(keyPair.privateKey);
		const depositInfo = await account.wallet.getDepositInfo();
		expect(depositInfo.id).toBeTypeOf('string');
	});

	it.skip('should request sign-in code for an existing account', async () => {
		const requestId = await walletService.requestSignUpEmailCode(existingAccountEmail);
		expect(requestId).toBeTypeOf('string');
		console.log('requestId: ', requestId);
	});

	it.skip('should verify email code for an existing account', async () => {
		const verificationCode = '01234567';
		const requestId = '123456';
		const keyPair = Crypto.generateAuthenticationKeyPair();

		await walletService.verifyEmailCode(requestId, verificationCode, keyPair.publicKey);

		const account = walletService.getWalletAccountFromAuthToken(keyPair.privateKey);
		const depositInfo = await account.wallet.getDepositInfo();
		expect(depositInfo.id).toBeTypeOf('string');
	});
});
