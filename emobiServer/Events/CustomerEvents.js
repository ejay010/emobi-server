const Events = require('./Events-mongo.js');
function CustomerEvents(req, res, error) {
  Events.find({ publisher: req.params.email }).populate('tickets').then((response) => {
    res.send({
      data: response
    })
  })
}

module.exports = CustomerEvents
