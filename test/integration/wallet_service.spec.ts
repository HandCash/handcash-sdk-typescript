import { describe, expect, it } from 'vitest';
import { handcashAppId, handcashAppSecret } from '../env';
import environments from '../../src/environments';
import { Crypto, WalletService } from '../../src';

// These step can be run 1 by 1 by setting an email to test the full story of creating a new user, and creating a new user authorization for an existing user
describe('# Wallet - Integration Tests', () => {
	const walletService = new WalletService({
		appSecret: handcashAppSecret,
		appId: handcashAppId,
		env: environments.iae,
	});
	const email = 'myRandomEmail@gmail.com';

	it.skip('should create a new account', async () => {
		const requestId = await walletService.requestSignUpEmailCode(email);
		expect(requestId).toBeTypeOf('string');
		console.log('requestId: ', requestId);
	});

	it.skip('should verify email code for a non-existing account and create it', async () => {
		const verificationCode = '07618790';
		const requestId = 'd1138873-316f-4862-b4fe-43758fafa296';
		const handle = Math.random().toString(36).substring(2, 7).toUpperCase();
		const keyPair = Crypto.generateAuthenticationKeyPair();

		await walletService.verifyEmailCode(requestId, verificationCode, keyPair.publicKey);
		await walletService.createWalletAccount(keyPair.publicKey, email, handle);

		const account = walletService.getWalletAccountFromAuthToken(keyPair.privateKey);
		const depositInfo = await account.wallet.getDepositInfo();
		expect(depositInfo.id).toBeTypeOf('string');
		console.log(depositInfo);
	});

	it.skip('should request sign-in code for an existing account', async () => {
		const requestId = await walletService.requestSignUpEmailCode(email);
		expect(requestId).toBeTypeOf('string');
		console.log('requestId: ', requestId);
	});

	it.skip('should verify email code for an existing account', async () => {
		const verificationCode = '04623599';
		const requestId = '77cf1c35-902f-41f3-9ce8-aeae9ae68472';
		const keyPair = Crypto.generateAuthenticationKeyPair();

		await walletService.verifyEmailCode(requestId, verificationCode, keyPair.publicKey);
		await walletService.activateAccessKey(keyPair.publicKey, email);
		const account = walletService.getWalletAccountFromAuthToken(keyPair.privateKey);
		const depositInfo = await account.wallet.getDepositInfo();
		expect(depositInfo.id).toBeTypeOf('string');
		console.log(depositInfo);
	});
});
