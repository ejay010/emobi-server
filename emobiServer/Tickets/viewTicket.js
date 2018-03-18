const Tickets = require('./tickets.js');

function ViewTicket(req, res, error) {
  let ticket = new Tickets()
  ticket.FindTicket(req.params).then((response) => {
    res.send(response);
  })
}

module.exports = ViewTicket
