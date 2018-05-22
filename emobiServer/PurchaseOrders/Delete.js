const Invoice = require('./PurchaseOrderModel.js');
function DeleteInvoice(req, res, error) {
  Invoice.findByIdAndRemove(req.params.invoice_id).then((response) => {
    res.send({
      success: true,
      message: 'Invoice Deleted',
      invoice: response
    })
  })
}

module.exports = DeleteInvoice
