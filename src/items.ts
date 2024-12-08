import HandCashHttpService from './api/handcash_http_service';
import { GetItemsFilter, TransferItemParameters, NewBurnAndCreateItemsOrder } from './types';

export default class Items {
	httpService: HandCashHttpService;

	constructor(handCashService: HandCashHttpService) {
		this.httpService = handCashService;
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
