import Wallet from './wallet';
import HandCashHttpService from './api/handcash_http_service';
import Items from './items';

type Params = {
	authToken: string;
	appSecret: string;
	appId: string;
	baseEndpointHandCash: string;
	baseEndpointTrustholder: string;
};

export default class Account {
	wallet: Wallet;

	items: Items;

	constructor({ wallet, items }: { wallet: Wallet; items: Items }) {
		this.wallet = wallet;
		this.items = items;
	}

	static fromAuthToken({
		authToken,
		appSecret,
		appId,
		baseEndpointHandCash,
		baseEndpointTrustholder,
	}: Params): Account {
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
		});
	}
}
