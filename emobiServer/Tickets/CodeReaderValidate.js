const builder = require('xml-js');
function validateScan(req, res, error) {
console.log('we got a hit2');
console.log('params');
console.log(req.params);
console.log('query');
console.log(req.query);
console.log('body');
console.log(req.body);
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
