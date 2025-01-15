import { describe, expect, it } from 'vitest';
import { authToken, handcashAppId, handcashAppSecret } from '../env';
import environments from '../../src/environments';
import HandCashHttpService from '../../src/api/handcash_http_service';
import Admin from '../../src/admin';
import { CreateCollectionMetadata, CreateItemMetadata, ItemsOrder } from '../../src/types';
import ItemsWallet from '../../src/items';

const sleep = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

describe('Admin - integration test', () => {
	const httpsService = new HandCashHttpService({
		authToken,
		baseEndpointHandCash: environments.iae.baseEndpointHandCash,
		baseEndpointTrustholder: environments.iae.baseEndpointTrustholder,
		appSecret: handcashAppSecret,
		appId: handcashAppId,
	});
	const adminWallet = new Admin(httpsService);
	const userWallet = new ItemsWallet(httpsService);

	/**
	 * 
	 *  ✓ test/integration/admin.spec.ts (1) 9228ms

 		Test Files  1 passed (1)
      	Tests  1 passed (1)
   		Start at  12:32:05
   		Duration  10.13s (transform 436ms, setup 0ms, collect 122ms, tests 9.23s)
		12/14/2024 on IAE
	 */
	it.skip('should create collection, wait for completion, create items, and verify', async () => {
		// 1. Create collection with metadata
		const collectionMetadata: CreateCollectionMetadata = {
			name: 'Test Collection',
			description: 'A test collection for integration testing',
			mediaDetails: {
				image: {
					url: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1640100510/juy5hd3smy68a0k7ojo1.jpg',
					contentType: 'image/png',
				},
			},
		};

		const collectionOrder = await adminWallet.createCollectionOrder(collectionMetadata);
		expect(collectionOrder.id).toBeDefined();

		// 2. Wait and check order status
		let orderComplete = false;
		let attempts = 0;
		let order: ItemsOrder | null = null;

		while (!orderComplete && attempts < 5) {
			// eslint-disable-next-line no-await-in-loop
			await sleep(3000);
			// eslint-disable-next-line no-await-in-loop
			order = await adminWallet.getItemOrder(collectionOrder.id);

			if (order.status === 'completed') {
				orderComplete = true;
				break;
			}
			attempts += 1;
		}

		expect(orderComplete).toBe(true);
		expect(order?.status).toBe('completed');

		// Get collection items to get collection ID
		const collectionItems = await adminWallet.getOrderItems(collectionOrder.id);
		expect(collectionItems.items).toHaveLength(1);
		const referencedCollection = collectionItems.items[0]?.id as string;

		// 3. Create items in the collection
		const itemMetadata: CreateItemMetadata[] = [
			{
				name: 'Test Item 1',
				description: 'First test item',
				quantity: 1,
				mediaDetails: {
					image: {
						url: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1640100510/juy5hd3smy68a0k7ojo1.jpg',
						contentType: 'image/png',
					},
				},
				attributes: [
					{
						name: 'trait',
						value: 'special',
						displayType: 'string',
					},
					{
						name: 'power',
						value: 'high',
						displayType: 'string',
					},
				],
				actions: [],
			},
			{
				name: 'Test Item 2',
				description: 'Second test item',
				quantity: 1,
				mediaDetails: {
					image: {
						url: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1640100510/juy5hd3smy68a0k7ojo1.jpg',
						contentType: 'image/png',
					},
				},
				attributes: [
					{
						name: 'trait',
						value: 'normal',
						displayType: 'string',
					},
					{
						name: 'power',
						value: 'medium',
						displayType: 'string',
					},
				],
				actions: [],
			},
		];

		const itemsOrder = await adminWallet.createItemsOrder({
			referencedCollection,
			items: itemMetadata,
		});
		expect(itemsOrder.id).toBeDefined();

		// Wait for items order completion
		orderComplete = false;
		attempts = 0;
		order = null;

		while (!orderComplete && attempts < 3) {
			// eslint-disable-next-line no-await-in-loop
			await sleep(3000);
			// eslint-disable-next-line no-await-in-loop
			order = await adminWallet.getItemOrder(itemsOrder.id);

			if (order.status === 'completed') {
				orderComplete = true;
				break;
			}
			attempts += 1;
		}

		expect(orderComplete).toBe(true);
		expect(order?.status).toBe('completed');

		// Get the created items
		const { items } = await adminWallet.getOrderItems(itemsOrder.id);
		expect(items).toHaveLength(2);

		// Get first item by origin
		const firstItemOrigin = items[0]?.origin as string;
		const itemByOrigin = await adminWallet.getItemByOrigin(firstItemOrigin);
		expect(itemByOrigin).toBeDefined();
		expect(itemByOrigin.name).toBe('Test Item 1');

		// transfer
		const itemTransfer = await userWallet.transferItems({
			destinationsWithOrigins: [
				{
					destination: 'rafa',
					origins: [firstItemOrigin],
				},
			],
		});
		expect(itemTransfer).toBeDefined();
	}, 30000);
});
