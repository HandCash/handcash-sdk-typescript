import { nanoid } from 'nanoid';
import { secp256k1 } from '@noble/curves/secp256k1';
import { createHash } from 'node:crypto';
import { PrivKey } from '@noble/curves/abstract/utils';
import assert from 'assert';
import {
	DenominationCurrencyCode,
	DepositInfo,
	ExchangeRate,
	Many,
	PaymentFilters,
	PaymentParameters,
	PaymentResult,
	RequestVerificationCode,
	UserBalance,
} from '../types';
import HandCashApiError from './handcash_api_error';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type QueryParams = Record<string, string>;
export type HttpBody = Record<string, unknown>;

type Params = {
	authToken?: string;
	appSecret: string;
	appId: string;
	baseEndpointHandCash: string;
	baseEndpointTrustholder: string;
};

export default class HandCashHttpService {
	appId: string;

	appSecret: string;

	privateKey: PrivKey | undefined;

	baseEndpointHandCash: string;

	baseEndpointTrustholder: string;

	constructor({ appId, appSecret, authToken, baseEndpointHandCash, baseEndpointTrustholder }: Params) {
		assert(!!appId, 'Missing appId');
		assert(!!appSecret, 'Missing appSecret');
		assert(!authToken || secp256k1.utils.isValidPrivateKey(authToken), 'Invalid authToken');
		this.privateKey = authToken;
		this.appSecret = appSecret;
		this.appId = appId;
		this.baseEndpointHandCash = baseEndpointHandCash;
		this.baseEndpointTrustholder = baseEndpointTrustholder;
	}

	getRequest(method: HttpMethod, endpoint: string, body: HttpBody = {}, queryParameters: QueryParams = {}): Request {
		const timestamp = new Date().toISOString();
		const nonce = nanoid();
		const serializedBody = JSON.stringify(body) === '{}' ? '' : JSON.stringify(body);
		const encodedEndpoint = HandCashHttpService.getEncodedEndpoint(endpoint, queryParameters);
		const headers: Record<string, string> = {
			'app-id': this.appId,
			...(this.appSecret && { 'app-secret': this.appSecret }),
			consumer: 'connect-sdk',
			'content-type': 'application/json',
		};
		if (this.privateKey) {
			const publicKey = secp256k1.getPublicKey(this.privateKey);
			headers['oauth-publickey'] = Buffer.from(publicKey).toString('hex');
			headers['oauth-timestamp'] = timestamp.toString();
			headers['oauth-nonce'] = nonce;
			headers['oauth-signature'] = HandCashHttpService.getRequestSignature(
				method,
				encodedEndpoint,
				serializedBody,
				timestamp,
				this.privateKey,
				nonce
			);
		}
		return {
			url: this.baseEndpointHandCash + encodedEndpoint,
			method,
			headers,
			...(method !== 'GET' && { body: serializedBody }),
		} as unknown as Request;
	}

	getTrustholderRequest(
		method: HttpMethod,
		endpoint: string,
		body: HttpBody,
		queryParameters: QueryParams = {}
	): Request {
		const encodedEndpoint = HandCashHttpService.getEncodedEndpoint(endpoint, queryParameters);
		return {
			url: this.baseEndpointTrustholder + encodedEndpoint,
			method,
			headers: { 'content-type': 'application/json' },
			...(method !== 'GET' && { body: JSON.stringify(body) }),
		} as unknown as Request;
	}

	static getEncodedEndpoint(endpoint: string, queryParameters: QueryParams) {
		const url = new URL(endpoint, 'http://localhost');
		Object.entries(queryParameters).forEach(([key, value]) => {
			url.searchParams.append(key, value);
		});
		return url.toString().replace('http://localhost', '');
	}

	static getRequestSignature(
		method: HttpMethod,
		endpoint: string,
		serializedBody: string | undefined,
		timestamp: string,
		privateKey: PrivKey,
		nonce: string
	): string {
		const signaturePayload = HandCashHttpService.getRequestSignaturePayload(
			method,
			endpoint,
			serializedBody,
			timestamp,
			nonce
		);
		const payloadHash = createHash('sha256').update(signaturePayload).digest('hex');
		return secp256k1.sign(payloadHash, privateKey).toDERHex(true);
	}

