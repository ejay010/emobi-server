const ioredis = require('ioredis');

function Store() {
  this.redis = new ioredis()

  this.CreateTicket = (ticketData) => {
    return this.redis.incr(ticketData.eventId+':tickets-counter').then((response) => {
      if (response) {
        let key = 'ticket:'+response // generate event ID
        ticketData.rediskey = key // add it to seed Data
        // Add it to the general events collection
      return this.addToTicketsCollection(ticketData).then((response) => {
          if (response) {
            this.AddToEvent(ticketData.eventId, ticketData.rediskey).then((response) => {
              if (response) {
                // Brodcast to user
                this.redis.publish('customerNotifications', JSON.stringify({
                  from: "server",
                  to: ticketData.publisher,
                  message: "Ticket Created",
                  redis: {
                    type: "hash",
                    key: key,
                    data: ticketData
                  }
                }))

                return ticketData
              }
            })
          }
        })
      }
    })
  },

  this.addToTicketsCollection = (ticketData) => {
    return this.redis.sadd(ticketData.publisher+':CreatedTickets', JSON.stringify({ticketId: ticketData.rediskey, eventId: ticketData.eventId})).then((response) => {
      if (response) {
        return this.redis.hmset(ticketData.rediskey, ticketData).then((response) => {
          if (response == "OK") {
            return this.redis.sadd('CreatedTickets', ticketData.rediskey).then((response) => {
              return response
            })
          }
        })
      }
    })
  }

  this.AddToEvent = (eventId, ticketId) => {
    return this.redis.hgetall(eventId).then((response) => {
      console.log(response);
      if (response.ticketskeys == null) {
        response.ticketskeys = JSON.stringify([ticketId])
      } else {
        let currentTickets = JSON.parse(response.ticketskeys)
        currentTickets.push(ticketId);
        response.ticketskeys = JSON.stringify(currentTickets)
      }
      return this.redis.hmset(eventId, response).then((response) => {return response})
    })
  }

  this.FindById = (rediskey) => {
    return this.redis.hgetall(rediskey)
  }

  this.DeleteById = (rediskey, customerId) => {
    return this.redis.srem(customerId+':CreatedTickets', rediskey).then((response) => {
      if (response) {
        return this.redis.srem('CreatedTickets', rediskey).then((response) => {
          if (response) {
            return this.redis.del(rediskey).then((response) => {
              return response
            })
          }
        })
      }
    })
  }

  this.Update = (rediskey, newData) => {
    return this.redis.hgetall(rediskey).then((response) => {
      if (response) {
        return this.redis.hmset(rediskey, newData)
      }
    })
  }
}

module.exports = Store
