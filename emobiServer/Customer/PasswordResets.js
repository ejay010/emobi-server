const mongoose = require('mongoose');
let PasswordResetSchema = mongoose.Schema({
  token: String,
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer'}
})
let PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema)


module.exports = PasswordReset;
