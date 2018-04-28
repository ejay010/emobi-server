const multer = require('multer');
const upload = multer({ dest: 'flyers/'})

function init(app, passport) {
  app.get('/events', require('./eventPool.js'))
  app.post('/createEvent', passport.authenticationMiddleware(), require('./create.js'))
  app.get('/events/:eventId/publish', passport.authenticationMiddleware(), require('./publish.js'))
  app.get('/events/:eventId/cancel', passport.authenticationMiddleware(), require('./cancel.js'))
  app.get('/events/:eventId/delete', passport.authenticationMiddleware(), require('./delete.js'))
  app.post('/events/:eventId/edit', passport.authenticationMiddleware(), upload.single('flyer') ,require('./edit-mongo.js'))
  app.get('/publicEvent/:email/:eventkey', require('./publicEvents.js'))
  app.get('/events/:eventId/ticket/:ticketId/deleteTicket', passport.authenticationMiddleware(), require('./Delete_ticket.js'))
  // app.get('/events/:eventId/ticket/:ticketId/deleteTicket', require('./Delete_ticket.js'))

}

module.exports = init
