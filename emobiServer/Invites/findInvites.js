const Invite = require('./invite.js');
const Tickets = require('../Tickets').Class;

function FindAll(req, res, error) {
  let response_object = {
    ticket: {},
    invites: []
  }
  Invite.find({ticketId: req.params.ticket_id}, 'name status email').then((results) => {
    // res.send(results)
    response_object.invites = results
    Tickets.findById(req.params.ticket_id).then((foundTicket) => {
      response_object.ticket = foundTicket
      res.send(response_object)
    })
  })
}

module.exports = FindAll
