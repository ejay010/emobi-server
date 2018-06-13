const mongoose = require('mongoose');
let CustomerSchema = mongoose.Schema({
  email: String,
  password: String,
  dob: String,
  username: String,
  status: String,
  ProfilePic: String
})
let Customer = mongoose.model('Customer', CustomerSchema)


module.exports = Customer;
