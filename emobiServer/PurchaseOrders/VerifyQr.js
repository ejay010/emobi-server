const Invoice = require('./Invoice.js');

function VerifyQr(req, res, error) {
  // res.send(req.body)
  console.log(req.body);
  Invoice.findById(req.params.invoice_id).then((results, error) => {
    // scanner must be on appropriate event and the invoice must be for that event
    if (error == null) {
      if (results.eventId == req.body.scanner_event_id) {
        res.send({invoice: results, success: true})
      } else {
        res.send({
          success: false,
          message: 'Incorrect Event'
        })
      }
    } else {
      res.send({
        success: false,
        message: 'Error Locating Invoice'
      })
    }

  })
}

module.exports = VerifyQr
