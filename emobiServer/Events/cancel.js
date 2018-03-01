const Events = require('./Events.js');
function CancelEvent(req, res) {
  let eventClass = new Events()
  eventClass.CancelEvent(req.params.eventId).then((response) => {
  if (response.success) {
    eventClass.Storage.redis.publish('customerNotifications', JSON.stringify({
      from: "server",
      to: "all",
      message: "Event Canceled",
      redis: {
        type: "JSON",
        key: req.params.eventId,
        data: response.data
      }
    }))
    res.send({
                success: true,
                message: "Event Canceled",
                updatedEvent: response.data
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
}

module.exports = CancelEvent
