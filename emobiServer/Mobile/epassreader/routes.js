const jwt = require('jsonwebtoken');
function routes(app, passport) {
  app.post('/mobile/epassreader/login', passport.authenticate('administrators', {session: false}),
    function (req, res, error) {
      let user = req.user
      const token = jwt.sign({user: user}, 'batman')
    res.json({user, token})
    })
}

module.exports = routes
