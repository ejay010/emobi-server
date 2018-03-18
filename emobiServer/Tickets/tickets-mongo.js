const mongoose = require('mongoose');
let TicketSchema = mongoose.Schema({
  qty_sold: {type: Number, default: 0},
  ticket_image: String,
  title: String,
  description: String,
  quantity_available: Number,
  eventId: mongoose.Schema.ObjectId,
  publisher: String,
  paid_or_free: String
})

let Ticket = mongoose.model('Tickets', TicketSchema)
module.exports = Ticket
