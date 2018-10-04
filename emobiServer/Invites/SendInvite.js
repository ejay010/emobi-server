const Invite = require('./invite.js');
const Mailgun = require('mailgun-js');
const dot = require('dot');
const path = require('path');
const fs = require('fs');


function buildInviteEmail(inviteObj, callback) {
  fs.readFile(path.join(__dirname, '..', 'Emails', 'Templates', 'invite.html'), 'utf8', function (error, data) {
    if (error == null) {
      let rawEmail = data
      let templateFunction = dot.template(rawEmail)
      let parsedEmail = templateFunction(inviteObj)

      // load mailgun
      let api_key = process.env.MAILGUN_API_KEY;
      let DOMAIN = process.env.MAILGUN_API_DOMAIN;
      let mailgun = require('mailgun-js')({
        apiKey: api_key,
        domain: DOMAIN
      })

      let emailMeta = {
        from: 'E-MOBiE Support<support@e-mobie.com>',
        to: inviteObj.purchaser,
        subject: 'Your recent E-Mobie Purchase',
        html: parsedEmail,
        // inline: attach
      }

      //fire mail gun
      mailgun.messages().send(emailMeta, function (error, body) {
        callback(error, body)
      })
    } else {
      callback(error, 'there was an error')
    }
  })
}

function Sendinvite(req, res, error) {
  Invite.findById(req.params.invite_id).then((response) => {
    // console.log(response);
  })
}

module.exports = Sendinvite
