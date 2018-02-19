const ioredis = require('ioredis');

function init(app) {
  app.get('/events', getEvents)
}

function getEvents(req, res, error) {
  let redis = new ioredis()
  redis.smembers('PublicEvents').then(response => {
    if (response.length > 0) {
      for (var i = 0; i < response.length; i++) {
        response[i] = JSON.parse(response[i])
      }
    }
    res.send({
      success: true,
      data: response
    })
  }).catch(e => {
    res.send({
      success: false,
      error: e
    })
  })
}

module.exports = init
