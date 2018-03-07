const Storage = require('./Storage.js');

function Tickets() {
  this.Storage = new Storage
  this.CreateTicket = (reqData) => {
    return this.Storage.createTicket(reqData)
  }
}

module.exports = Tickets
