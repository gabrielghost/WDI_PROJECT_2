const express        = require('express');
const app            = express();
// const bodyParser  = require('body-parser');
const mongoose       = require('mongoose');
const cors           = require('cors');
const apiRoutes      = require('./config/apiRoutes');
const webRoutes      = require('./config/webRoutes');
const config         = require('./config/config');
const port           = process.env.PORT || 3000;

const databaseURL = process.env.MONGOLAB_URL || 'mongodb://localhost:27017/monzo-heatmap';
mongoose.connect(databaseURL);

app.use(express.static(`${__dirname}/public`));
app.use(cors());
app.use('/', webRoutes);
app.use('/api', apiRoutes);

app.listen(port, console.log(`server has started on port: ${config.port}`));
