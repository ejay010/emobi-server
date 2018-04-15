const Customer = require('./Customer');

function routes(app, passport) {
  app.post('/Customer/register', require('./register-mongo.js'))
  app.post('/Customer/login', passport.authenticate('local'), require('./login.js'))
  // app.post('/Customer/login', passport.authenticate('local'), require('./login.js'))
  app.get('/requiresAuth', passport.authenticationMiddleware(), function (req, res, error) {
    //request is authenticated
    res.send({
      success: true,
      status: 200,
      message: "Welcome"
    })
  })
}

module.exports = routes
