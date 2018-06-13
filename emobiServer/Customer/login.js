const Customer = require('./Customer.js');
const Events = require('../Events').Class;

function Login(req, res) {
  let customer = req.user
  Events.find({'publisher': customer.email}).then((response) => {
    if (response) {
      console.log(req.user);
      res.send({
        message: "Welcome",
        success: true,
        user: {
          dob: req.user.dob,
          email: req.user.email,
          username: req.user.username,
          status: req.user.status,
          profile_picture: req.user.ProfilePic
        },
        userEvents: response
      })
    }
  })
}

module.exports = Login
