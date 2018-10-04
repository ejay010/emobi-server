const PO = require('./PurchaseOrderModel.js');
const ioredis = require('ioredis');
function ProcessPurchase(req, res, error) {
  PO.findById(req.params.purchaseOrderId).then((result) => {
    // PO has been found, confirm that it is relevant to this event
    if (result != null) {
      if (result.eventId == req.params.currentEventId) {
        if (req.body.isPurchaser) {
          res.send({
            success: true,
            message: "Invoice Found",
            invoice: result,
            isPurchaser: true
          })
        } else {
          if (req.body.rsvp != null) {
            let rsvp_list = result.rsvp_list
            let ticket_found = false
            let ticket = null
            rsvp_list.forEach((rsvp) => {
              if (rsvp.email == req.body.rsvp) {
                ticket_found = true
                ticket = rsvp
              }
            })
            if (ticket_found != false) {
              res.send({
                success: true,
                message: "Ticket Validated",
                invoice: ticket,
                isPurchaser: false
              })
            } else {
              res.send({
                success: false,
                message: "Ticket not Found"
              })
            }
          }

          if (req.body.listType == 'guest') {
            let guest_list = result.guest_passes
            let ticket = guest_list[req.body.listPosition]
            if (ticket != null) {
              res.send({
                success: true,
                message: "Ticket Validated",
                ticket_info: ticket,
                purchaser: result.purchaser
              })
            } else {
              res.send({
                success: false,
                message: "Ticket not Found"
              })
            }
          }
        }
      } else {
        res.send({
            success: false,
            message: "Redemption Error",
            error: {
              message: "Redemption Error, Invalid Matchup"
            }
          })
      }
    } else {
      res.send({
        success: false,
        message: "Purchase Not Found",
      })
    }

  })
}

module.exports = ProcessPurchase
