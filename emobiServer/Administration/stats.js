const Events = require('../Events').Class;
const Customer = require('../Customer').Class;
const Invoices = require('../PurchaseOrders').Model;
const Tickets = require('../Tickets').Class;

function stats(req, res, error) {
  switch (req.params.query) {
    case 'count':
      let data = {}
      Events.find({}, function (err, docs) {
        if (!err) {
          data.events = docs.length
        } else {
          data.events = 0
        }
        Customer.find({}, function (err, docs) {
          if (!err) {
            data.customers = docs.length
          } else {
            data.customers = 0
          }
          Invoices.find({}, function (err, docs) {
            if (!err) {
              data.invoices = docs.length
            } else {
              data.invoices = 0
            }
            Tickets.find({}, function (err, docs) {
              if (!err) {
                data.tickets = docs.length
              } else {
                data.tickets = 0
              }
              res.json(data)
            })
          })
        })
      })

      break;
    default:
      res.status(500).json({ error: 'Invalid request'})
  }
}

module.exports = stats
