const PO = require('./PurchaseOrder.js');
const ioredis = require('ioredis');
function ProcessPurchase(req, res, error) {
  PO.findById(req.params.purchaseOrderId).then((result) => {
    // PO has been found, confirm that it is relevant to this event
    if (result.eventId == req.params.currentEventId) {
      // if the current event is relevant to this purchaseOrder, update PO's qty available
      if (result.qty_available != 0) {
        if ((result.qty_available -= 1) >= 0) {
          result.qty_available -= 1
        } else {
          result.qty_available = 0
        }

        result.save().then((updatedResult) => {
          // notify customer and host of successful ticket redeemtion
          updatedResult.populate('eventId').populate('ticketId').execPopulate().then((popResult) => {
            let redis = new ioredis()
            redis.publish('customerNotifications', JSON.stringify({
              from: "server",
              to: popResult.purchaser,
              message: "Redemption Successful",
              redis: {
                type: "hash",
                key: popResult.id,
                data:{
                  PurchaseOrder: popResult,
                }
              }
            }))

            redis.publish('customerNotifications', JSON.stringify({
              from: "server",
              to: popResult.eventId.publisher,
              message: "Redemption Successful",
              redis: {
                type: "hash",
                key: popResult.id,
                data: {
                  PurchaseOrder: popResult
                }
              }
            }))

            res.send({
              success: true,
              message: "Redemption Successful",
              data: popResult
            })
          })
        })

      } else {
        res.send({
          success: false,
          message: "Tickets Exhausted"
          data: result
        })
      }
    } else {
      res.send({
        success: false,
        message: "Redemption Error",
        error: {
          message: "Redemption Error, Wrong Ticket"
        }
      })
    }
  })
}

module.exports = ProcessPurchase
