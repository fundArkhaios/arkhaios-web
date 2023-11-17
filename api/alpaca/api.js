
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
	return data
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
	return data
}

module.exports = {
	get_accounts: async function() {
		return get("/v1/accounts");
	},

    create_account: async function(payload) {
		return post("/v1/accounts", payload);
    },

    get_assets: async function() {
        return get("/v1/accounts");
    },

	account_status: async function(id) {
		return get("/v1/accounts/" + id);
	},

	create_order: async function(account, order) {
		return post("/v1/trading/accounts/" + account + "/orders", order);
	},

	get_orders: async function(account) {
		return get("/v1/trading/accounts/" + account + "/orders");
	},

	get_positions: async function(account) {
		return get("/v1/trading/accounts/" + account + "/positions");
	},

	cancel_order: async function(account, order) {
		return get("/v1/trading/accounts/" + account + "/orders/" + order);
	},

	get_portfolio: async function(account, period, timeframe) {
		return get(`/v1/trading/accounts/${account}/account/portfolio/history?period=${period}&timeframe=${timeframe}`);
	}
}