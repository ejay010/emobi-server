const mailgun = require('mailgun-js');

let MailGun = {
  Sendto: function (to, subject, template) {
    let api_key = process.env.MAILGUN_API_KEY;
    console.log(api_key);
    let DOMAIN = process.env.MAILGUN_API_DOMAIN;
    console.log(DOMAIN);
    let mailgunApi = require('mailgun-js')({
        apiKey: api_key,
        domain: DOMAIN
      })

    return mailgunApi.messages().send({
      from: 'E-MOBiE Support<support@mg.e-mobie.com>',
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
