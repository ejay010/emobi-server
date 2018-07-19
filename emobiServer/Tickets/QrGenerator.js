const awesomeQR = require('awesome-qr');
const querystring = require('querystring');
const Invoice = require('../PurchaseOrders/PurchaseOrderModel.js');

function GenerateQRCode(req, res, error) {
  // find the ticket
  Invoice.findById(req.params.invoiceId).then((result) => {
    if ((result != null) && (result.eventId == req.params.eventId)) {
      // correct ticket match up, check for queries
      // res.send(result)
      if (Object.keys(result).length <= 0) {
        // Call up awesomeQR
        new awesomeQR().create({
          text: 'hello',
          size: 500,
          callback: (data) => {
            res.write(data)
          }
        })
      } else {
        if (req.query.purchaser == result.purchaser) {
          let raw = "?eventId=" + result.eventId + "&invoiceId=" + result._id + "&isPurchaser=" + result.purchaser
          console.log(result);
          let raw2 = {
            eventId: ""+result.eventId+"",// This is fucking weird :PPPPP
            invoiceId: ""+result._id+"",
            isPurchaser: true}
            console.log(raw2);
          let string = querystring.stringify(raw2)
          console.log(string);
          new awesomeQR().create({
            text: string,
            size: 500,
            callback: (data) => {
              res.write(data)
              res.end()
            }
          })
        } else {
          res.status(401).send('Page Not Found')
        }
      }
    }
  })
}

module.exports = GenerateQRCode
