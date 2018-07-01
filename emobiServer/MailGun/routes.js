function routes (app, passport) {
  app.post('/welcome/letter/', require('./MailGun.js'))
}

module.exports = routes
