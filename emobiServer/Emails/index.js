const dot = require('dot');
const fs = require('fs');

let Mail = {
  Welcome: function (user) {
    fs.readFile(__dirname +'/Templates/welcome.html', 'utf8', function (error, data) {
      SendMeText(error, data)
    })

    function SendMeText(error, response) {
      if (error) throw error;
      let templateFunction = dot.template(response)
      let string = templateFunction(user)
      return string
    }
  },

  ResetPassword: function (user) {
    fs.readFile(__dirname +'/Templates/resetpassword.html', 'utf8', function (error, data) {
      SendMeText(error, data)
    })

    function SendMeText(error, response) {
      if (error) throw error;
      let templateFunction = dot.template(response)
      let string = templateFunction(user)
      return string
    }
  },
}

module.exports = Mail
