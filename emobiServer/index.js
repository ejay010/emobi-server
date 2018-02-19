const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const ioredis = require('ioredis');
const RedisStore = require('connect-redis')(session);
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let redis = new ioredis();

io.on('connection', function (socket) {
  let socketRedis = new ioredis();
  socketRedis.subscribe('customerNotifications')
  socketRedis.on('message', function (channel, message) {
    socket.emit('customerNotifications',  JSON.parse(message))
  })
})

app.use(flash())
app.use(cors({
  "origin": "http://localhost:8080",
  "credentials": true,
  "exposed": [
    'set-Cookie',
  ]
}))
app.use(express.json());
app.use(session({
  store: new RedisStore({
    url: 'redis://localhost'
  }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false }))
app.use(passport.initialize());
app.use(passport.session())
app.use(express.static('flyers'))

require('./Authentication').init(app);
require('./Customer').init(app);
require('./Events').init(app);
require('./Registration').init(app);

server.listen(3000, (err) => {
  if (err) {
    console.log('Error: '+ err);
  }
  console.log('App listening on port 3000');
})
module.exports = app;
