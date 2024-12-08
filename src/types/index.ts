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

export type ItemAttributeMetadata = {
	name: string;
	value: string | number;
	displayType: 'string' | 'number' | 'date' | 'boostPercentage' | 'boostNumber';
};

export type MediaDetails = {
	image?: {
		url: string;
		contentType: string;
		imageHighResUrl?: string;
	};
	multimedia?: {
		url: string;
		contentType: string;
		imageHighResUrl?: string;
	};
};

export type Royalty = {
	type: string;
	percentage: number;
	destination: string;
};

export type Action = {
	name: string;
	description: string;
	url: string;
	enabled: boolean;
};

export type CreateItemMetadata = {
	name: string;
	user?: string;
	description?: string;
	rarity?: string;
	quantity: number;
	color?: string;
	attributes: ItemAttributeMetadata[];
	mediaDetails: MediaDetails;
	origin?: string;
	royalties?: Royalty[];
	actions: Action[];
	groupingValue?: string;
	externalId?: string;
};

export type CreateItemsOrderParams = {
	collectionId: string;
	items: CreateItemMetadata[];
	uid?: string;
};

export type NewBurnAndCreateItemsOrder = {
	issue?: CreateItemsOrderParams;
	burn: {
		origins: string[];
	};
};

export type GetItemsFilter = {
	from?: number;
	to?: number;
	collectionId?: string;
	searchString?: string;
	groupingValue?: string;
	fetchAttributes?: boolean;
	sort?: 'name';
	order?: 'asc' | 'desc';
	attributes?: ItemAttributeMetadata[];
	appId?: string;
	group?: boolean;
	externalId?: string;
};

export type TransferItemParameters = {
	destinationsWithOrigins: {
		destination: string;
		origins: string[];
	}[];
};

export type CreateCollectionMetadata = {
	name: string;
	description?: string;
	mediaDetails: MediaDetails;
};

export type ItemCreationOrderType = 'collectionItem' | 'collection';

export type CreateItemsOrder = {
	id: string;
	type: ItemCreationOrderType;
	status: 'preparing' | 'pendingPayment' | 'pendingInscriptions' | 'completed';
	collectionOrdinalId?: string;
	items: CreateItemMetadata[] | CreateCollectionMetadata[];
	payment?: {
		paymentRequestId: string;
		paymentRequestUrl: string;
		amountInUSD: number;
		transactionId: string;
		isConfirmed: boolean;
	};
	pendingInscriptions?: number;
	error?: string;
	uid?: string;
};

export type Item = {
	id: string;
	name: string;
	description?: string;
	rarity?: string;
	quantity: number;
	color?: string;
	attributes: ItemAttributeMetadata[];
	mediaDetails: MediaDetails;
	origin: string;
	royalties?: Royalty[];
	actions: Action[];
	groupingValue?: string;
	externalId?: string;
	collectionId?: string;
};

export type TransferItemResult = {
	id: string;
	status: 'pending' | 'completed' | 'failed';
	error?: string;
};
