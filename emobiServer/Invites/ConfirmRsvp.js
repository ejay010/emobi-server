const Invite = require('./invite.js');
const Tickets = require('../Tickets').Class;
const Invoice = require('../PurchaseOrders').Model;
const dot = require('dot');
const fs = require('fs');
const path = require('path');
// const mailgun = require('mailgun-js');
const sgMail = require('@sendgrid/mail');
const awesomeQR = require('awesome-qr');


function sendEmailInvite(rsvp, invoiceObj, callback) {
  // console.log(rsvp);
  // get email file
  fs.readFile(path.join(__dirname, '..', 'Emails', 'Templates', 'transaction.html'), 'utf8', function (error, data) {
    if (error == null) {
      let qrCode = ''
      let qrURL = "?eventId=" + invoiceObj.eventId._id + "&invoiceId=" + invoiceObj._id + "&isPurchaser=true&rsvp=" + rsvp.email
      new awesomeQR().create({
        text: qrURL,
        size: 300,
        callback: (data) => {
          qrCode = data
        }
      })
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      let msg = {
        to: rsvp.email,
        from: 'E-Mobie Support <support@e-mobie.com>',
        subject: 'E-Mobie Pass',
        html: data,
        substitutions: {
          'invoiceId': invoiceObj._id,
          'eventTitle': invoiceObj.eventId.title,
          'eventDescription': invoiceObj.eventId.description,
          'ticketTitle': invoiceObj.ticketId.title,
          'ticketDescription': invoiceObj.ticketId.description
        },
        attachments: [
          {
            content: Buffer.from(qrCode).toString('base64'),
            filename: 'qrCode.png',
            type: 'image/png',
            disposition: 'inline',
            content_id: 'qrCode.png'
          },
        ],
      }
      // console.log(msg);
      // load mailgun
      // let attach = new mailgun.Attachment({data: qrCode, filename: 'qrCode.png', contentType: 'image/png'})
      //
      // let emailMeta = {
      //   from: 'E-MOBiE Sales <sales@e-mobie.com>',
      //   to: rsvp.email,
      //   subject: 'E-Mobie Pass',
      //   html: parsedEmail,
      //   inline: attach
      // }
      // console.log(emailMeta);

      //fire mail gun
      // mailgun.messages().send(emailMeta, function (error, body) {
      //   callback(error, body)
      // })
      // console.log(msg);
      sgMail.send(msg).then((response) => {
        // success
        callback(null, response)
      }).catch((error) => {
        // error
        callback(error, null)
      })
    } else {
      callback(error, 'there was an error')
    }
  })
}

function ConfirmRsvp(req, res, error) {
  // console.log(req.body)
  // Find invite
Invite.findById(req.params.invite_id).then((results) => {
  // console.log(results.email);
  // console.log(req.body.confirmed_email);
  if (results.email === req.body.confirmed_email) {
    Invite.findByIdAndUpdate(req.params.invite_id, {status: 'Confirmed'}, (error, updated_results) => {
      // res.send(updated_results)
      // Create E-Pass
      let rsvp = []
      let rsvp_layout = {
        name: updated_results.name,
        email: updated_results.email,
        dob: req.body.dob,
        phone: req.body.phone,
        guest_spot: false,
        signed_in: false,
      }
      rsvp.push(rsvp_layout)

      Tickets.findById(updated_results.ticketId).then((foundTicket) => {
        let ticket_cost = 0
        if (foundTicket.price != null) {
          ticket_cost = foundTicket.price
        }
        Tickets.findByIdAndUpdate({_id: foundTicket._id}, { $inc: { quantity_available: -1 }}, function (err, updated_ticket) {
          if (err == null) {
            Invoice.create({
              purchaser: req.body.confirmed_email,
              eventId: foundTicket.eventId,
              cost: (ticket_cost * 1),
              contents: rsvp,
              invoice_life: 1,
              rsvp_list: rsvp,
              ticketId: foundTicket._id,
              guest_passes: []
            }).then((response) => {
              Invoice.findById(response._id).populate('eventId').populate('ticketId').exec((err, results) => {
                // console.log(rsvp_layout);
                sendEmailInvite(rsvp_layout, results, function (error, body) {
                  res.send({
                    error,
                    body
                  })
                })
              })
            })
          } else {
            res.send({
              err,
              message: 'There is a problem, can\'t update the ticket'
            })
          }
        })
      })
    })
  } else {
    res.send({
      success: false,
      message: 'Invalid Data Provided, please check the information you entered'
    })
  }
})
}

module.exports = ConfirmRsvp
