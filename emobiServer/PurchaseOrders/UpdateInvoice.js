const Invoice = require('./PurchaseOrderModel.js');
function UpdateInvoice(req, res, error) {
  Invoice.findById(req.params.purchaseOrderId).then((result) => {
    //will recieve guest list with updated status

    let new_guestlist = req.body.GuestList
    let current_guestlist = result.contents

    //sanity check
    if (new_guestlist.length != current_guestlist.length) {
      res.send({
        success: false,
        message: "Guest List Invalid",
        error: "Guest list comparison does not match"
      })
    } else {
      new_guestlist.forEach((spot, spot_index) => {
        if (spot.guest_spot == false) { // check to see if we are on a rsvp
          if (spot.email == current_guestlist[spot_index].email) { // comparison of list contents and verify person is on both lists
            if (spot.outstanding != current_guestlist[spot_index].outstanding) { // check to see if this person checked in
              result.contents[spot_index].outstanding = spot.outstanding // This line updates the document's record
            }
          }
        } else {
          result.contents[spot_index].outstanding = spot.outstanding // this is for guest spots
        }
      })
      result.save().then((response) => {
        res.send({
          success: true,
          message: "Invoice Updated",
          invoice: response
        })
      })
    }

  })
}

module.exports = UpdateInvoice
