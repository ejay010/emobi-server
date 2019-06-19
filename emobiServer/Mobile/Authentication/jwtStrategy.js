const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../../Customer').Class;
const LocalStrategy = require('passport-local').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


function Authenticate() {
  passport.use('administrators', new CustomStrategy(
    function (req, done) {
      if (req.body.user != null && req.body.user.username != null) {
        User.findOne({email: req.body.user.username}).then((results) => {
          if (results != null && results.admin == true) { // if user object contains admin tag
            bcrypt.compare(req.body.user.password, results.password, (err, isValid) => {
              if (err != null) {
                console.log('error is');
                console.log(err);
                return done(err)
              }
              if (isValid != null) {
                console.log("valid is");
                console.log(isValid);
                return done(null, results)
              }
            })
          } else {
            return done(null, false)
          }
        })
      } else {
        return done(null, false)
      }
  }))

  let opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = 'batman'
  // opts.issuer = 'api.e-mobie.com'
  // opts.audience = 'ePassReader'

  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log(jwt_payload);
    console.log('hello');
    return done(null, {test: true}, {message: 'We got a token :)'})
  }))
}

module.exports = Authenticate
