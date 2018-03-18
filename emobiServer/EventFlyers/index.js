const mongoose = require('mongoose');
let EventFlyerSchema = mongoose.Schema({
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number
})

let EventFlyer = mongoose.model('Flyers', EventFlyerSchema)
module.exports = EventFlyer
