const Events = require('./Events.js');
function DeleteEvent(req, res) {
  let eventsClass = new Events()
  console.log(req.user);
}

module.exports = DeleteEvent
