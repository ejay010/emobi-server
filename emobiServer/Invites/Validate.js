const Invite = require('./invite.js');

function Validate(req, res, error) {
  Invite.findById(req.params.invite_id, function (error, docs) {
    if (docs.status != 'Confirmed') {
      res.send({
        Valid: true
      })
    } else {
      res.send({
        Valid: false
      })
    }
  })
}

module.exports = Validate
