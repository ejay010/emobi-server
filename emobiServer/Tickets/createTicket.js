const Tickets = require('./tickets.js');


function createTicket(req, res, error) {
  let tickets = new Tickets()
  tickets.create(req.body).then((response) => {
    res.send(response)
  })
}

module.exports = createTicket
