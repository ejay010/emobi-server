const mongoose = require('mongoose');

let EventsSchema = mongoose.Schema({
  title: String,
  ticketKeys: Array,
  eventType: String,
  description: String,
finishTime: String,
location: String,
  // finishTime: Date,
  status: {type: String, default: 'unpublished'},
  publisher: String,
  flyer: String,
  // flyer: mongoose.Schema.Types.ObjectId,
  category: String,
  Tags: Array,
  startTime: String
  // startTime: Date
})

let Events = mongoose.model('Events', EventsSchema)

module.exports = Events
