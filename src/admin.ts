import HandCashHttpService from './api/handcash_http_service';
import { CreateItemsParams, CreateCollectionMetadata } from './types';

export default class Admin {
	httpService: HandCashHttpService;

	constructor(handCashService: HandCashHttpService) {
		this.httpService = handCashService;
	}

	/**
	 * Get order by ID
	 */
	async getItemOrder(orderId: string) {
		return this.httpService.getItemOrder(orderId);
	}

	/**
	 * Get completed order's items
	 */
	async getOrderItems(orderId: string) {
		return this.httpService.getOrderItems(orderId);
	}

	/**
	 * Get item by origin
	 */
	async getItemByOrigin(origin: string) {
		return this.httpService.getItemByOrigin(origin);
	}

	/**
	 * Create and issue items order for a collection
	 */
	async createCollectionOrder(collectionMetadata: CreateCollectionMetadata) {
		return this.httpService.createItemsOrder({
			items: [collectionMetadata],
			itemCreationOrderType: 'collection',
		});
	}

	/**
	 * Create and issue items order for items in a collection
	 */
	async createItemsOrder(params: CreateItemsParams) {
		return this.httpService.createItemsOrder({
			items: params.items,
			itemCreationOrderType: 'collectionItem',
			referencedCollection: params.referencedCollection,
			uid: params.uid,
		});
	}
}
