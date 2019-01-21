const Invoice = require('./Invoice.js');
function UpdateInvoice(req, res, error) {
  console.log('incoming request');
  console.log(req.body);
  Invoice.findById(req.params.invoice_id).then((result, error) => {
    if (result != null) {
      if (result.eventId == req.body.scanner_event_id) {
        // event confirmed via scanner
        //find contents

        //update contents
        let old_contents = result.contents
        let guest_count = 0
        for (var i = 0; i < req.body.GuestList.length; i++) {
          if (req.body.GuestList[i].rsvp == false) {
            guest_count += 1
          }
        }
        for (var i = 0; i < old_contents.length; i++) {
          if (old_contents[i].guest_spot == false) { // if rsvp
            if (old_contents[i].email == req.body.GuestList[i].email) {
              old_contents[i].scanned_in = true
              result.invoice_life -= 1
            }
          }
          // add guest_spot check
          console.log(guest_count);

          if ((old_contents[i].guest_spot) && (guest_count > 0)) {
            if (old_contents[i].scanned_in != true) {
              old_contents[i].scanned_in = true
              guest_count -= 1
              result.invoice_life -= 1
            }
          }
        }
        result.contents = old_contents
        result.markModified('contents')
        result.markModified('invoice_life')

        result.save(function (err, updated_result) {
          if (err) {
            console.log(err);
            res.send(err)
          } else {
            res.send({
              success: true,
              message: "Invoice Updated",
              invoice: updated_result
            })
          }
        })
      }
    } else {
      res.send({
        success: false,
        message: 'Invoice not found'
      })
    }
  })
}

module.exports = UpdateInvoice
