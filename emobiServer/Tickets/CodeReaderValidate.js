const builder = require('xmlbuilder');
function validateScan(req, res, error) {
console.log('we got a hit');
console.log(req.body);
    let responsebody = builder.create({
      message: {
        status: 1,
        text: 'Thanks for playing'
      }
    })
    // let xmlstring = xml(responsebody)
    console.log(responsebody);
    res.type('application/xml')
    res.send(responsebody)
}

module.exports = validateScan
