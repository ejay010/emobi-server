const ioredis = require('ioredis');
const bcrypt = require('bcrypt');
const CustomerClass = require('../Customer/CustomerClass.js');

function register(app) {
  app.post('/customerRegister', (req, res) => {

    const saltRounds = 10
    const myPlaintextPassword = req.body.password
    const salt = bcrypt.genSaltSync(saltRounds)
    const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt)

    let new_customer = {
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      password: passwordHash,
      dob: req.body.dob
    }

    let Customer = new CustomerClass();
    Customer.create(new_customer).then((response) => {
      console.log(response);
      if (response != false) {
        res.send({
          success: true,
          message: "Customer Created",
          user: {
            username: new_customer.username,
            email: new_customer.email,
            dob: new_customer.dob
          }
        })
      } else {
        res.send({
          success: false,
          message: "Registration Failed"
        })
      }
    })
  });
}

module.exports = register;
