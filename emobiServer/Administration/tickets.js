const Tickets = require('../Tickets').Class;
function tickets(req, res, err) {
  switch (req.params.query) {
    case 'fetchAll':
      Tickets.find({}).populate('eventId').exec(function (err, results) {
        if (err) {
          res.status(500).json({ error: err})
        } else {
           res.json(results)
        }
      })
      break;
    default:
      res.status(500).json({ message: 'Invalid request'})
  }
}

module.exports = tickets
