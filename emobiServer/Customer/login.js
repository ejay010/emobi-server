const Customer = require('./Customer.js');
const Events = require('../Events').Class;

function Login(req, res) {
  let customer = req.user
  Events.find({'publisher': customer.email}).then((response) => {
    if (response) {
      res.send({
        message: "Welcome",
        success: true,
        user: {
          dob: req.user.dob,
          email: req.user.email,
          username: req.user.username
        },
        userEvents: response
      })
    }
  })
}

module.exports = Login
