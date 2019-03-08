const request = require('request');
const xml = require('xml');
function validateScan(req, res, error) {
console.log('we got a hit');
console.log(req.body);
    let WebHookUrl = 'https://hooks.slack.com/services/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'
    request.post(WebHookUrl, req.body)
    // res.send(req.body)
    let responsebody = {
      message: [{
        status: 1,
        text: 'Thanks for playing'
      }]
    }
    let xmlstring = xml(responsebody)
    console.log(xmlstring);
    res.send(xmlstring)
}

module.exports = validateScan
