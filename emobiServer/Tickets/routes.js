const multer = require('multer');
const upload = multer({ dest: 'flyers/'})

function routes(app, passport) {
  app.post('tickets/:customer/:eventId/create', passport.authenticationMiddleware(), require('./createTicket.js'))
  // app.get('tickets/:customer/:eventId/view/:ticketId', require('./viewTicket.js'))
}

module.exports = routes
