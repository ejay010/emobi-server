const ioredis = require('ioredis');
const bcrypt = require('bcrypt');

function StorageClass() {
  this.redis = new ioredis()

  this.SaveCustomer = (customerClass) => {
    return this.redis.set('customer:'+customerClass.email, JSON.stringify(customerClass))};

  this.FindCustomer = (customerClass) => {
    return this.redis.get('customer:'+customerClass.email);
  };

  this.GetCustomerEvents = (customerClass) => {
    return this.redis.smembers(customerClass.email+':events');
  }

  this.GetCustomerSettings = (customerClass) => {
    return this.redis.hmget(customerClass.email+':settings');
  }

  this.SetCustomerSettings = (customerClass, settingsObj) => {
    return this.redis.hmset(customerClass.email+':settings', settingsObj)
  }
//Should always resolve to false
  this.FalsePromise = () => {return new Promise((resolve, reject) => {
      resolve(false)
  })}
}

module.exports = StorageClass;
