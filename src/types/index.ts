export type Environment = {
	baseEndpointHandCash: string;
	baseEndpointTrustholder: string;
};

export type KeyPair = {
	privateKey: string;
	publicKey: string;
};

export type RequestVerificationCode = { requestId: { requestId: string } };

export type VerificationComplete = {
	isNewUser: boolean;
};

export type Many<E> = {
	items: E[];
};

export type InstrumentCurrencyCode = 'BSV';

export type DenominationCurrencyCode =
	| 'ARS'
	| 'AUD'
	| 'BRL'
	| 'CAD'
	| 'CHF'
	| 'CNY'
	| 'COP'
	| 'CZK'
	| 'DKK'
	| 'EUR'
	| 'GBP'
	| 'HKD'
	| 'JPY'
	| 'KRW'
	| 'MXN'
	| 'NOK'
	| 'NZD'
	| 'PHP'
	| 'RUB'
	| 'SAT'
	| 'SEK'
	| 'SGD'
	| 'THB'
	| 'USD'
	| 'ZAR';

export type PaymentReceiverItem = {
	destination: string;
	amount: number;
	tags?: [];
};

type JsonAttachment = {
	value: object;
	format: 'json';
};

type HexOrBase64Attachment = {
	value: string;
	format: 'hex';
};

export type Attachment = JsonAttachment | HexOrBase64Attachment;

export type PaymentDirection = 'send' | 'receive';

export type TransactionParticipant = {
	id: string;
	type: string;
	alias: string;
	tags: string[];
};

export type PaymentResult = {
	transactionId: string;
	note: string;
	time: number;
	type: PaymentDirection;
	units: number;
	fiatEquivalent: {
		units: number;
		currencyCode: DenominationCurrencyCode;
	};
	currency: {
		code: InstrumentCurrencyCode;
		logoUrl: string;
	};
	participants: TransactionParticipant[];
};

export type PaymentParameters = {
	note?: string;
	currencyCode: InstrumentCurrencyCode;
	denominatedIn?: DenominationCurrencyCode;
	receivers: PaymentReceiverItem[];
	attachment?: Attachment;
};

export type PaymentFilters = {
	from: number;
	to: number;
	type?: 'send' | 'receive';
	fromDate?: string;
	toDate?: string;
	participant?: string;
	tag?: string;
};

export type DepositInfo = {
	id: string;
	alias: string;
	paymail: string;
	base58Address: string;
};

export type ExchangeRate = {
	fiatSymbol: string;
	rate: number;
	exchangeRateVersion: string;
	estimatedExpireDate: string;
};

export type UserBalance = {
	currency: {
		code: InstrumentCurrencyCode;
		logoUrl: string;
	};
	units: number;
	fiatEquivalent: {
		currencyCode: DenominationCurrencyCode;
		units: number;
	};
};

export type TransferItemParameters = {
	destinationsWithOrigins: {
		destination: string;
		origins: string[];
	}[];
};

export interface ItemAttribute {
	name: string;
	value: string;
	displayType: string;
}

export interface ItemAction {
	name: string;
	description: string;
	url: string;
	enabled: boolean;
}

export interface ItemListing {
	id: string;
	status: 'active' | 'sold' | 'canceled';
	currencyCode: string;
	price: number;
	denominatedIn: string;
	fiatEquivalent: {
		amount: number;
		currencyCode: string;
	};
	paymentRequestUrl: string;
	paymentRequestId: string;
	listedAt: Date;
}

export interface ItemPriceAlert {
	amountInUSD: number;
	groupingValue: string;
	itemName: string;
	contentUrl: string;
	collectionName: string;
	appName: string;
	active: boolean;
}

export interface Collection {
	id: string;
	description?: string;
	app: {
		id: string;
		name?: string;
		iconUrl?: string;
	};
	origin?: string;
	name: string;
	attributes?: {
		name: string;
		displayType: string;
		possibleValues?: string[] | number[];
		minValue?: number;
		maxValue?: number;
	}[];
	imageUrl?: string;
	totalQuantity: number;
}

export interface Item {
	id: string;
	description: string;
	collection: Collection | { id: string };
	user: {
		id: string;
		handle: string;
		displayName?: string;
		avatarUrl?: string;
	};
	app: {
		id: string;
		name?: string;
		iconUrl?: string;
	};
	origin: string;
	name: string;
	groupingValue: string;
	imageUrl: string;
	multimediaUrl: string;
	multimediaType: string;
	attributes: ItemAttribute[];
	actions: ItemAction[];
	isListing: boolean;
	itemListing: ItemListing | Record<string, never>;
	count: number;
	isCurrentUser: boolean;
	lastSoldPriceInUsd: number;
	floorPriceInUsd: number;
	externalId: string;
	priceAlert?: ItemPriceAlert;
}

export type ContentType = 'image/png' | 'image/jpg' | 'image/jpeg' | 'image/webp';

export interface ImageMetadata {
	url: string;
	contentType: ContentType;
}

export interface MultimediaMetadata {
	url: string;
	contentType: string;
}

export interface MediaDetails {
	image: ImageMetadata;
	multimedia?: MultimediaMetadata;
}

export interface BaseItemMetadata {
	description?: string;
	name: string;
	groupingValue?: string;
	mediaDetails: MediaDetails;
	user?: string; // ObjectId
}

export interface CreateCollectionMetadata extends BaseItemMetadata {
	totalQuantity?: number;
}

export interface CreateItemMetadata extends BaseItemMetadata {
	quantity?: number;
	attributes?: {
		name: string;
		displayType: string;
		value: string | number;
	}[];
	actions?: {
		name: string;
		description: string;
		url: string;
		enabled?: boolean;
	}[];
	externalId?: string;
}

export type ItemCreationOrderType = 'collection' | 'collectionItem';

export interface ItemsOrder {
	id: string;
	type: ItemCreationOrderType;
	status: 'preparing' | 'pendingPayment' | 'pendingInscriptions' | 'completed';
	error?: string;
	uid?: string;
}

export interface CreateItemsOrderParams {
	items: CreateItemMetadata[] | CreateCollectionMetadata[];
	itemCreationOrderType: ItemCreationOrderType;
	referencedCollection?: string;
	uid?: string;
}

export interface CreateItemsParams {
	items: CreateItemMetadata[];
	referencedCollection?: string;
	uid?: string;
}

export type SortableFields = 'name' | 'lastSoldPriceInUsd' | 'floorPriceInUsd';

export interface GetItemsFilter {
	from?: number;
	to?: number;
	collectionId?: string;
	collectionIds?: string[];
	searchString?: string;
	groupingValue?: string;
	fetchAttributes?: boolean;
	sort?: SortableFields;
	order?: 'asc' | 'desc';
	attributes?: ItemAttribute[];
	appId?: string;
	group?: boolean;
	externalId?: string;
}

export interface TransferItem {
	direction: string;
	origin: string;
	participant: {
		type: string;
		name: string;
	};
}

export interface ItemTransfer {
	referencedUserId: string;
	transactionId: string;
	transferItems: TransferItem[];
}

export interface CraftItemsParams {
	burn: {
		origins: string[];
	};
	issue?: {
		items: CreateItemMetadata[];
		referencedCollection: string;
		uid?: string;
		itemCreationOrderType?: 'collectionItem';
	};
}

export interface CraftItemsOrder {
	itemCreationOrder?: ItemsOrder;
	itemTransfer: ItemTransfer;
}
