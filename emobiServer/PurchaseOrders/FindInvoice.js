const Invoice = require('./PurchaseOrderModel.js');

function FindInvoice(req, res, error) {
  Invoice.findById(req.params.invoice_id).populate('eventId').populate('ticketId').then((results) => {
    // res.send(results)
    if (results.purchaser == req.user.email) {
      res.send(results)
    }
  })
}

module.exports = FindInvoice
