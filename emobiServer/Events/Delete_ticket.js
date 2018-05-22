const Events = require('./Events-mongo.js');
const ioredis = require('ioredis');
const Tickets = require('../Tickets').Class;

function deleteTicket(req, res, error) {
  Events.findById(req.params.eventId).then((subject_event) => {
    let current_tickets = subject_event.tickets
    let subject_ticket_position = current_tickets.findIndex((element) => {
      if (element == req.params.ticketId) {
        return true
      } else {
        return false
      }
    })

    if (subject_ticket_position != -1) {
      let deleted_ticket_Id = current_tickets.splice(subject_ticket_position, 1)

      Tickets.findByIdAndRemove(deleted_ticket_Id).then((removed) => {
        let redis = new ioredis()
        redis.publish('customerNotifications', JSON.stringify({
                    from: "server",
                    to: "all",
                    message: "Ticket Deleted",
                    redis: {
                      data: removed
                    }
                  }))

                  subject_event.tickets = current_tickets
                  Events.findByIdAndUpdate(req.params.eventId, subject_event).exec()

                  redis.publish('ticket-update', JSON.stringify({
                    message: "Ticket Deleted",
                    ticket: removed
                  }))
        res.send({
          success: true,
          message: "Ticket Deleted",
          data: {
            deleted: removed
          }
        })
      })
    } else {
      res.send({
        success: false,
        message: "Ticket Not Found",
      })
    }
  })
}

module.exports = deleteTicket
