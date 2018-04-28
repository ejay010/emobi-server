const Events = require('./Events-mongo.js');
function publicEvents(req, res, error) {
  // let events = new Events()

Events.findById(req.params.eventkey).populate('tickets').then((response) => {
  if (response != null) {
    if (response.eventType == 'public') {
        if (response.publisher == req.params.email) {
          if (response.status == 'published') {
            res.send(response)
          }
        }
      }
  }
  res.send(response)
})
}

module.exports = publicEvents
