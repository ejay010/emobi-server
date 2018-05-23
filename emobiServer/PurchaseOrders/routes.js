function routes(app, passport) {
  app.get('/purchaseOrder/:currentEventId/:purchaseOrderId/validate', require('./LocateInvoice.js'))
  app.get('/:email/invoices', passport.authenticationMiddleware(), require('./CustomerPurchases.js'))
  app.get('/invoice/:invoice_id', passport.authenticationMiddleware(), require('./FindInvoice.js'))
  app.get('/invoice/:invoice_id/delete', passport.authenticationMiddleware(), require('./Delete.js'))
  app.post('/invoice/:currentEventId/:purchaseOrderId/redeem', require('./UpdateInvoice.js'))
}

module.exports = routes
