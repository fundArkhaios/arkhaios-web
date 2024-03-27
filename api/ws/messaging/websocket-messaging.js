let activeWebSocketConnections = {};

// Registers a WebSocket connection for a specific user
function registerWebSocketForUser(userId, webSocket) {
    activeWebSocketConnections[userId] = webSocket;
}
  
// Retrieves the WebSocket connection for a specific user
function getUserWebSocket(userId) {
    const ws = activeWebSocketConnections[userId];  // Assuming userWebSocketMap is a map of userId to WebSocket
    console.log(`WebSocket for user ${userId}:`, ws ? "Found" : "Not found");
    return ws;
}
  
  // Removes the WebSocket connection for a user
  function removeWebSocketForUser(userId) {
    delete activeWebSocketConnections[userId];
  }

module.exports = {
    registerWebSocketForUser,
    getUserWebSocket,
    removeWebSocketForUser
};