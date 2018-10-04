const Events = require('./Events-mongo.js');
const fs = require('fs');
const ioredis = require('ioredis');
const Thumbnail = require('thumbnail');

function processImages(req, res, cb) {
  if (req.file != null) {
    fs.rename(req.file.path, req.file.path+'-'+req.file.originalname, function (error) {
      if (error) {
        console.log(error);
        cb(req, res, true, null)
      } else {
        cb(req, res, true, null)
        // let thumbnail = new Thumbnail('flyers', req.file.destination)
        // thumbnail.ensureThumbnail(req.file.filename+'-'+req.file.originalname, 150, null, function (error, thumbnailPath) {
        //   if (error == null) {
        //     cb(req, res, true, thumbnailPath)
        //   } else {
        //     console.log(error);
        //     cb(req, res, true, null)
        //   }
        // })
      }
    })
  } else {
    cb(req, res, true, null)
  }
}

function UpdateEvent(req, res, finishedProccessing, thumbnail_path) {
    let redis = new ioredis()
    let Data = JSON.parse(req.body.seedData);
    if (finishedProccessing) {
      Events.findById(Data.eventObj._id).then((events) => {
        events.category = Data.eventObj.category
        events.description = Data.eventObj.description
        events.title = Data.eventObj.title
        if (req.file != null) {
          events.flyer = JSON.stringify(req.file)
          events.flyer_thumbnail = thumbnail_path
        }
        events.startTime = Data.startTimestamp
        events.finishTime = Data.finishTimestamp
        events.location = Data.location

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
    }
}

function EditEvent(req, res) {
  processImages(req, res, UpdateEvent)
}

module.exports = EditEvent
