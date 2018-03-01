const Storage = require('./Storage.js');

function Events() {
  this.Storage = new Storage()
  this.Create = (seedData) => {
    seedData.status = "unpublished"
    let DB = new Storage()
    const CustomerClass = require('../Customer').Class;
    let Customer = new CustomerClass()
    return Customer.getCustomer({email: seedData.publisher}).then((response) => {
      return DB.Create(JSON.parse(response), seedData).then((response) => {
        return response
      })
    })
  }

  this.Update = (redisKey, updatedData) => {
    return this.GetEvent(redisKey).then((response) => {
      let currentEvent = response
      let newEventData = updatedData
      let DB = new Storage()
      return DB.Update(redisKey, updatedData).then((response) => {
        return response
      })
    })
  }

  this.GetEvent = (redisKey) => {
    let DB = new Storage()
    return DB.FindById(redisKey)
  }

  this.PublishEvent = (redisKey) => {
    let DB = new Storage()
    return this.GetEvent(redisKey).then((response) => {
      response.status = 'published'
      return this.Update(response.rediskey, response).then((response) => {
        if (response == 'OK') {
          return this.GetEvent(response.rediskey).then((response) => {
            let currentEvent = response
            return DB.redis.sadd('PublicEvents', currentEvent.rediskey).then((results) => {
              if (response) {
                return {success: true, data: currentEvent}
              } else {
                return {success: false, data: currentEvent}
              }
            })
          })
        }
      })
    })
  }

  this.CancelEvent = (rediskey) => {
    let DB = new Storage()
    return this.GetEvent(rediskey).then((currentEvent) => {
      currentEvent.status = 'unpublished'
      return this.Update(currentEvent.rediskey, currentEvent).then((response) => {
        if (response = 'OK') {
          return this.GetEvent(currentEvent.rediskey).then((updatedEvent) => {
            return DB.redis.srem('PublicEvents', updatedEvent.rediskey).then((results) => {
              if (response) {
                return {success: true, data: updatedEvent}
              } else {
                return {success: false, data: updatedEvent}
              }
            });
          })
        }
      })
    })
  }

  this.DeleteEvent = (rediskey) => {
    let DB = new Storage();
    return this.GetEvent(rediskey).then((currentEvent) => {
      return DB.DeleteById(rediskey, currentEvent.publisher);
    })
  }
}

module.exports = Events
