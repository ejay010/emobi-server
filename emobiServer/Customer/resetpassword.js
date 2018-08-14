const PasswordReset = require('./PasswordResets.js');
const Customer = require('./Customer-mongo.js');
const bcrypt = require('bcrypt');

function ResetPassword(req, res, error) {
  console.log(req.body);
  // verify token exists
  PasswordReset.findOne({token: req.body.token}).then((Token) => {
    if (Token != null) {
      // verify token link to correct Customer
      Customer.findById(Token.customer_id).then((Customer) => {
        if (Customer != null) {
          // Hash the new password and set it
          const saltRounds = 10
          const myPlaintextPassword = req.body.new_password
          const salt = bcrypt.genSaltSync(saltRounds)
          const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt)

          Customer.password = passwordHash
          Customer.save().then((results) => {
            res.send({
              success: true,
              message: "Password Updated",
              customer: {
                email: results.email,
              }
            })
          })
          PasswordReset.findByIdAndRemove(req.body.token)
        }
      })
    } else {
      res.send({
        success: false,
        message: 'Invalid Token'
      })
    }
  })
}

module.exports = ResetPassword
