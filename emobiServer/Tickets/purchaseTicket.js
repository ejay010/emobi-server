const Tickets = require('./tickets-mongo.js');
const PurchaseOrder = require('../PurchaseOrders').Model;
const ioredis = require('ioredis');

function processPurchase(req, res, error) {
  //find ticket to validate existence
  // console.log(req.body);
  // res.send({
  //   success: false,
  //   message: 'Maintanence Mode',
  //   status: 305
  // });
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
        pass.outstanding = true
      })

      let rsvp = req.body.guestList.filter(obj => obj.guest_spot == false)
      rsvp.forEach((pass) => {
        pass.outstanding = true
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
