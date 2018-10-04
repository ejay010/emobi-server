const Tickets = require('./tickets-mongo.js');
const fs = require('fs');

function UpdateTicket(req, res, error) {
  // if (req.file != null) {
  //   fs.rename(req.file.path, req.file.path+'-'+req.file.originalname, function (error) {
  //     if (error) {
  //       console.log(error);
  //     }
  //   })
  // }
  console.log(req.body);
  res.send(200)
}

module.exports = UpdateTicket
