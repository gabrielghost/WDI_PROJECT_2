const express   = require('express');
const router    = express.Router();

// const monzoAuth = require('../controllers/monzoAuth');
const statics   = require('../controllers/statics');

router.route('/')
  .get(statics.home);
router.route('/callback')
  .get(statics.home);
// router.route('/handshake')
//   .get(monzoAuth.auth);
router.route('/heatmap')
  .get(statics.heatmap);
// router.route('/login')
//   .post(monzoAuth.login);



module.exports = router;
