function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.send({
      success: false,
      status: 401,
      message: "Not Logged In",
    })
  }
}

module.exports = authenticationMiddleware
