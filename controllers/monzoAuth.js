const config    = require('../config/config');
const rp        = require('request-promise');

function monzoReroute(req, res){
  var url = config.clientId;
  return res.json({ url });
}

function monzoLogin(req, res){
  console.log('login function');
}

function monzoAuth(req, res){
  const options = {
    method: 'POST',
    uri: 'https://api.monzo.com/oauth2/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      grant_type: 'authorization_code',
      client_id: 'oauthclient_00009GQFzUZc3Q5NooWqXJ',
      client_secret: 'xQkepAr8iYrozzB5grwuMDmDQf8iB5bfB2LYcdJAgp0YE5zAMh6Bm6gd0krS0cXzJ4iS893g3eW+UxjBxqdg',
      redirect_uri: config.redirect_uri_r,
      code: req.query.code
    }
  };

  rp(options)
    .then(function(parsedBody) {
      const json = JSON.parse(parsedBody);
      return res.status(200).json(json);
    })
    .catch(function(err) {
      console.log(err);
      return res.sendStatus(500);
    });
}

function initReq(req, res){
  console.log(req.body.client_Id)
  console.log(req.body.monzo_Id)
  // method: 'POST',
  // uri: `https://auth.getmondo.co.uk/?redirect_uri=${config.redirect_uri_r}&client_id=${}&response_type=code`,
  // headers: {
  //   'content-type': 'application/x-www-form-urlencoded'
  // },
  // form: {
  //   grant_type: 'authorization_code',
  //   client_id: config.clientId,
  //   client_secret: config.clientSecret,
  //   redirect_uri: 'http://localhost:7000/callback',
  //   code: req.query.code
  // }
}

module.exports = {
  rerouter: monzoReroute,
  auth: monzoAuth,
  init: initReq,
  login: monzoLogin
};
