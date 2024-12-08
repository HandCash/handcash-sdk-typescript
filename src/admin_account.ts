import Wallet from './wallet';
import Items from './items';
import ItemsAdmin from './items_admin';
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
	readonly admin: ItemsAdmin;

	constructor({ wallet, items, admin }: { wallet: Wallet; items: Items; admin: ItemsAdmin }) {
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
			admin: new ItemsAdmin(httpService),
		});
	}
}

export default AdminAccount;
