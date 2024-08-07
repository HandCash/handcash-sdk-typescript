const Environments = {
	prod: {
		baseEndpointHandCash: 'https://cloud.handcash.io',
		baseEndpointTrustholder: 'https://trust.hastearcade.com',
	},
	qae: {
		baseEndpointHandCash: 'https://qae.cloud.handcash.io',
		baseEndpointTrustholder: 'https://trustholder-service.qae.cloud.handcash.io',
	},
	iae: {
		baseEndpointHandCash: 'https://iae.cloud.handcash.io',
		baseEndpointTrustholder: 'https://trustholder-service.iae.cloud.handcash.io',
	},
};

export default Environments;
