const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const ioredis = require('ioredis');

const authenticationMiddleware = require('./middleware')

function findUser (email, callback) {
  console.log(email);
  let redis = new ioredis();
  redis.get('customer:'+email).then((result) => {
    if (result != null) {
      customer = JSON.parse(result);
      if (email === customer.email) {
          return callback(null, customer)
      }
    }
    return callback(null)
  })
}

passport.serializeUser(function (user, cb) {
  // console.log(user);
  cb(null, user.email)
})

passport.deserializeUser(function (email, cb) {
  console.log(email)
  findUser(email, cb)
})

function initPassport () {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    (username, password, done) => {
      findUser(username, (err, user) => {
        if (err) {
          return done(err)
        }

        // User not found
        if (!user) {
          console.log('User not found')
          return done(null, false)
        }
        // console.log(user);
        // Always use hashed passwords and fixed time comparison
        bcrypt.compare(password, user.password, (err, isValid) => {
          if (err) {
            return done(err)
          }
          if (!isValid) {
            return done(null, false)
          }
          return done(null, user)
        })
      })
    }
  ))

  passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = initPassport
