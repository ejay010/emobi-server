const mailgun = require('mailgun-js');

let MailGun = {
  Sendto: function (to, subject, template) {
    let api_key = process.env.MAILGUN_API_KEY;
    let DOMAIN = process.env.MAILGUN_API_DOMAIN;
    let mailgunApi = require('mailgun-js')({
        apiKey: api_key,
        domain: DOMAIN
      })

    return mailgunApi.messages().send({
      from: process.env.MAILGUN_EMAIL_ADDRESS,
      to: to,
      subject: subject,
      html: template
    }, function (error, body) {
      if (error) {
        console.log(error);
      }
      console.log('mailgun');
      console.log(body);
      return body
    })
  }
}

module.exports = MailGun
