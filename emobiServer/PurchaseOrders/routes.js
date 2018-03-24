function routes(app, passport) {
  app.get('/purchaseOrder/:currentEventId/:purchaseOrderId/redeem', require('./ProcessPurchase.js'))
}

module.exports = routes
