import Account from './account';
import Environments from './environments';
import HandCashHttpService from './api/handcash_http_service';
import { Environment, DepositInfo, VerificationComplete } from './types';

type Params = {
	appId: string;
	appSecret: string;
	env?: Environment;
};

export default class WalletService {
	appId: string;

	appSecret: string;

	httpService: HandCashHttpService;

	env: Environment;

	constructor({ appId, appSecret, env }: Params) {
		this.appId = appId;
		this.appSecret = appSecret;
		this.env = env ?? Environments.prod;
		this.httpService = new HandCashHttpService({
			appId: this.appId,
			appSecret: this.appSecret,
			baseEndpointHandCash: this.env.baseEndpointHandCash,
			baseEndpointTrustholder: this.env.baseEndpointTrustholder,
		});
	}

	requestSignInEmailCode(email: string, customEmailParameters?: object): Promise<string> {
		return this.httpService.requestEmailCode(email, customEmailParameters);
	}

	requestSignUpEmailCode(email: string, customEmailParameters?: object): Promise<string> {
		return this.httpService.requestEmailCode(email, customEmailParameters);
	}

	verifyEmailCode(
		requestId: string,
		verificationCode: string,
		accessPublicKey: string
	): Promise<VerificationComplete> {
		return this.httpService.verifyEmailCode(requestId, verificationCode, accessPublicKey);
	}

	async createWalletAccount(accessPublicKey: string, email: string, alias: string): Promise<void> {
		await this.httpService.createNewAccount(accessPublicKey, email, alias);
	}

	async isAliasAvailable(alias: string): Promise<boolean> {
		const isValidAlias = /^(?=.*[a-zA-Z0-9])[\w\-.]{4,50}$/.test(alias);
		if (!isValidAlias) {
			throw new Error(
				'Invalid alias. The alias must be between 4 and 50 characters long and can only contain letters, numbers, hyphens, underscores, and periods.'
			);
		}
		const result = await this.httpService.getAliasAvailability(alias);
		return result.availability === 'AVAILABLE';
	}

	getWalletAccountFromAuthToken(authToken: string): Account {
		return Account.fromAuthToken({
			authToken,
			appSecret: this.appSecret,
			appId: this.appId,
			baseEndpointHandCash: this.env.baseEndpointHandCash,
			baseEndpointTrustholder: this.env.baseEndpointTrustholder,
		});
	}

	getDepositInfo(): Promise<DepositInfo> {
		return this.httpService.getDepositInfo();
	}
}
