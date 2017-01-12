const path = require('path');

function staticsHome(req, res) {
  return res.sendFile(path.join(__dirname, '../index.html'));
}
function staticsRedirect(req, res) {

}

module.exports = {
  home: staticsHome,
  redirect: staticsRedirect
};
