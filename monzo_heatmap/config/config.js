module.exports = {
  port: process.env.PORT || 3000,
  db: 'mongodb://localhost/monzo-heatmap',
  secret: process.env.SECRET || 'money is energy',
  clientId: process.env.MONZO_CLIENT_ID || 'this is not working',
  clientSecret: 'MVKUHgeLLnTeQ8eFqWNLbSTphaLJ4G8PQTZcGbXo2eZApnOtoJj5pHHtLobjTI835LwfkWHJpBV3gQ8HUDtg',
  redirect_uri: 'http%3A%2F%2Flocalhost%3A7000%2Fcallback'
};
