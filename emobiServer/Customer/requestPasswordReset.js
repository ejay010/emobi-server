const Customer = require('./Customer-mongo.js');
const PasswordReset = require('./PasswordResets.js');
const fs = require('fs');
const MailGun = require('../MailGun');
const dot = require('dot');

function GeneratePasswordResetlink(req, res, error) {
  Customer.findOne({email: req.body.email}).then((customer) => {
    if (customer != null) {
      PasswordReset.create({
        token: Math.random().toString(36).substr(2, 9),
        customer_id: customer._id
      }).then((response) => {
        fs.readFile(__dirname +'/../Emails/Templates/resetpassword.html', 'utf8', function (error, htmlresponse) {
          let templateFunction = dot.template(htmlresponse)

          MailGun.Sendto(response.email, "E-Mobie Reset Password Request", templateFunction({resetlink:
            process.env.VUE_URL + '/#/ResetPassword?token='+response.token
          }))
          res.sendStatus(200)
        })
      })
    } else {
      res.sendStatus(200)
    }
  })
}

module.exports = GeneratePasswordResetlink
