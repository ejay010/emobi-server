const builder = require('xmlbuilder');
function validateScan(req, res, error) {
console.log('we got a hit2');
    let responsebody = builder.create({
      message: {
        status: 1,
        text: 'Thanks for playing'
      }
    })
    // console.log(res);
    // let responsebody = 'hello'
    // let xmlstring = xml(responsebody)
    // console.log(responsebody);
    res.type('text/xml')
    res.send(responsebody)
}

module.exports = validateScan
