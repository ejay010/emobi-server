const Tickets = require('./tickets-mongo.js');
const PurchaseOrders = require('../PurchaseOrders').Class;
const ioredis = require('ioredis');

function purchaseTicket(req, res, error) {
  // let tickets = new Tickets()
  let purchaseInfo = req.body.purchaseInfo
  Tickets.findById(purchaseInfo.ticket).then((foundTicket) => {
    //Can we sell the requested amount?
      // If so, sell it, update the ticket, and then create the P.O
      if ((foundTicket.quantity_available - purchaseInfo.qty) >= 0 ) {
        let tempQtyAvail = foundTicket.quantity_available
        let tempQtySold = foundTicket.qty_sold

        foundTicket.quantity_available = tempQtyAvail - purchaseInfo.qty
        foundTicket.qty_sold = tempQtySold + purchaseInfo.qty

        foundTicket.save().then((updatedTickect) => {

          //Create the purchase order
          PurchaseOrders.create({
            eventId: updatedTickect.eventId,
            ticketId: updatedTickect.id,
            purchaser: purchaseInfo.purchaser,
            resolved_qty: purchaseInfo.qty,
            qty_available: purchaseInfo.qty
          }).then((response) => {
            response.populate('eventId').populate('ticketId').execPopulate().then((createdPO) => {
              let redis = new ioredis()
              redis.publish('customerNotifications', JSON.stringify({
                from: "server",
                to: createdPO.purchaser,
                message: "Ticket Bought",
                redis: {
                  type: "hash",
                  key: createdPO.id,
                  data:{
                    PurchaseOrder: createdPO,
                    TicketInfo: updatedTickect
                  }
                }
              }))

              redis.publish('customerNotifications', JSON.stringify({
                from: "server",
                to: foundTicket.publisher,
                message: "Ticket Sale",
                redis: {
                  type: "hash",
                  key: createdPO.id,
                  data: {
                    PurchaseOrder: createdPO,
                    TicketInfo: updatedTickect
                  }
                }
              }))


              redis.publish('customerNotifications', JSON.stringify({
                from: "server",
                to: "all",
                message: "Ticket Sold",
                redis: {
                  type: "hash",
                  key: updatedTickect.id,
                  data: {
                    TicketInfo: updatedTickect
                  }
                }
              }))

              res.send({
                success: true,
                message: 'Purchase Complete',
                data: {
                  PurchaseOrder: createdPO,
                  TicketInfo: updatedTickect
                }
              })
            })
          })
        })
      } else {
        // available qty is violated, purchase would result in negative value
        res.send({
          success: false,
          message: 'Purchase Denied',
          error: {
            message: "Tickest Exhausted",
            data: purchaseInfo
          }
        })
      }
    // res.send(req.body)
  })

  // tickets.makePurchase(req.body.purchaseInfo).then((response) => {
    // res.send(response)
  // })
  // res.send(req.body)
}

module.exports = purchaseTicket
