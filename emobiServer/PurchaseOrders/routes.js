function routes(app, passport) {
  app.get('/purchaseOrder/:currentEventId/:purchaseOrderId/redeem', require('./ProcessPurchase.js'))
  app.get('/:email/invoices', passport.authenticationMiddleware(), require('./CustomerPurchases.js'))
  app.get('/invoice/:invoice_id', passport.authenticationMiddleware(), require('./FindInvoice.js'))
  app.get('/invoice/:invoice_id/delete', passport.authenticationMiddleware(), require('./Delete.js'))
}

module.exports = routes
