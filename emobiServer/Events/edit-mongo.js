const Events = require('./Events-mongo.js');
const fs = require('fs');
const ioredis = require('ioredis');

function EditEvent(req, res) {
  let redis = new ioredis()
  let Data = JSON.parse(req.body.seedData);
  if (req.file != null) {
    fs.rename(req.file.path, req.file.path+'-'+req.file.originalname, function (error) {
      if (error) {
        console.log(error);
      }
    })
  }
  Events.findById(Data.eventObj._id).then((events) => {
    events.category = Data.eventObj.category
    events.description = Data.eventObj.description
    events.title = Data.eventObj.title
    // FIXME: Flyer objec needs to be created or change it to a string and parse it, maybe use string for now and then update to object strings later
// FIXME: same goes for start and finish times
    events.flyer = JSON.stringify(req.file)
    events.startTime = Data.startTimestamp
    events.finishTime = Data.finishTimestamp

    events.save().then((response) => {
      if (response.status == 'published') {

        redis.publish('customerNotifications', JSON.stringify({
                    from: "server",
                    to: "all",
                    message: "Event Updated",
                    redis: {
                      type: "hash",
                      key: response._id,
                      data: response
                    }
                  }))
      }

      redis.publish('customerNotifications', JSON.stringify({
                  from: "server",
                  to: response.publisher,
                  message: "Event Updated",
                  redis: {
                    type: "hash",
                    key: response._id,
                    data: response
                  }
                }))

      res.send({
        success: true,
        recieved: response,
        message: "Event Updated"
      })
    })
  })
  // eventsClass.GetEvent(Data.eventObj.rediskey).then((response) => {
  //   let temp = response
  //   response.category = Data.eventObj.category
  //     response.description = Data.eventObj.description
  //     response.title = Data.eventObj.title
  //     response.flyer = JSON.stringify(req.file)
  //     response.startTime = Data.startTimestamp
  //     response.finishTime = Data.finishTimestamp
  //     let newEvent = response
  //
  //     eventsClass.Update(response.rediskey, response).then((response) => {
  //       if (response == "OK") {
  //
  //         eventsClass.Storage.redis.publish('customerNotifications', JSON.stringify({
  //                     from: "server",
  //                     to: newEvent.publisher,
  //                     message: "Event Updated",
  //                     redis: {
  //                       type: "hash",
  //                       key: newEvent.rediskey,
  //                       data: newEvent
  //                     }
  //                   }));
  //                   if (newEvent.status == 'published') {
  //                     eventsClass.Storage.redis.publish('customerNotifications', JSON.stringify({
  //                                 from: "server",
  //                                 to: "all",
  //                                 message: "Event Updated",
  //                                 redis: {
  //                                   type: "hash",
  //                                   key: Data.eventObj.rediskey,
  //                                   data: newEvent
  //                                 }
  //                               }));
  //                   }
  //                       res.send({
  //                         success: true,
  //                         recieved: newEvent,
  //                         message: "Event Updated"
  //                       })
  //                 } else {
  //                   res.send({
  //                     success: false,
  //                     recieved: Data,
  //                     message: "There was an error. Event Failed to Updated, please contact System Admin",
  //                     error: e
  //                   })
  //                 }
  //     })
  // }).catch((e) => {
  //     res.send({
  //       success: false,
  //       recieved: Data,
  //       message: "There was an error. please contact System Admin",
  //       error: e
  //     })
  // })
}

module.exports = EditEvent
