const Invite = require('./invite.js');
const Mailgun = require('mailgun-js');
const dot = require('dot');
const path = require('path');
const fs = require('fs');

function sendInviteEmail(inviteObj) {
  return new Promise(function(resolve, reject) {
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
          to: inviteObj.to_email,
          subject: 'You\'ve been invited to an E-Mobie event :D',
          html: parsedEmail,
        }

        //fire mail gun
        mailgun.messages().send(emailMeta, (err, body) => {
          resolve(err, body)
        })
      } else {
        reject(error, null, 'there was an error')
      }
  });

  })
}

function createInvite(inviteSeed, index_position, ticketObj) {
  return Invite.create({
    eventId: ticketObj.eventId,
    ticketId: ticketObj._id,
    index_position: index_position,
    to_name: inviteSeed.name,
    to_email: inviteSeed.email
  }).then((results) => {
    return Invite.findByIdAndUpdate({ _id: results._id}, {status: 'Sent'}, {new: true}).populate('eventId').populate('ticketId').then((res) => {
      let url = process.env.VUE_URL + '/invite/' + results._id + '/rsvp_confirm'
      res.invite_url = url
      sendInviteEmail(res) // hand email response seprately using REDIS??
      return res
    })
  })
}

async function Create(req, res, error) {
  let ticketObj = req.body.ticketObj
  let invites_list = req.body.invitelist
  let invited = []
   for (var i = 0; i < invites_list.length; i++) {
    if (invites_list[i].status === 'Not Sent') {
      let createdInvite = await createInvite(invites_list[i], i, ticketObj)
      invited.push(createdInvite)
    }
  }
  res.send(invited)
}

module.exports = Create
