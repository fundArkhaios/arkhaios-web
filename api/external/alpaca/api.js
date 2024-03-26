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

async function patch(path, body) {
	const response = await fetch(endpoint + path, {
		method: "PATCH",
		body: JSON.stringify(body),
		headers: {
			"Accept": "application/json",
			"Authorization": "Basic " + btoa(process.env.KEY_ID + ":" + process.env.SECRET)
		}
	});

	const status = response.status

	const data = await response.json();
	return { response: data, status };
}
  
module.exports = {
	get_accounts: async function() {
		return get("/v1/accounts");
	},

	create_account: async function(payload) {
		return post("/v1/accounts", payload);
	},

	get_assets: async function() {
		return get("/v1/assets?status=active");
	},

	get_asset: async function(id) {
		return get("/v1/asset/" + id);
	},

	account_status: async function(id) {
		return get("/v1/accounts/" + id);
	},

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

		return patch("/v1/accounts/" + id);
	},

	create_ach_relationship: async function(id, data) {
		return post("/v1/accounts/" + id + "/ach_relationships", data);
	},

	create_journal: async function(data) {
		console.log(data);
		const payload = {
			to_account: data.to,
			from_account: data.from,
			entry_type: "JNLC",
			amount: data.amount,
		};

		console.log(payload);

		return post("/v1/journals/", payload);
	},

	get_ach_relationships: async function(id) {
		return get("/v1/accounts/" + id + "/ach_relationships");
	},

	create_transfer: async function(id, data) {
		return post("/v1/accounts/" + id + "/transfers", data);
	},
	
	get_transfers: async function(id) {
		return get("/v1/accounts/" + id + "/transfers");
	},

	create_order: async function(account, order) {
		return post("/v1/trading/accounts/" + account + "/orders", order);
	},

	get_documents: async function(account) {
		return post("/v1/acounts/" + account + "/documents", order);
	},

	get_orders: async function(account, status) {
		return get("/v1/trading/accounts/" + account + "/orders?status=" + status);
	},

	get_positions: async function(account) {
		return get("/v1/trading/accounts/" + account + "/positions");
	},

	// https://docs.alpaca.markets/reference/getpositionsforaccountbysymbol-1
	get_positions_symbol: async function(account, symbol) {
		return get("/v1/trading/accounts/" + account + "/positions/" + symbol);
	},

	cancel_order: async function(account, order) {
		return get("/v1/trading/accounts/" + account + "/orders/" + order);
	},

	get_documents: async function(account) {
		return get("/v1/accounts/" + account + "/documents");
	},

	get_document: async function(account, document) {
		return get("/v1/accounts/" + account + "/documents/" + document + "/download", { "response": "buffer"});
	},

	get_portfolio: async function(account, period, timeframe) {
		return get(`/v1/trading/accounts/${account}/account/portfolio/history?period=${period}&timeframe=${timeframe}`);
	},

	get_trading_details: async function(account) {
		return get(`/v1/trading/accounts/${account}/account`);
	}
}
