const ioredis = require('ioredis');
const bcrypt = require('bcrypt');
const CustomerClass = require('./Customer-mongo.js');
const fs = require('fs');
// const MailGun = require('../MailGun');
const sgMail = require('@sendgrid/mail');
const dot = require('dot');

function register(req, res) {
    const saltRounds = 10
    const myPlaintextPassword = req.body.password
    const salt = bcrypt.genSaltSync(saltRounds)
    const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt)

    let new_customer = {
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      password: passwordHash,
      dob: req.body.dob
    }

    CustomerClass.findOne({'email': new_customer.email}).then((response) => {
      if (response == null) {
        CustomerClass.create(new_customer).then((response) => {
          fs.readFile(__dirname +'/../Emails/Templates/welcome.html', 'utf8', function (error, htmlresponse) {
            let templateFunction = dot.template(htmlresponse)

            const msg = {
              to: response.email,
              from: 'E-MOBiE Support<support@e-mobie.com>',
              subject: 'Welcome to E-Mobie',
              html: templateFunction(response)
            }
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            sgMail.send(msg).then((response) => {
              //successfully sent
              res.send({
                success: true,
                message: 'Customer Created',
                user: {
                  username: response.username,
                  email: response.email,
                  dob: response.dob
                }
              })
            }).catch((error) => {
              console.log(error);
            })
          })
        })
      } else {
        res.send({
          success: false,
          message: "Registration Failed"
        })
      }
    })
}

module.exports = register;
