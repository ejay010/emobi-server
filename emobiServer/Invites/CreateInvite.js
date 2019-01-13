const Invite = require('./invite.js');
const Tickets = require('../Tickets').Class;
// const Mailgun = require('mailgun-js');
const sgMail = require('@sendgrid/mail');
const dot = require('dot');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

// function sendInviteEmail(inviteObj) {
//   return new Promise(function(resolve, reject) {
//     fs.readFile(path.join(__dirname, '..', 'Emails', 'Templates', 'invite.html'), 'utf8', function (error, data) {
//       if (error == null) {
//         let rawEmail = data
//         let templateFunction = dot.template(rawEmail)
//         let parsedEmail = templateFunction(inviteObj)
//
//         // load mailgun
//         let api_key = process.env.MAILGUN_API_KEY;
//         let DOMAIN = process.env.MAILGUN_API_DOMAIN;
//         let mailgun = require('mailgun-js')({
//           apiKey: api_key,
//           domain: DOMAIN
//         })
//
//         let emailMeta = {
//           from: 'E-MOBiE Support<support@e-mobie.com>',
//           to: inviteObj.email,
//           subject: 'You\'ve been invited to an E-Mobie event :D',
//           html: parsedEmail,
//         }
//
//         //fire mail gun
//         mailgun.messages().send(emailMeta, (err, body) => {
//           resolve(err, body)
//         })
//       } else {
//         reject(error, null, 'there was an error')
//       }
//   });
//
//   })
// }


function sendBatchEmails(error, createdInvites) {
  if (error != null) {
    console.log(error);
    return error
  } else {
    let personalizations = []
    let recipient_object = {}
    for (var i = 0; i < createdInvites.length; i++) {
      recipient_object.to = createdInvites[i].email
      recipient_object.subject = 'You\'ve been invited to an E-Mobie event :D',
      recipient_object.substitutions = {
        'eventName': createdInvites[i].eventId.title,
        'ticketId': createdInvites[i].ticketId._id,
        'ticketTitle': createdInvites[i].ticketId.title,
        'invite_url': process.env.VUE_FRONTEND_URL+'/#/invite/'+ createdInvites[i]._id + '/rsvp_confirm'
      }
      personalizations.push(recipient_object)
      recipient_object = {}
    }

     fs.readFile(path.join(__dirname, '..', 'Emails', 'Templates', 'invite_batch.html'), 'utf8', function (error, data) {
      if (error == null) {
        let rawData = data
        let emailMeta = {
          personalizations,
          from: 'E-MOBiE Support<support@e-mobie.com>',
          subject: 'You\'ve been invited to an E-Mobie event :D',
          html: rawData,
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        sgMail.send(emailMeta).then((response) => {
          for (var i = 0; i < createdInvites.length; i++) {
                 Invite.update({_id: createdInvites[i]._id}, {status: 'Sent'}, function (error, done) {
                   // Use redis to communicate email success
                   console.log(done);
                   console.log(error);
                 })
               }
        }).catch((error) => {
          console.log(error);
        })
      }
    })
    return {
      createdInvites
    }
  }
}

// function createInvite(inviteSeed, ticketObj, cb) {
//   Invite.create({
//     eventId: ticketObj.eventId,
//     ticketId: ticketObj._id,
//     name: inviteSeed.name,
//     email: inviteSeed.email
//   }).then((results) => {
//     //Callback with the created Invite and the seeddata
//     cb(results, inviteSeed)
//     // return Invite.findByIdAndUpdate({ _id: results._id}, {status: 'Sent'}, {new: true}).populate('eventId').populate('ticketId').then((res) => {
//     //   let url = process.env.VUE_URL + '/#/invite/' + results._id + '/rsvp_confirm'
//     //   res.invite_url = url
//     //   sendInviteEmail(res) // handle email response seprately using REDIS??
//     //   return res
//     // })
//   })
// }

async function Create(req, res, error) {
  // create invites
  Invite.insertMany(req.body.invitelist, function (error, docs) {
    if (error != null) {
      res.error(error)
    } else {
      // we have created the invites and saved to the database now we need to send the batch Emails
      let response = sendBatchEmails(null, docs)
      // console.log(response);
      res.send(response)
    }
  })
  // res.send(req.body)
}

module.exports = Create
