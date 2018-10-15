const Invoices = require('./Invoice.js');

function CustomerPurchases(req, res, error) {
  Invoices.find({ purchaser: req.params.email }).populate(['eventId', 'ticketId']).then((response) => {
    res.send({
      data: response
    })
  })
}

module.exports = CustomerPurchases
