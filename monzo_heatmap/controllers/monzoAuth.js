const config = require('../config/config');

function monzoAuth(req, res){
  console.log('monzoAuth running');
  console.log(req.query);
  console.log(req.query.code);
  return res.redirect('/');
}

function monzoReroute(req, res){
  var url = config.clientId;
  return res.json({ url});
}

module.exports = {
  rerouter: monzoReroute,
  auth: monzoAuth
};
