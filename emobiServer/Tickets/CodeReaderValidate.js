const builder = require('xml-js');
function validateScan(req, res, error) {
console.log('we got a hit2');
console.log(req.body);

    let resj = builder.js2xml({
      message: {
        status: 1,
        text: 'Thanks for playing'
      }
    }, {compact: true})
    console.log(resj);
    // let responsebody = 'hello'
    // let xmlstring = xml(responsebody)
    // console.log(responsebody);
    res.type('text/xml').send(resj)
}

module.exports = validateScan
