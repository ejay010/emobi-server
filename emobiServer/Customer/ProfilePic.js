const fs = require('fs');
const Customer = require('./Customer-mongo.js');

function ProfilePic(req, res, error) {
  if (req.file != null) {
    fs.rename(req.file.path, req.file.path+'-'+req.file.originalname, function (error) {
      if (error) {
        console.log(error);
        res.send({
          success: false,
          error: error})
      } else {
        // update Customer info in mongod
        Customer.findById(req.user._id).then((customer) => {
          let stringFile = JSON.stringify(req.file)
          customer.ProfilePic = stringFile
          customer.save(function (err, updatedCustomer) {
            console.log(updatedCustomer);
          })
        })
        res.send({
          success: true,
          message: "Picture Uploaded"
        })
      }
    })
  }
}

module.exports = ProfilePic
