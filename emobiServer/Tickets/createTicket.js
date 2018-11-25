const Tickets = require('./tickets-mongo.js');
const fs = require('fs');
const EventClass = require('../Events').Class;
const ioredis = require('ioredis');
const jimp = require('jimp');
const probe = require('probe-image-size');


function createTicket(req, res, error) {
  // console.log(req.file);
  if (req.file != null) {
        console.log('inside loop');
    fs.rename(req.file.path, req.file.path+'-'+req.file.originalname, function (error) {
      if (error) {
        console.log(error);
      }
      else {
        jimp.read(req.file.path+'-'+req.file.originalname, (err, originalImage) => {
          if (err) {
            console.log(err);
          }
          originalImage.resize(100, jimp.AUTO).write(req.file.path+'-ticket_stub-'+req.file.originalname)
        })
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
