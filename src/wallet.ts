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
	GetItemsFilter,
	TransferItemParameters,
	NewBurnAndCreateItemsOrder,
} from './types';

export default class Wallet {
	httpService: HandCashHttpService;

	constructor(handCashService: HandCashHttpService) {
		this.httpService = handCashService;
	}

	async getDepositInfo(): Promise<DepositInfo> {
		return this.httpService.getDepositInfo();
	}

	async getTotalBalance(): Promise<Many<UserBalance>> {
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

	/**
	 * Get user's item inventory
	 */
	async getItemInventory(filter: GetItemsFilter) {
		return this.httpService.getItemInventory(filter);
	}

	/**
	 * Get user's item listings for sale
	 */
	async getItemListings(filter: GetItemsFilter) {
		return this.httpService.getItemListings(filter);
	}

	/**
	 * Transfer items to other users
	 */
	async transferItems(params: TransferItemParameters) {
		return this.httpService.transferItems(params);
	}

	/**
	 * Burn and create items order
	 */
	async burnAndCreateItems(params: NewBurnAndCreateItemsOrder) {
		return this.httpService.burnAndCreateItems(params);
	}
}
