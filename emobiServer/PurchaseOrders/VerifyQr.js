const Invoice = require('./Invoice.js');

function VerifyQr(req, res, error) {
  res.send(req.body)
  // Invoice.findById(req.params.invoice_id).then((results) => {
  //   if (results._id == req.body.invoice_id) {
  //
  //   }
  // })
}

module.exports = VerifyQr
