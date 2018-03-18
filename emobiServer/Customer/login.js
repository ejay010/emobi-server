const Customer = require('./Customer.js');
const Events = require('../Events').Class;

function Login(req, res) {
  let customer = req.user
  Events.find({'publisher': customer.email}).then((response) => {
    if (response) {
      res.send({
        message: "Welcome",
        success: true,
        user: req.user,
        userEvents: response
      })
    }
  })
}

module.exports = Login
