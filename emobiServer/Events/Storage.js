const ioredis = require('ioredis');

function StorageClass() {
  this.redis = new ioredis()

  this.Create = (customerClass, EventClass) => {
    return this.redis.incr('eventsCounter').then((response) => {
      if (response) {
        let key = 'event:'+response // genrate event ID
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

  this.Update = (rediskey, newData) => {
    return this.redis.hgetall(rediskey).then((response) => {
      if (response) {
        return this.redis.hmset(rediskey, newData)
      }
    })
  }

  this.addToEventsCollection = (customerClass, EventClass) => {
    return this.redis.hmset(EventClass.rediskey, EventClass).then((response) => {
      if (response) {
        return this.redis.sadd('Events', EventClass.rediskey).then((response) => {
          if (response) {
            return this.redis.sadd(customerClass.email+':events', EventClass.rediskey)
          }
        })
      }
    })
  }

  this.FindById = (rediskey) => {
    return this.redis.hgetall(rediskey)
  }

  this.DeleteById = (rediskey, customerId) => {
    return this.redis.srem(customerId+':events', rediskey).then((response) => {
      if (response) {
        return this.redis.srem('Events', rediskey).then((response) => {
          if (response) {
            return this.redis.del(rediskey).then((response) => {
              return response
            })
          }
        })
      }
    })
  }
}

module.exports = StorageClass
