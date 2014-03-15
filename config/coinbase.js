module.exports.coinbase = {
  oauth: {
    client: process.env.COINBASE_OAUTH_CLIENT,
    secret: process.env.COINBASE_OAUTH_SECRET
  },
  api: {
    key: process.env.COINBASE_API_KEY,
    secret: process.env.COINBASE_API_SECRET
  }
};
