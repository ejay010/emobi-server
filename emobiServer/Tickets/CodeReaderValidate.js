const request = require('request');
function validateScan(req, res, error) {

    let WebHookUrl = 'https://hooks.slack.com/services/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'
    request.post(WebHookUrl, req.body)
    res.send(req.body)

}

module.exports = validateScan
