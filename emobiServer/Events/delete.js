const Events = require('./Events-mongo.js');
const ioredis = require('ioredis');

function DeleteEvent(req, res) {
  Events.remove({'_id': req.params.eventId}).then((error) => {
    if (error.ok) {
      let redis = new ioredis()
      
                redis.publish('customerNotifications', JSON.stringify({
                            from: "server",
                            to: "all",
                            message: "Event Deleted",
                            redis: {
                              type: "hash",
                              key: req.params.eventId,
                            }
                          }));

      res.send({
        success: true,
        message: 'Event Deleted',
        data: {
          _id: req.params.eventId
        }
      })
    } else {
      res.send({
        error
      })
    }
  })
}

module.exports = DeleteEvent
