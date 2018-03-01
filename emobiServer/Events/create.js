const Events = require('./Events.js');

function create(req, res) {
  let events = new Events();
  let seedData = {
    title: req.body.eventSeeds.eventName,
    publisher: req.body.user.email,
    eventType: req.body.eventSeeds.eventType,
    category: req.body.eventSeeds.eventPurpose,
  }
  events.Create(seedData).then((response) => {
    res.send({
      success: true,
      message: "Event Created",
      response: response
    })
  })
}

module.exports = create
