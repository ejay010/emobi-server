const ioredis = require('ioredis');

function Store() {
  this.redis = new ioredis()

  this.CreateTicket = (ticketData) => {
    return this.redis.incr(ticketData.eventId+'tickets').then((response) => {
      if (response) {
        let key = 'ticket:'+response // genrate event ID
        ticketData.rediskey = key // add it to seed Data
        // Add it to the general events collection
      }
    })
  }
}

module.exports = Store
