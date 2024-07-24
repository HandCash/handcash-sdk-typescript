import HandCashHttpService from './api/handcash_http_service';
import {
	DenominationCurrencyCode,
	DepositInfo,
	ExchangeRate,
	Many,
	PaymentFilters,
	PaymentParameters,
	PaymentResult,
	UserBalance,
} from './types';

export default class Wallet {
	httpService: HandCashHttpService;

	constructor(handCashService: HandCashHttpService) {
		this.httpService = handCashService;
	}

	async getDepositInfo(): Promise<DepositInfo> {
		return this.httpService.getDepositInfo();
	}

	async getTotalBalance(): Promise<UserBalance> {
		return this.httpService.getTotalBalance();
	}

	async pay(paymentParameters: PaymentParameters): Promise<PaymentResult> {
		return this.httpService.pay(paymentParameters);
	}

	async getPayment(transactionId: string): Promise<PaymentResult> {
		return this.httpService.getPayment(transactionId);
	}

	async getPaymentHistory(filters: PaymentFilters): Promise<Many<PaymentResult>> {
		return this.httpService.getPayments(filters);
	}

	async getExchangeRate(currencyCode: DenominationCurrencyCode): Promise<ExchangeRate> {
		return this.httpService.getExchangeRate(currencyCode);
	}
}
