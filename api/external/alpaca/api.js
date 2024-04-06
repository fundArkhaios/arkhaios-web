const endpoint = "https://broker-api.sandbox.alpaca.markets"

async function get(path, options) {
	const response = await fetch(endpoint + path, {
		method: "GET",
		headers: {
			"Accept": options?.response == "buffer" ? "" : "application/json",
			"Authorization": "Basic " + btoa(process.env.KEY_ID + ":" + process.env.SECRET)
		}
	});

	let data = response;
	let status = data.status;
	if(options?.response == "buffer") {
		data = await data.arrayBuffer();
	} else {
		data = await data.json();
	}

	return { response: data, status };
}

async function post(path, body) {
	const response = await fetch(endpoint + path, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Accept": "application/json",
			"Authorization": "Basic " + btoa(process.env.KEY_ID + ":" + process.env.SECRET)
		}
	});

	const status = response.status
	const data = await response.json();

	return { response: data, status }
}


async function http(path, method, body) {
	let request = {
		method: method,
		headers: {
			"Accept": "application/json",
			"Authorization": "Basic " + btoa(process.env.KEY_ID + ":" + process.env.SECRET)
		}
	}

	if(body) request.body = JSON.stringify(body);

	const response = await fetch(endpoint + path, request);

	const status = response.status;
	
	let data = null;

	try {
		data = await response.json();
	} catch(e) {}

	return { response: data, status }
}
  
module.exports = {
	// https://docs.alpaca.markets/reference/getallaccounts
	get_accounts: async function() {
		return get("/v1/accounts");
	},

	// https://docs.alpaca.markets/reference/createaccount
	create_account: async function(payload) {
		return post("/v1/accounts", payload);
	},

	// https://docs.alpaca.markets/reference/getassets-1
	get_assets: async function() {
		return get("/v1/assets?status=active");
	},

	// https://docs.alpaca.markets/reference/getassetbysymbolorid-1
	get_asset: async function(id) {
		return get("/v1/asset/" + id);
	},

	// https://docs.alpaca.markets/reference/getaccount
	account_status: async function(id) {
		return get("/v1/accounts/" + id);
	},

	// https://docs.alpaca.markets/reference/patchaccount-1
	enable_crypto: async function(id, ip) {
		data = {
			"agreements": [
				{
				"agreement": "crypto_agreement",
				"signed_at": "2023-01-01T18:13:44Z",
				"ip_address": ip
				}
			]
		};

		return http("/v1/accounts/" + id, "PATCH", data);
	},

	// https://docs.alpaca.markets/reference/createachrelationshipforaccount-1
	create_ach_relationship: async function(id, data) {
		return post("/v1/accounts/" + id + "/ach_relationships", data);
	},

	// https://docs.alpaca.markets/reference/deleteachrelationshipfromaccount-1
	delete_ach_relationship: async function(id, ach_id) {
		return http("/v1/accounts/" + id + "/ach_relationships/" + ach_id, "DELETE");
	},

	// https://docs.alpaca.markets/reference/createjournal-1
	create_journal: async function(data) {
		const payload = {
			to_account: data.to,
			from_account: data.from,
			entry_type: "JNLC",
			amount: data.amount,
		};

		return post("/v1/journals/", payload);
	},

	// https://docs.alpaca.markets/reference/getaccountachrelationships-1
	get_ach_relationships: async function(id) {
		return get("/v1/accounts/" + id + "/ach_relationships");
	},

	// https://docs.alpaca.markets/reference/createtransferforaccount-1
	create_transfer: async function(id, data) {
		return post("/v1/accounts/" + id + "/transfers", data);
	},
	
	// https://docs.alpaca.markets/reference/gettransfersforaccount-1
	get_transfers: async function(id) {
		return get("/v1/accounts/" + id + "/transfers");
	},

	// https://docs.alpaca.markets/reference/createorderforaccount-1
	create_order: async function(account, order) {
		return post("/v1/trading/accounts/" + account + "/orders", order);
	},

	// https://docs.alpaca.markets/reference/getallordersforaccount-1
	get_orders: async function(account, status) {
		return get("/v1/trading/accounts/" + account + "/orders?status=" + status);
	},

	// https://broker-api.alpaca.markets/v1/trading/accounts/{account_id}/orders/{order_id}
	get_order: async function(account, order) {
		return get("/v1/trading/accounts/" + account + "/orders/" + order);
	},
	
	// https://docs.alpaca.markets/reference/deleteorderforaccount-1
	cancel_order: async function(account, order) {
		return get("/v1/trading/accounts/" + account + "/orders/" + order);
	},

	// https://docs.alpaca.markets/reference/getpositionsforaccount-1
	get_positions: async function(account) {
		return get("/v1/trading/accounts/" + account + "/positions");
	},

	// https://docs.alpaca.markets/reference/getpositionsforaccountbysymbol-1
	get_positions_symbol: async function(account, symbol) {
		return get("/v1/trading/accounts/" + account + "/positions/" + symbol);
	},

	// https://docs.alpaca.markets/reference/getdocsforaccount-1
	get_documents: async function(account) {
		return get("/v1/accounts/" + account + "/documents");
	},

	// https://docs.alpaca.markets/reference/downloaddocfromaccount-1
	get_document: async function(account, document) {
		return get("/v1/accounts/" + account + "/documents/" + document + "/download", { "response": "buffer"});
	},

	// https://docs.alpaca.markets/reference/get-v1-trading-accounts-account_id-account-portfolio-history-1
	get_portfolio: async function(account, period, timeframe) {
		return get(`/v1/trading/accounts/${account}/account/portfolio/history?period=${period}&timeframe=${timeframe}`);
	},

	// https://docs.alpaca.markets/reference/gettradingaccount-1
	get_trading_details: async function(account) {
		return get(`/v1/trading/accounts/${account}/account`);
	}
}