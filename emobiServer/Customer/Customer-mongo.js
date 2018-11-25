const mongoose = require('mongoose');
let CustomerSchema = mongoose.Schema({
  email: String,
  password: String,
  dob: String,
  username: String,
  status: String,
  ProfilePic: String,
  soft_delete: {type: Boolean, default: false}
})
let Customer = mongoose.model('Customer', CustomerSchema)


module.exports = Customer;
