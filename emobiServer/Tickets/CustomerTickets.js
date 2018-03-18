const Tickets = require('./tickets-mongo.js');
function CustomerTickets(req, res, error) {

Tickets.find({'publisher': req.params.customer}).then((response) => {
  res.send({
    message: "Customer Tickets",
    success: true,
    user: req.user,
    CustomerCreatedTickets: response
  })
})

  // let tickets = new Tickets()
  // tickets.Storage.redis.smembers(req.params.customer+':CreatedTickets').then((results) => {
  //   function convertResults(callback) {
  //     let resultsArray = [];
  //     let totalResults = 0;
  //
  //     function onResult(result) {
  //       resultsArray.push(result);
  //       if (++totalResults >= results.length) {
  //         callback(resultsArray);
  //       }
  //     }
  //
  //     if (results.length > 0) {
  //       for (const key of results) {
  //         tickets.Storage.redis.hgetall(JSON.parse(key).ticketId).then((results) => {
  //           if (results) {
  //             onResult({rediskey: JSON.parse(key).ticketId, content: results});
  //           }
  //         })
  //       }
  //     } else {
  //       callback([])
  //     }
  //   }
  //   convertResults((resultsArray) => {
  //       res.send({
  //         message: "Customer Created Tickets" ,
  //         success: true,
  //         user: req.user,
  //         CustomerCreatedTickets: resultsArray
  //       })
  //     })
  // })
}

module.exports = CustomerTickets
