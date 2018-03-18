const Tickets = require('./tickets-mongo.js');
const fs = require('fs');
const EventClass = require('../Events').Class;

function createTicket(req, res, error) {
  if (req.file != null) {
    fs.rename(req.file.path, req.file.path+'-'+req.file.originalname, function (error) {
      if (error) {
        console.log(error);
      }
    })
  }
  let customerData = JSON.parse(req.body.seedData)
  customerData.publisher = req.params.customer
  customerData.ticket_image = JSON.stringify(req.file)
  customerData.eventId = req.params.eventId

Tickets.create(customerData).then((createdTicket) => {
  if (createdTicket) {
    EventClass.findById(createdTicket.eventId).then((customerEvent) => {
      let currentTickets = customerEvent.ticketKeys
      currentTickets.push(createdTicket.id)
      customerEvent.ticketKeys = currentTickets
      customerEvent.save().then((response) => {
        res.send({
          success: true,
          message: "Ticket Created",
          data: response
        })
      })
    })
  }
})

  // let tickets = new Tickets()
  // let customerData = JSON.parse(req.body.seedData)
  // customerData.eventId = req.params.eventId
  // customerData.ticket_image = JSON.stringify(req.file)
  // let events = new EventClass()
  // events.GetEvent(customerData.eventId).then((response) => {
  //   tickets.CreateTicket(response, customerData).then((response) => {
  //     res.send(response)
  //   })
  // })
}

module.exports = createTicket
