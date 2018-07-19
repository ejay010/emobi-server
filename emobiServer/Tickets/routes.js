const multer = require('multer');
const upload = multer({ dest: 'flyers/'})

function routes(app, passport) {
  app.post('/tickets/:customer/:eventId/create', passport.authenticationMiddleware(), upload.single('ticket_image'), require('./createTicket.js'))
  // app.post('/tickets/:eventId/purchase', passport.authenticationMiddleware(), require('./purchaseTicket.js'))
  app.get('/tickets/:customer/PurchasedTickets', require('./PurchasedTickets.js'))
  app.post('/tickets/:eventId/purchase', passport.authenticationMiddleware(), require('./purchaseTicket.js'))
  app.get('/tickets/:eventId/view/:ticketId', require('./viewTicket.js'))
  app.get('/tickets/:eventId/fetch', require('./LoadTickets.js'))
  app.get('/tickets/:customer/tickets',  require('./CustomerTickets.js'))
  app.get('/tickets/qrCode/:eventId/:invoiceId', require('./QrGenerator.js'))
}

module.exports = routes
