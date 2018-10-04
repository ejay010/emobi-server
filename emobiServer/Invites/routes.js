function routes(app, passport) {
  app.post('/invite/:ticket_id/create', require('./CreateInvite.js'))
  app.get('/invite/:invite_id/send', require('./SendInvite.js'))
  app.get('/invite/:invite_id/rsvp_confirm', require('./ConfirmRsvp.js'))
  app.get('/invite/:invite_id/delete')
}

module.exports = routes
