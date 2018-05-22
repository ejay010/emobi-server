const mongoose = require('mongoose');
let POSchema = mongoose.Schema({
  created_at: {type: Date, default: Date.now },
  purchaser: String,
  eventId: {type: mongoose.Schema.ObjectId, ref: 'Events'},
  cost: Number, //price in pennies
  contents: [],
  invoice_life: Number,
  rsvp_list: [],
  guest_passes: [],
  ticketId: {type: mongoose.Schema.ObjectId, ref: 'Tickets'}
})

let PurchaseOrder = mongoose.model('Invoice', POSchema)

module.exports = PurchaseOrder
