const builder = require('xml-js');
const querystring = require('querystring');
const Invoice = require('../PurchaseOrders').Model;


function validateScan(req, res, error) {
let ticketscan = querystring.parse(req.body.tid)
console.log(ticketscan);
console.log(ticketscan['?invoiceId']);
// let invoiceInfo = Invoice.findById(ticketscan['?invoiceId'])

let lead = '<?xml version="1.0" encoding="UTF-8"?>'

    let resj = builder.js2xml({
      xml: {
        message: {
          status: 1,
          text: 'Thanks for playing local'
        }
      }
    }, {compact: true})
    console.log(resj);

    // let responsebody = 'hello'
    // let xmlstring = xml(responsebody)
    // console.log(responsebody);
    res.type('text/xml').send(lead + resj)
}

module.exports = validateScan
