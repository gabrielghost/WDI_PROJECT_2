const express = require('express');
const router = express.Router();

const monzoAuth = require('../controllers/monzoAuth');
const statics = require('../controllers/statics');

router.route('/')
  .get(statics.home);
router.route('/callback')
  .get(monzoAuth.auth);


module.exports = router;
