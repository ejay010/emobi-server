const Auth = require('./Authentication');
const passport = require('passport');
const epassreader = require('./epassreader');

function init(app) {
  Auth.init(app)
  epassreader.init(app, passport)
}

module.exports = {init: init}
