const Tickets = require('./tickets-mongo.js');
const PurchaseOrder = require('../PurchaseOrders').Model;
const ioredis = require('ioredis');

function processPurchase(req, res, error) {
  //find ticket to validate existence
  Tickets.findById(req.body.ticketId).then((foundTicket) => {
    if (foundTicket.eventId == req.body.eventId) {
      //inspect customer request
      let ticket_cost = 0
      if (foundTicket.price != null) {
        ticket_cost = foundTicket.price
      }
      let total_passes = req.body.stubs.length
      let guest_passes = req.body.stubs.filter(obj => obj.guest_spot == true)
      guest_passes.forEach((pass) => {
        pass.outstanding = true
      })

      let rsvp = req.body.stubs.filter(obj => obj.guest_spot == false)
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
            contents: req.body.stubs,
            invoice_life: total_passes,
            rsvp_list: rsvp,
            ticketId: req.body.ticketId,
            guest_passes: guest_passes
          }).then((response) => {
            //notify app of sale
            let redis = new ioredis
            redis.publish('customerNotifications', JSON.stringify({
              from: "server",
              to: "all",
              message: "Ticket Sale",
              sale: {
                eventId: response.eventId,
                ticketId: response.ticketId,
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


// const Tickets = require('./tickets-mongo.js');
// const PurchaseOrders = require('../PurchaseOrders').Class;
// const ioredis = require('ioredis');

// function purchaseTicket(req, res, error) {
//   // let tickets = new Tickets()
//   let purchaseInfo = req.body.purchaseInfo
//   Tickets.findById(purchaseInfo.ticket).then((foundTicket) => {
//     //Can we sell the requested amount?
//       // If so, sell it, update the ticket, and then create the P.O
// if ((foundTicket.quantity_available - purchaseInfo.qty) >= 0) {
//   let tempQtyAvail = foundTicket.quantity_available
//   let tempQtySold = foundTicket.qty_sold
//   //
//   foundTicket.quantity_available = tempQtyAvail - purchaseInfo.qty
//   foundTicket.qty_sold = tempQtySold + purchaseInfo.qty
  //
  // foundTicket.save().then((updatedTickect) => {
  //
  //           //Create the purchase order
  //           PurchaseOrders.create({
  //             eventId: updatedTickect.eventId,
  //             ticketId: updatedTickect.id,
  //             purchaser: purchaseInfo.purchaser,
  //             resolved_qty: purchaseInfo.qty,
  //             qty_available: purchaseInfo.qty
  //           }).then((response) => {
  //             response.populate('eventId').populate('ticketId').execPopulate().then((createdPO) => {
  //               let redis = new ioredis()
  // redis.publish('customerNotifications', JSON.stringify({
  //   from: "server",
  //   to: createdPO.purchaser,
  //   message: "Ticket Bought",
  //   redis: {
  //     type: "hash",
  //     key: createdPO.id,
  //     data:{
  //       PurchaseOrder: createdPO,
  //       TicketInfo: updatedTickect
  //     }
  //   }
  // }))
  //
  //               redis.publish('customerNotifications', JSON.stringify({
  //                 from: "server",
  //                 to: foundTicket.publisher,
  //                 message: "Ticket Sale",
  //                 redis: {
  //                   type: "hash",
  //                   key: createdPO.id,
  //                   data: {
  //                     PurchaseOrder: createdPO,
  //                     TicketInfo: updatedTickect
  //                   }
  //                 }
  //               }))
  //
  //
  //               redis.publish('customerNotifications', JSON.stringify({
  //                 from: "server",
  //                 to: "all",
  //                 message: "Ticket Sold",
  //                 redis: {
  //                   type: "hash",
  //                   key: updatedTickect.id,
  //                   data: {
  //                     TicketInfo: updatedTickect
  //                   }
  //                 }
  //               }))
  //
  //               redis.publish('ticket-update', JSON.stringify({
  //                 message: "Ticket Sold",
  //                 ticket: updatedTickect,
  //                 resolved_qty: createdPO.resolved_qty
  //               }))
  //
  //               res.send({
  //                 success: true,
  //                 message: 'Purchase Complete',
  //                 data: {
  //                   PurchaseOrder: createdPO,
  //                   TicketInfo: updatedTickect
  //                 }
  //               })
  //             })
  //           })
  //         })
  //       } else {
  //         // available qty is violated, purchase would result in negative value
  //         res.send({
  //           success: false,
  //           message: 'Purchase Denied',
  //           error: {
  //             message: "Tickest Exhausted",
  //             data: purchaseInfo
  //           }
  //         })
  //       }
  //     // res.send(req.body)
  //   })
  //
  //   // tickets.makePurchase(req.body.purchaseInfo).then((response) => {
  //     // res.send(response)
  //   // })
  //   // res.send(req.body)
  // }
  //
  // module.exports = purchaseTicket
