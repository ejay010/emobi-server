const Awesomeqr = require('awesome-qr');

function EcodeGen(req, res, error) {
  console.log(req.query);
  let awesomeqr = new Awesomeqr().create({
    text: 'hello',
    size: 500,
    callback: (data) => {
      res.writeHead(200, {'Content-type': 'image/jpg'})
      res.end(data)
    }
  })
}

module.exports = EcodeGen