	static getRequestSignaturePayload(
		method: HttpMethod,
		endpoint: string,
		serializedBody: string | undefined,
		timestamp: string,
		nonce: string
	) {
		return `${method}\n${endpoint}\n${timestamp}\n${serializedBody}${nonce ? `\n${nonce}` : ''}`;
	}

	async getTotalBalance() {
		const requestParameters = this.getRequest('GET', '/v1/waas/wallet/balances');
		return HandCashHttpService.handleRequest<Many<UserBalance>>(requestParameters, new Error().stack);
	}

	async getDepositInfo() {
		const requestParameters = this.getRequest('GET', '/v1/waas/wallet/depositInfo');
		return HandCashHttpService.handleRequest<DepositInfo>(requestParameters, new Error().stack);
	}

	async pay(paymentParameters: PaymentParameters) {
		const requestParameters = this.getRequest('POST', '/v1/waas/wallet/pay', paymentParameters);
		return HandCashHttpService.handleRequest<PaymentResult>(requestParameters, new Error().stack);
	}

	async getPayment(transactionId: string) {
		const requestParameters = this.getRequest('GET', '/v1/waas/wallet/transaction', {}, { transactionId });
		return HandCashHttpService.handleRequest<PaymentResult>(requestParameters, new Error().stack);
	}

	async getPayments(filters: PaymentFilters) {
		const queryParams: QueryParams = {
			from: filters.from.toString(),
			to: filters.to.toString(),
		};

		const requestParameters = this.getRequest('GET', '/v1/waas/wallet/transactions', {}, queryParams);
		return HandCashHttpService.handleRequest<Many<PaymentResult>>(requestParameters, new Error().stack);
	}

	async getExchangeRate(currencyCode: DenominationCurrencyCode) {
		const requestParameters = this.getRequest('GET', `/v1/waas/wallet/exchangeRate/${currencyCode}`);
		return HandCashHttpService.handleRequest<ExchangeRate>(requestParameters, new Error().stack);
	}

	async requestEmailCode(email: string, customEmailParameters?: object): Promise<string> {
		const requestParameters = this.getRequest('POST', '/v1/waas/account/requestEmailCode', {
			email,
			customEmailParameters,
		});
		return (await HandCashHttpService.handleRequest<RequestVerificationCode>(requestParameters, new Error().stack))
			.requestId.requestId;
	}

	async verifyEmailCode(requestId: string, verificationCode: string, publicKey: string) {
		const requestParameters = this.getTrustholderRequest('POST', `/auth/verifyCode`, {
			requestId,
			verificationCode,
			publicKey,
		});
		return HandCashHttpService.handleRequest<void>(requestParameters, new Error().stack);
	}

	async createNewAccount(accessPublicKey: string, email: string, alias: string) {
		const requestParameters = this.getRequest('POST', '/v1/waas/account', {
			accessPublicKey,
			email,
			alias,
		});
		return HandCashHttpService.handleRequest(requestParameters, new Error().stack);
	}

	async getAliasAvailability(alias: string) {
		const requestParameters = this.getRequest('GET', `/v1/waas/account/aliasAvailability/${alias}`);
		return HandCashHttpService.handleRequest<{ availability: 'AVAILABLE' | 'UNAVAILABLE' }>(
			requestParameters,
			new Error().stack
		);
	}

	static async handleRequest<T>(request: Request, stack: string | undefined) {
		const response = await fetch(request.url, request);
		if (response.ok) {
			return (await response.json()) as T;
		}
		throw await HandCashHttpService.handleApiError({ response, request, stack });
	}

	static async handleApiError({
		response,
		request,
		stack,
	}: {
		request: Request;
		response: Response;
		stack: string | undefined;
	}): Promise<Error> {
		let responseData;
		if (response.headers.get('content-type')?.includes('application/json')) {
			try {
				responseData = await response.json();
			} catch (error) {
				responseData = response.bodyUsed ? (error as any).toString() : await response.text();
			}
		}
		responseData ??= response.bodyUsed && (await response.text());
		return new HandCashApiError({
			method: request.method,
			path: request.url,
			httpStatusCode: response.status,
			message: responseData.message ?? responseData,
			info: responseData.info,
			stack,
		});
	}
}
