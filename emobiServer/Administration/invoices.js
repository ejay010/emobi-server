const PurchaseOrders = require('../PurchaseOrders').Model;
function invoices(req, res, error) {
  switch (req.params.query) {
    case 'fetchAll':
      PurchaseOrders.find({}).populate('eventId').populate('ticketId').exec(function (err, results) {
        if (err) {
          res.status(500).json({message: err})
        } else {
          res.json(results)
        }
      })
      break;
    default:
    res.status(500).json({message: 'Invalid request'})
  }
}

module.exports = invoices
