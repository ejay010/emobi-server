const bluebird = require('bluebird');
const ioredis = require('ioredis');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'flyers/'})
const moment = require('moment');

function customer(app) {
  require('../Authentication').init(app);
  app.post('/customerLogin', passport.authenticate('local'), loginCustomer)
  app.get('/profile', passport.authenticationMiddleware(), renderProfile)
  app.post('/createEvent', passport.authenticationMiddleware(), createEvent)
  app.get('/event/:eventId/publish', passport.authenticationMiddleware(), publishEvent)
  app.get('/event/:eventId/cancel', passport.authenticationMiddleware(), cancelEvent)
  app.post('/editEvent', passport.authenticationMiddleware(), upload.single('flyer'), editEvent)
}

function loginCustomer (req, res) {
  //get userEvents
  let redis = new ioredis();
  redis.smembers(req.user.email+':events').then((results) => {
    function convertResults(callback) {
      let resultsArray = [];
      let totalResults = 0;

      function onResult(result) {
        resultsArray.push(result);
        if (++totalResults >= results.length) {
          callback(resultsArray);
        }
      }

      if (results.length > 0) {
        for (const key of results) {
          redis.hgetall(key, (error, results) => {
            if (!error) {
              onResult({rediskey: key, content: results});
            } else {
              callback(error)
            }
          })
        }
      } else {
        callback([])
      }
    }
      convertResults((resultsArray) => {
          res.send({
            message: "Welcome",
            success: true,
            user: req.user,
            userEvents: resultsArray
          })
        })
  })
}

function renderProfile (req, res) {
  res.send({
    message: "Profile home"
  })
}

function createEvent(req, res) {
  let Data = req.body;
  let redis = new ioredis();
  // events = 100
  // event:[id] = { publisher:[email], type:[public/private], category: "entertainment", title:[title] ...}
  redis.setnx('eventsCounter', 1).then(response => {
    if (response) {
      // created key for the first time
      let key = 'event:'+1
      // create event hash map
      redis.hmset(key, {
        rediskey: key,
        title: Data.eventSeeds.eventName,
        publisher: Data.user.email,
        eventType: Data.eventSeeds.eventType,
        category: Data.eventSeeds.eventPurpose,
        status: "unpublished"})

        //save to events list for user
        redis.sadd(Data.user.email+':events', key, function (err, response) {
          if (response) {
            // redis.smembers(Data.user.email+':events', function (err, response) {
            // })
          }
        });
    } else {
      redis.incr('eventsCounter').then( response => {
        let key = 'event:'+response
        // create event hash map
        redis.hmset(key, {
          rediskey: key,
          title: Data.eventSeeds.eventName,
          publisher: Data.user.email,
          eventType: Data.eventSeeds.eventType,
          category: Data.eventSeeds.eventPurpose,
          status: "unpublished"})

          //save to events list for user
          redis.sadd(Data.user.email+':events', key, function (err, response) {
            if (response) {
              // redis.smembers(Data.user.email+':events', function (err, response) {
              // })
              redis.hgetall(key).then((response) => {
                let event = response;
                // SAVED TO USER'S EVENTS LIST NOTIFY USER WITH REDIS PUB
                pub = new ioredis();
                pub.publish('customerNotifications', JSON.stringify({
                  from: "server",
                  to: Data.user.email,
                  message: "Event Created",
                  redis: {
                    type: "hash",
                    key: key,
                    data: event
                  }
                }));
                res.send({
                  success: true,
                  message: "Event created",
                })
              })
            }
          });
      })
    }
  })
  // res.send({
  //   message: "Hello",
  //   // seedData: seedData
  // })
}

function editEvent(req, res, err) {
  let Data = JSON.parse(req.body.seedData);
  console.log(Data);
  if (req.file != null) {
    fs.rename(req.file.path, req.file.path+'-'+req.file.originalname, function (error) {
      if (error) {
        console.log(error);
      }
    })
  }
  // get redis object
  let redis = new ioredis();
  redis.hgetall(Data.eventID).then(function (result) {
    let currentEvent = result
    let originalTemp = result
    currentEvent.description = Data.eventDescription
    currentEvent.title = Data.eventTitle
    currentEvent.flyer = JSON.stringify(req.file)
    currentEvent.startTime = Data.startTimestamp
    currentEvent.finishTime = Data.finishTimestamp

    redis.hmset(Data.eventID, currentEvent).then(function (result) {
      if (result == "OK") {
        redis.hgetall(Data.eventID).then(function (result) {
          if (result.status != 'published') {
            pub = new ioredis();
            pub.publish('customerNotifications', JSON.stringify({
              from: "server",
              to: result.publisher,
              message: "Event Updated",
              redis: {
                type: "hash",
                key: Data.eventID,
                data: result
              }
            }));
          } else {
            redis.smembers('PublicEvents').then((results) => {
              // local update function
              function updatePublcEvents(oldEventString, newEventString) {
                redis.srem('PublicEvents', oldEventString).then(results => {
                  if (results) {
                    redis.sadd('PublicEvents', newEventString)
                  }
                })
              }
              if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                  if (JSON.parse(results[i]).rediskey == Data.eventID) {
                    updatePublcEvents(results[i], JSON.stringify(currentEvent))
                  }
                }
              }
            })
            pub = new ioredis();
            pub.publish('customerNotifications', JSON.stringify({
              from: "server",
              to: "all",
              message: "Event Updated",
              redis: {
                type: "hash",
                key: Data.rediskey,
                data: result
              }
            }));
          }
        })
      }
      res.send({
        success: true,
        recieved: result,
        message: "Event Updated"
      })
    })
  }).catch(e => {
    res.send({
      success: false,
      recieved: Data,
      message: "There was an error. please contact System Admin",
      error: e
    })
  })
}

function publishEvent(req, res, error) {
  let redis = new ioredis();
  redis.hgetall(req.params.eventId).then(function (result) {
    let currentEvent = result
    currentEvent.status = 'published'
    redis.hmset(req.params.eventId, currentEvent).then(function (response) {
      if (response) {
        redis.sadd('PublicEvents', JSON.stringify(currentEvent)).then((response, error) => {
          if (response) {
            pub = new ioredis();
            pub.publish('customerNotifications', JSON.stringify({
              from: "server",
              to: "all",
              message: "Event Published",
              redis: {
                type: "hash",
                key: req.params.eventId,
                data: currentEvent
              }
            }));
            res.send({
              success: true,
              message: "Event Published",
              updatedEvent: currentEvent
            })
          } else {
            res.send({
              success: false,
              message: "Event Not Published",
              error: error
            })
          }
        })
      }
    })
  })
}

function cancelEvent(req, res, error) {
  let redis = new ioredis();
  redis.hgetall(req.params.eventId).then(function (result) {
    let currentEvent = result
    redis.srem('PublicEvents', JSON.stringify(currentEvent)).then((response, error) => {
      if (response) {
        currentEvent.status = 'unpublished'
        redis.hmset(req.params.eventId, currentEvent).then((response) => {
          pub = new ioredis();
          pub.publish('customerNotifications', JSON.stringify({
            from: "server",
            to: "all",
            message: "Event Canceled",
            redis: {
              type: "hash",
              key: req.params.eventId,
              data: currentEvent
            }
          }));
          res.send({
            success: true,
            message: "Event Canceled",
            updatedEvent: currentEvent
          })
        })
      } else {
        res.send({
          success: false,
          message: "Event Not Canceled",
          error: error
        })
      }
    })
  })
}



module.exports = customer;
