module.exports = {
    route: '/ws-demo',
    authenticate: true,
    websocket: async function(ws, req, user) {
        if(!user) {
            ws.send(JSON.stringify({error: "forbidden"}));
            ws.close()
        }

        ws.on('message', async (message) => {
            console.log(req.cookies.email)
            const msg = message;
            ws.send(JSON.stringify({ type: 'message', data: msg, user: user}));
        });
    }
}