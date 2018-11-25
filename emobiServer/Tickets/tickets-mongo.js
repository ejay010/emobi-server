const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

function hashSecret(word) {
  const saltRounds = 10
  const myPlaintextPassword = word
  const salt = bcrypt.genSaltSync(saltRounds)
  const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt)

  return passwordHash
}

let TicketSchema = mongoose.Schema({
  qty_sold: {type: Number, default: 0},
  ticket_image: String,
  title: String,
  description: String,
  quantity_available: Number,
  eventId: mongoose.Schema.ObjectId,
  publisher: String,
  paid_or_free: String,
  price: {type: Number, default: 0},
  invoices: Array,
  ticket_type: {type: String, default: 'public'},
  secret_code: {type: String, set: hashSecret},
  soft_delete: {type: Boolean, default: false}
})

let Ticket = mongoose.model('Tickets', TicketSchema)
module.exports = Ticket
