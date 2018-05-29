const Events = require('./Events-mongo.js');
const ioredis = require('ioredis');

function CancelEvent(req, res) {
  let redis = new ioredis()
  Events.findById(req.params.eventId).populate('tickets').then((response) => {
    if (response) {
      response.status = 'unpublished'
      response.save().then((response) => {
        redis.publish('customerNotifications', JSON.stringify({
          from: "server",
          to: "all",
          message: "Event Canceled",
          redis: {
            type: "JSON",
            key: response.id,
            data: response
          }
        }))

        res.send({
          success: true,
          message: "Event Canceled",
          updatedEvent: response
        })
      })
    } else {
      res.send({
        success: false,
        message: "Event Not Canceled",
        error: {
          message: "Event not found, could not cancel"
        }
      })
    }
  })
  // eventClass.CancelEvent(req.params.eventId).then((response) => {
  // if (response.success) {
  //   eventClass.Storage.redis.publish('customerNotifications', JSON.stringify({
  //     from: "server",
  //     to: "all",
  //     message: "Event Canceled",
  //     redis: {
  //       type: "JSON",
  //       key: req.params.eventId,
  //       data: response.data
  //     }
  //   }))
  //   res.send({
  //               success: true,
  //               message: "Event Canceled",
  //               updatedEvent: response.data
  //             })
  // } else {
  //   res.send({
  //                       success: false,
  //                       message: "Event Not Canceled",
  //                       error: {
  //                         message: "Event not found, could not cancel"
  //                       }
  //                     })
  // }
  // })
}

module.exports = CancelEvent
