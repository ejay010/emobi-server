const Events = require('./Events-mongo.js');
const Storage = require('./Storage.js');
const ioredis = require('ioredis');
const io = require('socket.io')();
function PublishEvent(req, res) {

  Events.findById(req.params.eventId).populate('tickets').then((response) => {
    if (response) {
      let current = response
      let redis = new ioredis()
      current.status = "published"
      current.save().then((response) => {
        redis.publish('CUSTOMER_NOTIFICATION', JSON.stringify({
          from: "server",
          to: "all",
          message: "EVENT_PUBLISHED",
          redis: {
            type: "JSON",
            key: response.id,
            data: response
          }
        }))

        res.send({
          success: true,
          message: "Event Published",
          updatedEvent: response
        })

      })
    } else {
      res.send({
        success: false,
        message: "Event Not Published",
        error: {
          message: "Event Publishing Failed"
        }
      })
    }
  })
  // return eventClass.PublishEvent(req.params.eventId).then((response) => {
  //   if (response.success) {
  //     let DB = new Storage()
  //     DB.redis.publish('customerNotifications', JSON.stringify({
  //       from: "server",
  //       to: "all",
  //       message: "Event Published",
  //       redis: {
  //         type: "JSON",
  //         key: req.params.eventId,
  //         data: response.data
  //       }
  //     }))
  //     res.send({
  //       success: true,
  //       message: "Event Published",
  //       updatedEvent: response.data
  //     })
  //
  //   } else {
  //     res.send({
  //       success: false,
  //       message: "Event Not Published",
  //       error: {
  //         message: "Event Publishing Failed"
  //       }
  //     })
  //   }
  // })
}
module.exports = PublishEvent
