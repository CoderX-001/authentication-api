// VARIABLES
import express from 'express'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import logger from 'morgan'
import cookieParser from 'cookie-parser'

import v1Routes from './routes/v1/route.js'

const env = config()
const app = express()
const port = process.env.PORT
const dbURI = process.env.MONGO_URI

// Setup database
mongoose.set('strictQuery', true)
mongoose.connect(dbURI, {
  maxPoolSize: 10,
  connectTimeoutMS: 2500,
  useNewUrlParser: true,
  dbName: 'CarresioAuthDB'
}, (err, connected) => {
  if (err) throw err
  if (connected) console.log('Database connected...')
})

// Middlewares
app.use(cors())
app.use(logger('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/v1/', v1Routes)

// Unavailable routes
app.all('*', (req, res) => {
  res.sendStatus(404)
})

// Setup server connection
app.listen(port, () => console.log(`Server running on port ${port}...`))