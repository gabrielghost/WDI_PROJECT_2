const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  {id: String,
  group_id: String,
  created: String,
  name: String,
  logo: String,
  emoji: String,
  category: String,
  online: Boolean(),
  atm: Boolean()}
});


module.exports = mongoose.model('Transaction', transactionSchema);
