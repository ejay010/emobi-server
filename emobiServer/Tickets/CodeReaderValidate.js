const builder = require('xmlbuilder');
function validateScan(req, res, error) {
console.log('we got a hit2');
    // let responsebody = builder.create({
    //   message: {
    //     status: 1,
    //     text: 'Thanks for playing'
    //   }
    // })
    let responsebody = builder.create('message')
    responsebody.ele('status', 1)
    responsebody.ele('text', 'Thanks for playing')
    responsebody.end({ pretty: true})
    console.log(responsebody);
    // console.log(res);
    // let responsebody = 'hello'
    // let xmlstring = xml(responsebody)
    // console.log(responsebody);
    res.type('text/xml')
    res.send(responsebody)
}

module.exports = validateScan
