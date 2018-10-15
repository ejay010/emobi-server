function routes(app, passport) {
  app.post('/invite/:ticket_id/create', require('./CreateInvite.js'))
  app.get('/invite/:invite_id/send', require('./SendInvite.js'))
  app.post('/invite/:invite_id/rsvp_confirm', require('./ConfirmRsvp.js'))
  app.get('/invite/:invite_id/delete')
  app.get('/invites/all/:ticket_id', require('./findInvites.js'))
}

module.exports = routes
