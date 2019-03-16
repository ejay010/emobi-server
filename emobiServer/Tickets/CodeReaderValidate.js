const builder = require('xml-js');
const querystring = require('querystring');
function validateScan(req, res, error) {

let ticketstring = querystring.parse(req.body.tid)
console.log(ticketstring);

let lead = '<?xml version="1.0" encoding="UTF-8"?>'

    let resj = builder.js2xml({
      xml: {
        message: {
          status: 1,
          text: 'Thanks for playing'
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
