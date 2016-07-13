const User = require('../models/user')

function userLoggedIn (req, res, next) {
  // this is a get request , thus using query (which will return query string)
  const userEmail = req.get('User-Email')
  const authToken = req.get('Auth-Token')
  if (!userEmail || !authToken) return res.status(401).json({error: 'unauthorized'})
  User.findOne({email: userEmail, auth_token: authToken}, (err, user) => {
    if (err || !user) return res.status(401).json({error: 'unauthorize'})
    req.currentUser = user
    next()
  })
}

module.exports =
{
  userLoggedIn: userLoggedIn
}
