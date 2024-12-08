import Wallet from './wallet';
import HandCashHttpService from './api/handcash_http_service';
import Items from './items';
import Admin from './admin';

type Params = {
	authToken: string;
	appSecret: string;
	appId: string;
	baseEndpointHandCash: string;
	baseEndpointTrustholder: string;
	isAdmin?: boolean;
};

export default class Account {
	wallet: Wallet;

	items: Items;

	admin?: Admin;

	constructor({ wallet, items, admin }: { wallet: Wallet; items: Items; admin?: Admin }) {
		this.wallet = wallet;
		this.items = items;
		this.admin = admin;
	}

	static fromAuthToken({
		authToken,
		appSecret,
		appId,
		baseEndpointHandCash,
		baseEndpointTrustholder,
		isAdmin,
	}: Params) {
		const httpService = new HandCashHttpService({
			authToken,
			baseEndpointHandCash,
			baseEndpointTrustholder,
			appSecret,
			appId,
		});
		return new Account({
			wallet: new Wallet(httpService),
			items: new Items(httpService),
			admin: isAdmin ? new Admin(httpService) : undefined,
		});
	}
}
