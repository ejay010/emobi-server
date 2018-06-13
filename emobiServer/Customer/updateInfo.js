const Customer = require('./Customer-mongo.js');
function updateInfo(req, res, error) {
  if (req.body.email == req.user.email) {
    Customer.findById(req.user._id).then((result) => {
      result.set(req.body)
      result.save().then((response) => {
        let updatedUser = {
          ProfilePic: response.ProfilePic,
          dob: response.dob,
          email: response.email,
          status: response.status,
          username: response.username
        }
        res.send({
          success: true,
          message: "User Info Updated",
          user: updatedUser
        })
      })
    })
  }
}

module.exports = updateInfo
