import Wallet from './wallet';
import Items from './items';
import Admin from './admin';
import Account from './account';
import HandCashHttpService from './api/handcash_http_service';

type AdminAuthParams = {
	authToken: string;
	appSecret: string;
	appId: string;
	baseEndpointHandCash: string;
	baseEndpointTrustholder: string;
};

export class AdminAccount extends Account {
	readonly admin: Admin;

	constructor({ wallet, items, admin }: { wallet: Wallet; items: Items; admin: Admin }) {
		super({ wallet, items });
		this.admin = admin;
	}

	static fromAuthToken({
		authToken,
		appSecret,
		appId,
		baseEndpointHandCash,
		baseEndpointTrustholder,
	}: AdminAuthParams): AdminAccount {
		const httpService = new HandCashHttpService({
			authToken,
			baseEndpointHandCash,
			baseEndpointTrustholder,
			appSecret,
			appId,
		});

		return new AdminAccount({
			wallet: new Wallet(httpService),
			items: new Items(httpService),
			admin: new Admin(httpService),
		});
	}
}

export default AdminAccount;
