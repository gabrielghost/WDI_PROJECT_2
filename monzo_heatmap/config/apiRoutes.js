const express = require('express');
const router = express.Router();

const monzoAuth = require('../controllers/monzoAuth');
const statics = require('../controllers/statics');

// router.route('/')
//   .get(statics.home);

router.route('/monzo-redirect')
  .get(monzoAuth.rerouter);

module.exports = router;
