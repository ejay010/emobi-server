const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../../Customer').Class;

function Authenticate() {
  const LocalStrategy = require('passport-local').Strategy
  passport.use('administrators', new LocalStrategy(function (username, password, done) {
    User.findOne({email: username}).then((results) => {
      if (results.admin == true) { // if user object contains admin tag
        bcrypt.compare(password, results.password, (err, isValid) => {
          if (err) {
            return done(err)
          }
          if (isValid) {
            return done(null, results)
          }
        })
      } else {
        return done(null, false)
      }
    })
  }))

  const JwtStrategy = require('passport-jwt').Strategy;
  const ExtractJwt = require('passport-jwt').ExtractJwt;

  let opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = 'batman'
  // opts.issuer = 'api.e-mobie.com'
  // opts.audience = 'ePassReader'

  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log(jwt_payload._id);
    console.log('hello');
    return done(null, {test: true}, {message: 'We got a token :)'})
  }))
}

module.exports = Authenticate
