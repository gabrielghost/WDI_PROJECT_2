const express = require('express');
const router = express.Router();

const monzo = require('../controllers/monzo');
const heatMap = require('../controllers/heatMap');

router.route('/')
  .get(heatMap.home);

module.exports = router;
