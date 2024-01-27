const endpoint = "https://broker-api.sandbox.alpaca.markets/"

async function get(path) {
	const response = await fetch(endpoint + path, {
		method: "GET",
		headers: {
			"Accept": "application/json",
			"Authorization": "Basic " + btoa(process.env.KEY_ID + ":" + process.env.SECRET)
		}
	});

	const data = await response.json();
	return data;
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

	const data = await response.json();
	return data;
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

	const data = await response.json();
	return data;
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

	enable_crypto: async function(id, data) {
		data = {
			"agreements": [
				{
				"agreement": "crypto_agreement",
				"signed_at": "2023-01-01T18:13:44Z",
				"ip_address": "185.13.21.99"
				}
			]
		};

		return patch("/v1/accounts/" + id, data);
	},

	sandbox_deposit: async function(id, amount) {
		const data = {
			"receiver_account_number": id,
			"receiver_routing_code": "123456",
			"amount": amount,
			"currency": "USD"
		};

		return post("/v1beta/demo/banking/funding", data);
	},

	create_ach_relationship: async function(id, data) {
		return post("/v1/accounts/" + id + "/ach_relationships", data);
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

	cancel_order: async function(account, order) {
		return get("/v1/trading/accounts/" + account + "/orders/" + order);
	},

	get_documents: async function(account) {
		return get("/v1/accounts/" + account + "/documents");
	},

	get_portfolio: async function(account, period, timeframe) {
		return get(`/v1/trading/accounts/${account}/account/portfolio/history?period=${period}&timeframe=${timeframe}`);
	},

	
}