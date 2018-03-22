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

let options = {
    key: fs.readFileSync('/etc/nginx/ssl/api.e-mobie.com/324318/server.key'),
    cert: fs.readFileSync('/etc/nginx/ssl/api.e-mobie.com/324318/server.cert')
};
const server = require('https').createServer(options, app);
const io = require('socket.io')(server);

let redis = new ioredis();
let mongoDB = 'mongodb://localhost/emobi'
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise

let db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

io.on('connection', function (socket) {
  let socketRedis = new ioredis();
  socketRedis.subscribe('customerNotifications')
  socketRedis.on('message', function (channel, message) {
    socket.emit('customerNotifications',  JSON.parse(message))
  })
})

app.use(flash())
app.use(cors({
  "origin": process.env.VUE_URL,
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

require('./Bootstrap').init(app);
// require('./Customer').init(app);
// require('./Events').init(app);
// require('./Registration').init(app);

server.listen(3000, (err) => {
  if (err) {
    console.log('Error: '+ err);
  }
  console.log('App listening on port 3000');
})
module.exports = app;
