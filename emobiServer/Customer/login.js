const Customer = require('./Customer.js');
function Login(req, res) {
  let customer = new Customer()
  customer.login(req, res).then((results) => {
    res.send(results)
  })
}

module.exports = Login
