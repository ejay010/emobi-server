const mongoose = require('mongoose');
let POSchema = mongoose.Schema({
  eventId: mongoose.Schema.ObjectId,
  purchaser: String,
  resolved_qty: Number,
  ticketId: mongoose.Schema.ObjectId
})

let PurchaseOrder = mongoose.model('PurchaseOrders', POSchema)

module.exports = PurchaseOrder
