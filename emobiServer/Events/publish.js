const Events = require('./Events.js');
const Storage = require('./Storage.js');

function PublishEvent(req, res) {
  let eventClass = new Events();
  return eventClass.PublishEvent(req.params.eventId).then((response) => {
    if (response.success) {
      let DB = new Storage()
      DB.redis.publish('customerNotifications', JSON.stringify({
        from: "server",
        to: "all",
        message: "Event Published",
        redis: {
          type: "JSON",
          key: req.params.eventId,
          data: response.data
        }
      }))
      res.send({
        success: true,
        message: "Event Published",
        updatedEvent: response.data
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
}
module.exports = PublishEvent
