const twilio = require('twilio');

function MMS(req, res, error) {
  let accountSid = process.env.TWILIO_SID
  let authToken = process.env.TWILIO_TOKEN

  client = new twilio(accountSid, authToken)

  client.messages.create({

  })
}

module.exports = MMS
