const ioredis = require('ioredis');
const bcrypt = require('bcrypt');

function register(app) {
  app.post('/customerRegister', (req, res) => {
    let redis = new ioredis();
    let given_email = req.body.email.toLowerCase()
    let existing_email = null
    redis.get('customer:'+given_email).then((result) => {
      existing_email = result
      if (existing_email === null) {
        const saltRounds = 10
        const myPlaintextPassword = req.body.password
        const salt = bcrypt.genSaltSync(saltRounds)
        const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt)

        let new_customer = {
          username: req.body.username,
          email: given_email,
          password: passwordHash,
          dob: req.body.dob
        }
        // set in ioredis
        console.log(new_customer);
        redis.set('customer:'+new_customer.email, JSON.stringify(new_customer));

        res.send({
          error: false,
          message: "Registration Complete",
          user: new_customer
        })
      } else {
        res.send({
          error: true,
          message: "Existing Credentials",
        })
      }
    });
  });
}

module.exports = register;
