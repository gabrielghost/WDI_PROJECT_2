module.exports = {
  port: process.env.PORT || 3000,
  db: process.env.MONGODB_URI || 'mongodb://localhost/monzo-heatmap',
  secret: process.env.SECRET || 'money is energy',
  clientId: process.env.MONZO_CLIENT_ID || 'this is not working',
  clientSecret: process.env.MONZO_CLIENT_SECRET,
  redirect_uri: 'https%3A%2F%2Fmonzo-heatmap%2Eherokuapp%2Ecom%2Fcallback',
  redirect_uri_r: 'https://monzo-heatmap.herokuapp.com/callback'
};
