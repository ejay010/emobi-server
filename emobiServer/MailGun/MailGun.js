const mailgun = require('mailgun-js');
const fs = require('fs');
const dot = require('dot');

function mail(req, res, error) {
  let api_key = process.env.MAILGUN_API_KEY;
  let DOMAIN = process.env.MAILGUN_API_DOMAIN;
  let mailgun = require('mailgun-js')({
    apiKey: api_key,
    domain: DOMAIN
  })
  fs.readFile(__dirname + '/Templates/welcome.html', "utf8", function (err, html) {

    console.log(html);
    let email = req.body.new_user_email
    let doT = dot.template(html)
    let Welcome = doT({username: email})
    // let welcomeTemplate = Welcome({username: email})
    let data = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: email,
      subject: 'Hello',
      html: Welcome
    }

    mailgun.messages().send(data, function (error, body) {
      res.send({error: error, body: body})
    })

    // res.send(html)
  })

}

module.exports = mail
