const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  // Auto reconnect if connection is lost
  autoReconnect: true,
  // Keep retrying for 60 seconds
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  // Maintain up to 10 socket connections
  poolSize: 10,
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferCommands: false,
};

module.exports = mongoConfig;
