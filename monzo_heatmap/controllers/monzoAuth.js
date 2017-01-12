const config = require('../config/config');
const rp = require('request-promise');
const path = require('path');

function monzoReroute(req, res){
  var url = config.clientId;
  return res.json({ url});
}
function monzoAuth(req, res){
  var query = req.query;
  return res.status(200).json(query);
}

// function getAccessToken(code, state, req, res){
//   console.log('getAccessToken'+code);
//   let url = "https://api.getmondo.co.uk/oauth2/token";
//   let authData = {
//     grant_type: 'authorization_code',
//     client_id: config.clientId,
//     client_secret: config.clientSecret,
//     redirect_uri: config.redirect_uri,
//     code: code
//   };
//   return res.render(url);
// }

// function monzoRequest(url, authData){
//   App.ajax({
//     type: 'POST',
//     url: url,
//     data: authData,
//     success: authToken,
//     dataType: String
//   });
// }

module.exports = {
  rerouter: monzoReroute,
  auth: monzoAuth
};
