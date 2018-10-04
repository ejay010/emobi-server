const authentication = require('../Authentication');
const passport = require('passport');
const customer = require('../Customer');
const events = require('../Events');
const tickets = require('../Tickets');
const PurchaseOrders = require('../PurchaseOrders');
const Mail = require('../MailGun');
const Invites = require('../Invites');

function init(app) {
  authentication.init(app);
  customer.init(app, passport)
  events.init(app, passport)
  tickets.init(app, passport)
  PurchaseOrders.init(app, passport)
  Invites.init(app, passport)
  // Mail.init(app, passport)
}

module.exports = {init: init}
