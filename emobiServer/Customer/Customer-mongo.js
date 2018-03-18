const mongoose = require('mongoose');
let CustomerSchema = mongoose.Schema({
  email: String,
  password: String,
  dob: String,
  username: String
})
let Customer = mongoose.model('Customer', CustomerSchema)


module.exports = Customer;
