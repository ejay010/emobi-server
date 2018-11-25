const mongoose = require('mongoose');

let INVITEschema = mongoose.Schema({
  created_at: {type: Date, default: Date.now },
  updated_at: {type: Date, default: Date.now },
  eventId: {type: mongoose.Schema.ObjectId, ref: 'Events'},
  ticketId: {type: mongoose.Schema.ObjectId, ref: 'Tickets'},
  email_sent_counter: {type: Number, default: 0},
  email: String,
  name: String,
  index_position: {type: Number, default: 0},
  status: {type: String, default: 'Not_Sent'},
  soft_delete: {type: Boolean, default: false}
})

let Invite = mongoose.model('Invite', INVITEschema)

module.exports = Invite
