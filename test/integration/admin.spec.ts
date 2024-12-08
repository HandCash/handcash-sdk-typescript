import { describe, expect, it } from 'vitest';
import { authToken, handcashAppId, handcashAppSecret } from '../env';
import environments from '../../src/environments';
import HandCashHttpService from '../../src/api/handcash_http_service';
import Admin from '../../src/items_admin';
import { CreateCollectionMetadata, CreateItemMetadata, CreateItemsOrder } from '../../src/types';

const sleep = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

describe('Admin - integration test', () => {
	const adminWallet = new Admin(
		new HandCashHttpService({
			authToken,
			baseEndpointHandCash: environments.iae.baseEndpointHandCash,
			baseEndpointTrustholder: environments.iae.baseEndpointTrustholder,
			appSecret: handcashAppSecret,
			appId: handcashAppId,
		})
	);

	it('should create collection, wait for completion, create items, and verify', async () => {
		// 1. Create collection with metadata
		const collectionMetadata: CreateCollectionMetadata = {
			name: 'Test Collection',
			description: 'A test collection for integration testing',
			mediaDetails: {
				image: {
					url: 'https://placehold.co/600x400',
					contentType: 'image/png',
				},
			},
		};

		const collectionOrder = await adminWallet.createCollectionOrder(collectionMetadata);
		expect(collectionOrder.id).toBeDefined();

		// 2. Wait and check order status
		let orderComplete = false;
		let attempts = 0;
		let order: CreateItemsOrder | null = null;

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
		expect(collectionItems).toHaveLength(1);
		const collectionId = collectionItems[0]?.id as string;

		// 3. Create items in the collection
		const itemMetadata: CreateItemMetadata[] = [
			{
				name: 'Test Item 1',
				description: 'First test item',
				quantity: 1,
				mediaDetails: {
					image: {
						url: 'https://placehold.co/400x300',
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
				rarity: 'rare',
			},
			{
				name: 'Test Item 2',
				description: 'Second test item',
				quantity: 1,
				mediaDetails: {
					image: {
						url: 'https://placehold.co/400x300',
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
				rarity: 'common',
			},
		];

		const itemsOrder = await adminWallet.createItemsOrder({
			collectionId,
			items: itemMetadata,
			uid: 'test-batch-001',
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
		const items = await adminWallet.getOrderItems(itemsOrder.id);
		expect(items).toHaveLength(2);

		// Get first item by origin
		const firstItemOrigin = items[0]?.origin as string;
		const itemByOrigin = await adminWallet.getItemByOrigin(firstItemOrigin);
		expect(itemByOrigin).toBeDefined();
		expect(itemByOrigin.name).toBe('Test Item 1');
	}, 30000);
});
