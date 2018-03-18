const Events = require('./Events-mongo.js');
const ioredis = require('ioredis');

function create(req, res) {
  let redis = new ioredis()

  let seedData = {
    title: req.body.eventSeeds.eventName,
    publisher: req.body.user.email,
    eventType: req.body.eventSeeds.eventType,
    category: req.body.eventSeeds.eventPurpose,
  }
  Events.create(seedData).then((response) => {
    redis.publish('customerNotifications', JSON.stringify({
      from: "server",
      to: response.publisher,
      message: "Event Created",
      redis: {
        type: "hash",
        key: response.id,
        data: response
      }
    }))

    res.send({
      success: true,
      message: "Event Created",
      response: response
    })
  })
}

module.exports = create
