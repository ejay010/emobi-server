const Customer = require('./Customer');
const multer = require('multer');
const upload = multer({ dest: 'profile_pics/'})

function routes(app, passport) {
  app.post('/Customer/requestPasswordReset', require('./requestPasswordReset.js'))
  app.post('/Customer/resetpassword', require('./resetpassword.js'))
  app.post('/Customer/register', require('./register-mongo.js'))
  app.post('/Customer/login', passport.authenticate('local'), require('./login.js'))
  app.post('/Customer/updateInfo', passport.authenticationMiddleware(), require('./updateInfo.js'))
  app.post('/Customer/new_profile_picture', passport.authenticationMiddleware(), upload.single('new_picture'), require('./ProfilePic.js'))
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
