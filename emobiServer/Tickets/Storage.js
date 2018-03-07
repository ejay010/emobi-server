const ioredis = require('ioredis');

function Store() {
  this.redis = new ioredis()

  this.createTicket = (ticketData) => {
    return this.redis.incr(ticketData.eventId+'tickets').then((response) => {
      if (response) {
        let key = 'ticket:'+response // genrate event ID
        EventClass.rediskey = key // add it to seed Data
        // Add it to the general events collection
        return this.addToEventsCollection(customerClass, EventClass).then((response) => {
          if (response) {
            // Brodcast to user
            this.redis.publish('customerNotifications', JSON.stringify({
              from: "server",
              to: EventClass.publisher,
              message: "Event Created",
              redis: {
                type: "hash",
                key: key,
                data: EventClass
              }
            }))
            return EventClass;
          }
        })
      }
    })
  }
}

module.exports = Store
