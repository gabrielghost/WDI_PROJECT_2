const path = require('path');

function staticsHome(req, res) {
  return res.sendFile(path.join(__dirname, '../index.html'));
}
function staticsHeatmap(req, res) {
  return res.sendFile(path.join(__dirname, '../index.html'));
}

module.exports = {
  home: staticsHome,
  heatmap: staticsHeatmap
};
