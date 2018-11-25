const customer = require('../Customer').Class;
const Events = require('../Events').Class;
const Invoices = require('../PurchaseOrders').Model;

function Customers(req, res, error) {
  switch (req.params.query) {
    case 'fetchAll':
      customer.find({}, function (error, results) {
        if (error) {
          res.status(404).json(error)
        } else {
          res.json(results)
        }
      })
      break;
      case 'cif':
      customer.findById(req.query.customer, function (err, results) {
        if (!err) {
          let customerData = results
            let customerEvents = []
            let customerInvoices = []
          // find events
          Events.find({publisher: customerData.email}).populate('tickets').exec(function (err, eventData) {
            if (!err) {
              let customerEvents = eventData
              // find Invoices
               Invoices.find({purchaser: customerData.email}).populate('eventId').populate('ticketId').exec(function (err, invoiceData) {
                if (!err) {
                  let customerInvoices = invoiceData
                  res.json({customer: customerData, events: customerEvents, invoices: customerInvoices})
                } else {
                  res.json({customer: customerData, events: customerEvents, invoices: customerInvoices})                  
                }
                // Build object
              })
            }
          })
        } else {
          res.status(404).json({message: 'Invalid Id', error: err})
        }
      })
      break;
    default:
    res.status(500).json({message: 'Invalid query'})

  }
}

module.exports = Customers
