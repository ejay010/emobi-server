const Tickets = require('./tickets-mongo.js');
const PurchaseOrder = require('../PurchaseOrders').Model;
const ioredis = require('ioredis');
const dot = require('dot');
const fs = require('fs');
const path = require('path');
// const mailgun = require('mailgun-js');
const sgMail = require('@sendgrid/mail');
const awesomeQR = require('awesome-qr');


function sendEmailConfirmation(invoiceObj, callback) {
  // get email file
  fs.readFile(path.join(__dirname, '..', 'Emails', 'Templates', 'transaction.html'), 'utf8', function (error, data) {
    if (error == null) {
      let rawEmail = data;
      let qrCode = ''
      let qrURL = "?invoiceId=" + invoiceObj._id + "&eventId=" + invoiceObj.eventId._id +"&isPurchaser=true&email=" + invoiceObj.purchaser
      new awesomeQR().create({
        text: qrURL,
        size: 350,
        callback: (data) => {
          qrCode = data
        }
      })

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: invoiceObj.purchaser,
        from: 'E-Mobie Support <support@e-mobie.com>',
        subject: 'Your recent E-Mobie Purchase',
        text: 'Testing testing sendgrid',
        html: rawEmail,
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

      //post to sendgrid
      sgMail.send(msg, function (error, body) {
        callback(error, body)
      })

    } else {
      callback(error, 'there was an error')
    }
  })
}

function sendRsvpEmailInvite(rsvp, invoiceObj, callback) {
  // get email file
  fs.readFile(path.join(__dirname, '..', 'Emails', 'Templates', 'transaction.html'), 'utf8', function (error, data) {
    if (error == null) {
      let rawEmail = data;
      let qrCode = ''
      let qrURL = "?invoiceId=" + invoiceObj._id + "&eventId=" + invoiceObj.eventId._id + "&rsvp=1&email=" + rsvp.email
      new awesomeQR().create({
        text: qrURL,
        size: 300,
        callback: (data) => {
          qrCode = data
        }
      })

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: rsvp.email,
        from: 'E-Mobie Support <support@e-mobie.com>',
        subject: 'Your recent E-Mobie Purchase',
        html: rawEmail,
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

      //post to sendgrid
      sgMail.send(msg, function (error, body) {
        callback(error, body)
      })
    } else {
      callback(error, 'there was an error')
    }
  })
}

function processPurchase(req, res, error) {
  Tickets.findById(req.body.ticket._id).then((foundTicket) => {
    if (foundTicket.eventId == req.body.eventId) {
      //inspect customer request
      let ticket_cost = 0
      if (foundTicket.price != null) {
        ticket_cost = foundTicket.price
      }
      let total_passes = req.body.guestList.length
      let guest_passes = req.body.guestList.filter(obj => obj.guest_spot == true)
      guest_passes.forEach((pass) => {
        pass.scanned_in = false
      })

      let rsvp = req.body.guestList.filter(obj => obj.guest_spot == false)
      rsvp.forEach((pass) => {
        pass.scanned_in = false
      })

      if ((foundTicket.quantity_available - total_passes) >= 0) {
        let tempQtyAvail = foundTicket.quantity_available
        let tempQtySold = foundTicket.qty_sold
        //
        foundTicket.quantity_available = tempQtyAvail - total_passes
        foundTicket.qty_sold = tempQtySold + total_passes

        foundTicket.save().then((updatedTickect) => {

          // create the invoice
          PurchaseOrder.create({
            purchaser: req.user.email,
            eventId: updatedTickect.eventId,
            cost: (ticket_cost * total_passes),
            contents: req.body.guestList,
            invoice_life: total_passes,
            rsvp_list: rsvp,
            ticketId: req.body.ticket._id,
            guest_passes: guest_passes
          }).then((response) => {
            PurchaseOrder.findById(response._id).populate('eventId').populate('ticketId').exec((err, results) => {
              if (err == null) {
                sendEmailConfirmation(results, function (error, body) {
                  console.log(body);
                  // IDEA: Do some meta data logging here.
                  // IDEA: Change this function to a promise.
                })
                results.rsvp_list.forEach((rsvp) => {
                  if (rsvp.email != results.purchaser) {
                    sendRsvpEmailInvite(rsvp, results, function (error, body) {
                      console.log(body);
                        // IDEA: Do some meta data logging here.
                        // IDEA: Change this function to a promise.
                    })
                  }
                })
                // No emails for guest pass
              }
            })

            PurchaseOrder.findById(response._id).populate('eventId').populate('ticketId').then((response) => {
              //notify app of sale
              let redis = new ioredis
              redis.publish('customerNotifications', JSON.stringify({
                from: "server",
                to: "all",
                message: "Ticket Sale",
                sale: {
                  eventId: response.eventId._id,
                  ticketId: response.ticketId._id,
                  qty: response.invoice_life
                }
              }))
              //send data back to customer to update their state
              res.send({
                success: true,
                data: response
              })
            })
          })

        })

      } else {
        res.send({
          success: false,
          message: 'Tickets not available'
        })
      }
    } else {
      res.sendStatus(500)
    }
  })
  //create purchase order based on info provided
}
module.exports = processPurchase
