function routes(app, passport) {
  app.get('/admin/statistics/:query', require('./stats.js'))
  app.get('/admin/customers/:query', require('./customers.js'))
  app.get('/admin/invoices/:query', require('./invoices.js'))
  app.get('/admin/tickets/:query', require('./tickets.js'))
  app.get('/admin/events/:query', require('./events.js'))
}

module.exports = routes
