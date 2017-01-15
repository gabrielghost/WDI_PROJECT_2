module.exports = {
  port: process.env.PORT || 3000,
  db: 'mongodb://localhost/monzo-heatmap',
  secret: process.env.SECRET || 'money is energy',
  clientId: process.env.MONZO_CLIENT_ID || 'this is not working',
  clientSecret: process.env.MONZO_CLIENT_SECRET,
  redirect_uri: 'http%3A%2F%2Flocalhost%3A7000%2Fcallback',
  redirect_uri_r: 'http://localhost:7000/callback'
};
