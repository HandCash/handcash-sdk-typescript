import Wallet from "./wallet";
import HandCashHttpService from "./api/handcash_http_service";

type Params = {
    authToken: string;
    appSecret: string;
    appId: string;
    baseEndpointHandCash: string;
    baseEndpointTrustholder: string;
};

export default class Account {
    wallet: Wallet;

    constructor({wallet}: { wallet: Wallet }) {
        this.wallet = wallet;
    }

    static fromAuthToken({authToken, appSecret, appId, baseEndpointHandCash, baseEndpointTrustholder}: Params) {
        const httpService = new HandCashHttpService({
            authToken,
            baseEndpointHandCash: baseEndpointHandCash,
            baseEndpointTrustholder: baseEndpointTrustholder,
            appSecret,
            appId,
        });
        return new Account({
            wallet: new Wallet(httpService),
        });
    }
}
