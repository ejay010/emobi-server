const builder = require('xml-js');
function validateScan(req, res, error) {
console.log('we got a hit2');

    let res = builder.js2xml({
      message: {
        status: 1,
        text: 'Thanks for playing'
      }
    }, {compact: true})
    console.log(res);
    // let responsebody = 'hello'
    // let xmlstring = xml(responsebody)
    // console.log(responsebody);
    res.type('text/xml').send(res)
}

module.exports = validateScan
