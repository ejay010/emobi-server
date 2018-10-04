const Invite = require('./invite.js');

function ConfirmRsvp(req, res, error) {
  res.send(req.params)
}

module.exports = ConfirmRsvp
