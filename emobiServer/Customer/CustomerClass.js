const Storage = require('../Storage');

function Customer() {
  /* Username, email, password, passwordConfirmation, dob */
  this.create = (dataObj) => {
    this.username = dataObj.username;
    this.email = dataObj.email;
    this.password = dataObj.password;
    this.dob = dataObj.dob

    let DB = new Storage()
    return DB.FindCustomer(this.getObj()).then((response) => {
      if (response != null) {
        return Promise.resolve(false);
      } else {
        return DB.SaveCustomer(this.getObj());
      }
    })

  }

  this.getObj = () => {
    return {
      username: this.username,
      email: this.email,
      password: this.password,
      dob: this.dob
    };
  }
}

module.exports = Customer;
