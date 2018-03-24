const PurchaseOrders = require('../PurchaseOrders').Class;
function fetchPurchasedTickets(req, res, error) {
  PurchaseOrders.find({'purchaser': req.params.customer}).populate('eventId').populate('ticketId').exec().then((results) => {
    res.send({
      success: true,
      message: 'Fetched Purchased Tickets',
      PurchasedTickets: results
    })
  })
}

module.exports = fetchPurchasedTickets
