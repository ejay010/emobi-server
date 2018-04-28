const Events = require('./Events.js');
const fs = require('fs');

function EditEvent(req, res) {
  let Data = JSON.parse(req.body.seedData);
  let eventsClass = new Events()
  if (req.file != null) {
    fs.rename(req.file.path, req.file.path+'-'+req.file.originalname, function (error) {
      if (error) {
        console.log(error);
      }
    })
  }
  eventsClass.GetEvent(Data.eventObj.rediskey).then((response) => {
    let temp = response
    response.category = Data.eventObj.category
      response.description = Data.eventObj.description
      response.title = Data.eventObj.title
      response.flyer = JSON.stringify(req.file)
      response.startTime = Data.startTimestamp
      response.finishTime = Data.finishTimestamp
      let newEvent = response

      eventsClass.Update(response.rediskey, response).then((response) => {
        if (response == "OK") {

          eventsClass.Storage.redis.publish('customerNotifications', JSON.stringify({
                      from: "server",
                      to: newEvent.publisher,
                      message: "Event Updated",
                      redis: {
                        type: "hash",
                        key: newEvent.rediskey,
                        data: newEvent
                      }
                    }));

                    if (newEvent.status == 'published') {
                      eventsClass.Storage.redis.publish('customerNotifications', JSON.stringify({
                                  from: "server",
                                  to: "all",
                                  message: "Event Updated",
                                  redis: {
                                    type: "hash",
                                    key: Data.eventObj.rediskey,
                                    data: newEvent
                                  }
                                }));
                    }
                        res.send({
                          success: true,
                          recieved: newEvent,
                          message: "Event Updated"
                        })
                  } else {
                    res.send({
                      success: false,
                      recieved: Data,
                      message: "There was an error. Event Failed to Updated, please contact System Admin",
                      error: e
                    })
                  }
      })
  }).catch((e) => {
      res.send({
        success: false,
        recieved: Data,
        message: "There was an error. please contact System Admin",
        error: e
      })
  })
}

module.exports = EditEvent
