module.exports = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'your-access-secret-key-change-in-production',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key-change-in-production',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d'
  };