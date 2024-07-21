import Account from './account';
import Environments from './environments';
import HandCashHttpService from './api/handcash_http_service';
import {Environment} from "./types";

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

    constructor({appId, appSecret, env}: Params) {
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

    verifyEmailCode(requestId: string, verificationCode: string, accessPublicKey: string): Promise<void> {
        return this.httpService.verifyEmailCode(requestId, verificationCode, accessPublicKey);
    }

    async createWalletAccount(accessPublicKey: string, email: string, referrerAlias?: string): Promise<void> {
        await this.httpService.createNewAccount(accessPublicKey, email, referrerAlias);
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
}
