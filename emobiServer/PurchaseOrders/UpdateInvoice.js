const Invoice = require('./Invoice.js');
function UpdateInvoice(req, res, error) {
  Invoice.findById(req.params.purchaseOrderId).then((result, error) => {
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
      let changeCount = 0
      new_guestlist.forEach((spot, spot_index) => {
        if (spot.guest_spot == false) { // check to see if we are on a rsvp
          if (spot.email == current_guestlist[spot_index].email) { // compare list contents and verify person is on both lists
            if (spot.outstanding != current_guestlist[spot_index].outstanding) { // check to see if this person checked in
              if ((spot.outstanding == false) && (current_guestlist[spot_index].outstanding == true)) {
                // person has arrived update, document record
                changeCount += 1
                result.contents[spot_index].outstanding = spot.outstanding // This line updates the document's record
                result.markModified('contents')
                // Since we have rsvp list
                result.rsvp_list.forEach((rsvp) => {
                  if (rsvp.email == spot.email) {
                    rsvp.outstanding = false
                  }
                })
                result.markModified('rsvp_list')
              }
            }
          }
        } else {
          if ((spot.outstanding == false) && (current_guestlist[spot_index].outstanding == true)) {
            changeCount += 1
            result.contents[spot_index].outstanding = spot.outstanding // this is for guest spots
            result.markModified('contents')
            let usedGuestPasses = 0

            for (var i = 0; i < result.guest_passes.length; i++) {
              if (usedGuestPasses <= 0) {
                result.guest_passes[i].outstanding = false
                usedGuestPasses += 1
              }
            }
            result.markModified('guest_passes')
          }
        }
      }) // end of foreach scan
      // res.send({count: changeCount})
      console.log(result);

      result.save().then((updatedItem) => {
        res.send({
          success: true,
          message: "Invoice Updated",
          invoice: updatedItem
        })
      })
    }

  })
}

module.exports = UpdateInvoice
