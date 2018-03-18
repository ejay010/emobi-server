const Tickets = require('./tickets-mongo.js');
const Events = require('../Events').Class;

function FetchTickets(req, res, error) {
  // res.send(req.params)
  Events.findById(req.params.eventId).then((foundEvent) => {
    if (foundEvent) {
      let ticketKeysArray = foundEvent.ticketKeys

      function convertResults(callback) {
        let resultsArray = []
        let totalResults = 0

        function onResult(result) {
          resultsArray.push(result)
          if (++totalResults >= ticketKeysArray.length) {
            callback(resultsArray)
          }
        }

        if (ticketKeysArray.length > 0) {
          for (const key of ticketKeysArray) {
            Tickets.findById(key).then((result) => {
              if (result) {
                onResult(result)
              }
            })
          }
        } else {
          callback([])
        }
      }

      convertResults((results) => {
        res.send({
          message: "Fetched Event Tickets",
          success: true,
          AvailableTickets: results
        })
      })
    }
  })
  //First find the event
  // let tickets = new Tickets()
  // tickets.Storage.redis.hgetall(req.params.eventId).then((results) => {
  //   // res.send(results)
  //   // now that we have the stored Event we need all tickets
  //   if (results) {
  //     let rawTickets = results.ticketskeys
  //     let ticketsArray = JSON.parse(rawTickets)
  //
  //     function convertResults(callback) {
  //       let resultsArray = [];
  //       let totalResults = 0;
  //
  //       function onResult(result) {
  //         resultsArray.push(result);
  //         if (++totalResults >= ticketsArray.length) {
  //           callback(resultsArray);
  //         }
  //       }
  //
  //       if (ticketsArray.length > 0) {
  //         for (const key of ticketsArray) {
  //           tickets.Storage.redis.hgetall(key).then((results) => {
  //             if (results) {
  //               onResult({rediskey: key, content: results});
  //             }
  //           })
  //         }
  //       } else {
  //         callback([])
  //       }
  //     }
  //     convertResults((resultsArray) => {
  //         res.send({
  //           message: "Fetched Event Tickets" ,
  //           success: true,
  //           AvailableTickets: resultsArray
  //         })
  //       })
  //   }
  // })
}

module.exports = FetchTickets
