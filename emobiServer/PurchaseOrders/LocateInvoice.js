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
            invoice: result
          })
        } else {
          if (req.body.listType == 'rsvp') {
            let rsvp_list = result.rsvp_list
            let ticket = rsvp_list[req.body.listPosition]
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
