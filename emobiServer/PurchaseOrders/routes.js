function routes(app, passport) {
  app.get('/:email/invoices', passport.authenticationMiddleware(), require('./CustomerPurchases.js'))
  app.get('/invoice/:invoice_id', passport.authenticationMiddleware(), require('./FindInvoice.js'))
  app.get('/invoice/:invoice_id/delete', passport.authenticationMiddleware(), require('./Delete.js'))
  app.post('/invoice/:currentEventId/redeemqr', require('./UpdateInvoice.js'))
  app.post('/invoice/:invoice_id/mms_share', passport.authenticationMiddleware(), require('./MMSshare.js'))
  app.get('/Ecode', require('./EcodeQuery.js'))
}

module.exports = routes
