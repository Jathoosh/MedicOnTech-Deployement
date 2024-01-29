const express = require('express')
const session = require('express-session')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const apiRouter = require('./routes/api.js')

const app = express()

app.use(cors(
  {
    origin: [
      (process.env.CLEINT_HOST || 'localhost') + ':' + (process.env.CLEINT_PORT || 5173)

    ],
    credentials: true
  }
))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({ secret: 'demo secret', saveUninitialized: true, resave: true }))

//app.use(express.static(path.join(__dirname, '../../Front/client'))) //TODO: Temporary line, will be replaced by another service with another server

app.use('/api/', apiRouter)

module.exports = app
