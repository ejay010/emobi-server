const Tickets = require('./tickets-mongo.js');
const fs = require('fs');
const EventClass = require('../Events').Class;
const ioredis = require('ioredis');

function createTicket(req, res, error) {
  if (req.file != null) {
    fs.rename(req.file.path, req.file.path+'-'+req.file.originalname, function (error) {
      if (error) {
        console.log(error);
      }
    })
  }
  let customerData = JSON.parse(req.body.seedData)
  console.log(customerData);
  customerData.publisher = req.params.customer
  customerData.ticket_image = JSON.stringify(req.file)
  customerData.eventId = req.params.eventId

Tickets.create(customerData).then((createdTicket) => {
  if (createdTicket) {
    EventClass.findById(createdTicket.eventId).then((customerEvent) => {
      let currentTickets = customerEvent.tickets
      currentTickets.push(createdTicket.id)
      customerEvent.tickets = currentTickets
      customerEvent.save().then((response) => {
        // let redis = new ioredis()
        // redis.publish('customerNotifications', JSON.stringify({
        //   from: "server",
        //   to: response.publisher,
        //   message: "Ticket Created",
        //   redis: {
        //     type: "hash",
        //     key: createTicket.id,
        //     data: createdTicket
        //   }
        // }))
          EventClass.findById(response._id).populate('tickets').then((results) => {
            // redis.publish('eventViewNotification', JSON.stringify({
            //   from: 'server',
            //   to: customerEvent._id,
            //   message: "Event Updated",
            //   data: createdTicket
            // }))
            res.send({
              success: true,
              message: "Ticket Created",
              data: createdTicket
            })
          })
      })
    })
  }
})

}

module.exports = createTicket
