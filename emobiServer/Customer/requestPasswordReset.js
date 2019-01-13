const Customer = require('./Customer-mongo.js');
const PasswordReset = require('./PasswordResets.js');
const fs = require('fs');
// const MailGun = require('../MailGun');
const sgMail = require('@sendgrid/mail');
const dot = require('dot');

function GeneratePasswordResetlink(req, res, error) {
  Customer.findOne({email: req.body.email}).then((customer) => {
    if (customer != null) {
      PasswordReset.create({
        token: Math.random().toString(36).substr(2, 9),
        customer_id: customer._id
      }).then((response) => {
        fs.readFile(__dirname +'/../Emails/Templates/resetpassword.html', 'utf8', function (error, htmlresponse) {
          // let templateFunction = dot.template(htmlresponse)

          sgMail.setApiKey(process.env.SENDGRID_API_KEY)
          sgMail.send({
            personalizations: [
              {
                to: customer.email,
                subject: 'E-Mobie Reset Password Request',
                substitutions: {'resetlink': process.env.VUE_FRONTEND_URL + '/#/ResetPassword?token='+response.token}
              }
            ],
            from: 'E-Mobie Support <support@e-mobie.com>',
            html: htmlresponse,
          }).then((response) => {
            res.sendStatus(200)
          }).catch((error) => {
            res.error(error)
          })
        })
      })
    } else {
      res.sendStatus(500)
    }
  })
}

module.exports = GeneratePasswordResetlink
