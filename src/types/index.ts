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
