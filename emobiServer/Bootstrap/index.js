const authentication = require('../Authentication');
// const bluebird = require('bluebird');
// const ioredis = require('ioredis');
const passport = require('passport');
// const multer = require('multer');
// const fs = require('fs');
// const upload = multer({ dest: 'flyers/'})
// const moment = require('moment');
const customer = require('../Customer');
const events = require('../Events');
const tickets = require('../Tickets');

function init(app) {
  authentication.init(app);
  customer.init(app, passport)
  events.init(app, passport)
  tickets.init(app, passport)
  // tickets(app, passport)
}

module.exports = {init: init}
