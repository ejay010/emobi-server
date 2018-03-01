const Customer = require('./Customer');

function routes(app, passport) {
  app.post('/Customer/register', require('./register.js'))
  app.post('/Customer/login', passport.authenticate('local'), require('./Login.js'))
}

module.exports = routes
