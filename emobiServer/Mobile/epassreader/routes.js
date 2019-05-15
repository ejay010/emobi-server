const jwt = require('jsonwebtoken');
const Events = require('../../Events').Class;
const Invoice = require('../../PurchaseOrders').Model;

function routes(app, passport) {
  app.post('/mobile/epassreader/login', passport.authenticate('administrators', {session: false}),
  res.json({message: "cookies"})
    // function (req, res, error) {
    //   let user = req.user
    //   const token = jwt.sign({user: user}, 'batman')
    // res.json({user, token})
    })
    app.get('/mobile/epassreader/events', passport.authenticate('jwt', {session: false}), function (req, res, error) {
      let events = Events.find({status: "published"}).exec(function (err, results) {
        res.json({events: results})
      })
    })
    app.post('/mobile/epassreader/:invoice_id/verifyqr', passport.authenticate('jwt', {session: false}), function (req, res, error) {
      Invoice.findById(req.params.invoice_id).then((results, error) => {
        // scanner must be on appropriate event and the invoice must be for that event
        if (error == null) {
          if (results.eventId == req.body.scanner_event_id) {
            res.json({invoice: results, success: true})
          } else {
            res.json({
              success: false,
              message: 'Incorrect Event'
            })
          }
        } else {
          res.json({
            success: false,
            message: 'Error Locating Invoice'
          })
        }
      })
    })

    app.post('/mobile/epassreader/:invoice_id/redeemqr', passport.authenticate('jwt', {session: false}), function (req, res, error) {
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
                res.json(err)
              } else {
                res.json({
                  success: true,
                  message: "Invoice Updated",
                  invoice: updated_result
                })
              }
            })
          }
        } else {
          res.json({
            success: false,
            message: 'Invoice not found'
          })
        }
      })
    })
}

module.exports = routes
