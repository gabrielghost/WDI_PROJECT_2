const express = require('express');
const router = express.Router();

const monzoAuth = require('../controllers/monzoAuth');
const statics = require('../controllers/statics');

router.route('/monzo-redirect')
  .get(monzoAuth.rerouter);
router.route('/login')
    .get(monzoAuth.init);

module.exports = router;
