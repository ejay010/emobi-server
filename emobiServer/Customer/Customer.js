const Storage = require('./Storage');
const Events = require('../Events').Class;

function Customer() {
  this.login = (req, res) => {
    let DB = new Storage()
    return DB.FindCustomer({email: req.body.email}).then((response) => {
      if (response != null) {
        let customer = JSON.parse(response);
        return DB.GetCustomerEvents(customer).then((results) => {
          return new Promise((resolve, reject) => {
            let EventClass = new Events()
            function convertResults(callback) {
              let resultsArray = [];
              let totalResults = 0;

              function onResult(result) {
                resultsArray.push(result);
                if (++totalResults >= results.length) {
                  callback(resultsArray);
                }
              }

              if (results.length > 0) {
                for (const key of results) {
                  EventClass.GetEvent(key).then((results) => {
                    if (results) {
                      onResult({rediskey: key, content: results});
                    }
                  })
                }
              } else {
                callback([])
              }
            }
            convertResults((resultsArray) => {
                resolve({
                  message: "Welcome",
                  success: true,
                  user: req.user,
                  userEvents: resultsArray
                })
              })
          })
        })
      } else {
        return Promise.resolve(false)
      }
    });
  }
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

  this.getCustomer = (dataObj) => {
    let DB = new Storage()
    return DB.FindCustomer(dataObj);
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
