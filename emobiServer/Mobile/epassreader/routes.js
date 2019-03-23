const jwt = require('jsonwebtoken');
const Events = require('../../Events').Class;
function routes(app, passport) {
  app.post('/mobile/epassreader/login', passport.authenticate('administrators', {session: false}),
    function (req, res, error) {
      let user = req.user
      const token = jwt.sign({user: user}, 'batman')
    res.json({user, token})
    })
    app.get('/mobile/epassreader/events', passport.authenticate('jwt', {session: false}), function (req, res, error) {
      let events = Events.find({status: "published"}).exec(function (err, results) {
        res.json({events: results})
      })
    })
}

module.exports = routes
