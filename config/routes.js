const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')
const applicationController = require('../controllers/application_controller')
const postController = require('../controllers/post_controller')

router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

router.get('/', (req, res) => {
  res.status(200).json({Post: 'All the test'})
})

router.post('/signup', (req, res) => {
  const user = new User(req.body.user)
  user.save((err, user) => {
    if (err) return res.status(401).json({message: err.message})
    res.status(201).json({message: 'user created', auth_token: user.auth_token})
  })
})
// create a sign in route
router.post('/signin', (req, res) => {
  const userParams = req.body.user
  // user mongoose object to find the user
  User.findOne({email: userParams.email}, (err, user) => {
    // 401 is unauthorize
    if (err || !user) return res.status(401).json({error: 'email or password is invalid'})
    // else
    user.authenticate(userParams.password, (err, isMatch) => {
      // if there's an error or it doesn't match
      if (err || !user) return res.status(401).json({error: 'email or password is invalid'})
      // if (!isMatch) return res.status(401).json({error: 'email or password is invalid'})
      res.status(201).json({message: 'user logged in', auth_token: user.auth_token})
    })
  })
})
// /users
router.get('/users', applicationController.userLoggedIn, (req, res) => {
  User.find({}, function (err, user) {
    if (err) console.log({message: 'no users found'})
    res.send(user)
  })
})
router.get('/users/:id', applicationController.userLoggedIn, (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (err) console.log({message: 'no users found'})
    res.send(user)
  })
})
router.get('/users/:id/posts', applicationController.userLoggedIn, (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (err) console.log({message: 'no users found'})
    res.send(user.blog)
  })
})
router.get('/users/:id/posts/:id', applicationController.userLoggedIn, (req, res) => {
  // var userId = req.params.id
  var postId = req.params.id
  Post.findById({_id: postId}, function (err, post) {
    if (err) console.log({message: 'no users found'})
    res.send(post)
  })
})
router.post('/users/:id/posts', applicationController.userLoggedIn, (req, res) => {
  // if statement to check for user
  User.findOne({auth_token: req.query.auth_token}, (err, user) => {
    if (err || !user) return res.status(401).json({message: 'User not found!'})
    const post = new Post(req.body.post)

    // push into the correct user using the user id
    user.blog.push(post)

    post.save((err) => {
      if (err) return res.status(401).json({error: err})

      res.status(201).json({message: 'Post created!'})
    })

    user.save((err) => {
      if (err) return res.status(401).json({error: err})
    })
  })
})
module.exports = router
