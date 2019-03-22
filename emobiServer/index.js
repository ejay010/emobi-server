const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const ioredis = require('ioredis');
const RedisStore = require('connect-redis')(session);
const app = express();
const bodyParser = require('body-parser');

let options = {
    key: fs.readFileSync('/etc/nginx/ssl/api.e-mobie.com/448045/server.key'),
    cert: fs.readFileSync('/etc/nginx/ssl/api.e-mobie.com/448045/server.crt')
};
const server = require('https').createServer(options, app);
// const server = require('http').createServer(app);
const io = require('socket.io')(server);

let redis = new ioredis();
let mongoDB = 'mongodb://localhost/emobi'
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise

let db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let nsp = io.of('/system-events')
nsp.on('connection', function (socket) {
  let frontendRedis = new ioredis();
  frontendRedis.subscribe('customerNotifications')
  frontendRedis.on('message', function (channel, message) {
    socket.emit('customerNotifications',  JSON.parse(message))
  })

  let ticketRedis = new ioredis();
  ticketRedis.subscribe('ticket-update')
  ticketRedis.on('message', function (channel, message) {
    socket.emit('ticketUpdate', JSON.parse(message))
  })
})

let whitelist = [process.env.VUE_FRONTEND_URL, process.env.VUE_ADMIN_URL]

app.use(flash())
app.use(cors({
  "origin": function (origin, callback) {
    callback(null, true)
    // if (whitelist.indexOf(origin) !== -1 || !origin) {
    //   callback(null, true)
    // } else {
    //   callback(new Error('Not allowed by CORS'))
    // }
  },
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
app.use(express.static('profile_pics'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/playplay', function (req, res, error) {
  res.send({
    message: 'go to sleep phase 1 complete'
  })
})

require('./Bootstrap').init(app);
require('./Mobile').init(app)

server.listen(3000, '10.132.81.244', (err) => {
  if (err) {
    console.log('Error: '+ err);
  }
  console.log('App listening on port 3000');
})
module.exports = app;
