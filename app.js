const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const logger = require('morgan')
// const User = require('./models/user')
// const appController = require('./controllers/application_controller')
const router = require('./config/routes')
const app = express()
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

mongoose.connect(process.env.MONGODB_URI)

app.use('/', router)

app.listen(3000, () => {
  console.log(`Fantastic Server is listening on 3000`)
})
