const Events = require('./Events-mongo.js');

function eventPool(req, res, error) {
  let eventsClass = new Events()

  Events.find({status: 'published'}).then((response) => {
    res.send(response)
  })
  //
  // function processRawArray(setMembers, done) {
  //   let eventsArray = []
  //   let memberCount = 0
  //
  //   function onResult(processedResult) {
  //     eventsArray.push(processedResult);
  //     if (++memberCount >= setMembers.length) {
  //       done(eventsArray);
  //     }
  //   }
  //
  //   if (setMembers.length > 0) {
  //     for (const key of setMembers) {
  //       eventsClass.Storage.redis.hgetall(key, (error, results) => {
  //         if (!error) {
  //           onResult({rediskey: key, content: results});
  //         } else {
  //           done(error)
  //         }
  //       })
  //     }
  //   } else {
  //     done([])
  //   }
  // }
  //
  // eventsClass.Storage.redis.smembers('Events').then((members) => {processRawArray(members, (results) => {
  //   res.send(results)
  // })})

  // res.send(eventsRawArray)
}

module.exports = eventPool
