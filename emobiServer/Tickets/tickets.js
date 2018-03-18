const Storage = require('./Storage.js');

function Tickets() {
  this.Storage = new Storage()
  this.CreateTicket = (eventClass, seedData) => {
    // console.log(seedData);
    if (eventClass.rediskey == seedData.eventId) {
      seedData.publisher = eventClass.publisher
      return this.Storage.CreateTicket(seedData).then((response) => {
        // console.log(response);
        this.AddToEvent(eventClass.rediskey, seedData.rediskey).then((response) => {
          console.log(response);
        })
         return {
           success: true,
           message: "Ticket Created",
           data: response
         }
      })
    } else {
      return {
        success: false,
        error: {
          message: "Invalid Information"
        }
      }
    }
  }
  this.AddToEvent = (eventId, ticketId) => {
    return this.Storage.AddToEvent(eventId, ticketId).then((response) => {
      return response
    })
  }
  this.FindTicket = (EventKeyAndTicketKey) => {
    return this.Storage.FindById(EventKeyAndTicketKey.eventId).then((response) => {
      return response;
    })
  }
  this.makePurchase = (purchaseData) => {
    // first find the event
    return this.Storage.FindById(purchaseData.eventId).then((response) => {
      if (response.rediskey == purchaseData.eventId) {
        // then find determine if ticket is related to this event
        let ticketsArray = JSON.parse(response.ticketskeys)
        let truth = ticketsArray.find(function(element){
          if (element == purchaseData.ticket) {
            return true
          }
        })
        if (truth) {
          return this.Storage.FindById(truth).then((response) => {
            let updatedValue = response
            if (purchaseData.qty <= updatedValue.quantity) {
              // within available range
              if (updatedValue.qty_sold != null) {
                // We have sold some tickets already so we need to add to the current sales
                updatedValue.qty_sold = updatedValue.qty_sold + purchaseData.qty
              } else {
                // This is our first sale so we need to establis the sales variable
                updatedValue.qty_sold = purchaseData.qty
              }

              //update available qty  
              if ((updatedValue.quantity - purchaseData.qty) <= 0) {
                updatedValue.quantity = 0
              } else {
                updatedValue.quantity = updatedValue.quantity - purchaseData.qty
              }
              // save the changes
              this.Storage.Update(updatedValue.rediskey, updatedValue).then((response) => {
                console.log(response);
                // create purchase invoice {inv: '1', purchaser: "ejay010@gmail", ticketId: "ticket:1", eventId: "event:23"}
                if (response) {
                  for (var i = 1; i < purchaseData.qty; i++) {
                    this.Storage.redis.inc(updatedValue.eventId+':inv-counter').then((response) => {
                      let invData = {
                        inv: response,
                        purchaser: purchaseData.purchaser,
                        ticketId: purchaseData.ticket,
                        eventId: purchaseData.eventId
                      }

                      this.Storage.redis.hmset('inv-'+invData.inv, invData).then((response) => {
                        if (response) {
                          this.Storage.redis.sadd(purchaseData.purchaser+':PurchasedTickets', JSON.parse(invData)).then((response) => {
                            if (response) {
                              this.Storage.redis.sadd(updatedValue.publisher+':TicketInvoices', JSON.parse(invData)).then((response) => {
                                if (response) {
                                  console.log(response);
                                }
                              })
                            }
                          })
                        }
                      })
                    })
                  }
                }
                return response
              })
            } else {
              return {
                message: "Request Out of Range"
              }
            }
          })
        }
      }
    })
  }
}

module.exports = Tickets
