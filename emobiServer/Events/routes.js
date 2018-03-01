const multer = require('multer');
const upload = multer({ dest: 'flyers/'})

function init(app, passport) {
  app.post('/createEvent', passport.authenticationMiddleware(), require('./create.js'))
  app.get('/events/:eventId/publish', passport.authenticationMiddleware(), require('./publish.js'))
  app.get('/events/:eventId/cancel', passport.authenticationMiddleware(), require('./cancel.js'))
  app.get('/events/:eventId/delete', passport.authenticationMiddleware(), require('./delete.js'))
  app.post('/events/:eventId/edit', passport.authenticationMiddleware(), upload.single('flyer') ,require('./edit.js'))
}

module.exports = init
