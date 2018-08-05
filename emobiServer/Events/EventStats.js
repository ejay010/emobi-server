const Events = require('./Events-mongo.js');
const Invoice = require('../PurchaseOrders/PurchaseOrderModel.js');

async function findInvoices(customerEvents, cb) {
  let promise = new Promise(function(resolve, reject) {
    let invoiceContainer = []
    let inputCounter = 0
    function onResult(result) {
      invoiceContainer.push(result)
      if (++inputCounter >= (customerEvents.tickets.length)) {
        resolve(invoiceContainer)
      }
    }
    for (var i = 0; i < customerEvents.tickets.length; i++) {
      Invoice.find({ticketId: customerEvents.tickets[i]._id}).then(onResult)
    }
  });
  let results = await promise
  cb(results)
}

function EventStats(req, res, error) {
  Events.findById(req.params.eventId).populate('tickets').then((customerEvent) => {
    findInvoices(customerEvent, function (results) {
      res.send({eventDetails: customerEvent, invoices: results})
    })
  })
}


module.exports = EventStats
