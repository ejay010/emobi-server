const Events = require('../Events').Class;
function events(req, res, error) {
  switch (req.params.query) {
    case 'fetchAll':
      Events.find({}).populate('tickets').exec((function (err, results) {
        if (err) {
          res.status(500).json({ error: err})
        } else {
          res.json(results)
        }
      }))
      break;
    default:
      res.status(500).json({message: 'Invalid request'})
  }
}

module.exports = events
