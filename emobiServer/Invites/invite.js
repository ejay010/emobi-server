const mongoose = require('mongoose');
const Events = require('../Events').Class;
const Tickets = require('../Tickets').Class;

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

//For batch emailing
INVITEschema.pre('insertMany', function (next, doc) {
  this.populate(doc, [{path: 'eventId'}, {path: 'ticketId'}], function (error, popDoc) {
    doc = popDoc // set current doc to populated doc
    next()
  })
})
let Invite = mongoose.model('Invite', INVITEschema)

module.exports = Invite
