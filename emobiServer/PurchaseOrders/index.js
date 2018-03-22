const mongoose = require('mongoose');
let POSchema = mongoose.Schema({
  eventId: {type: mongoose.Schema.ObjectId, ref: 'Events'},
  purchaser: String,
  resolved_qty: Number,
  qty_available: Number,
  ticketId: {type: mongoose.Schema.ObjectId, ref: 'Tickets'}
})

let PurchaseOrder = mongoose.model('PurchaseOrders', POSchema)

module.exports = PurchaseOrder
