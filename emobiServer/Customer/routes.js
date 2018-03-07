const Customer = require('./Customer');

function routes(app, passport) {
  app.post('/Customer/register', require('./register.js'))
  app.post('/Customer/login', passport.authenticate('local'), require('./login.js'))
  // app.post('/Customer/login', passport.authenticate('local'), require('./login.js'))
}

module.exports = routes
