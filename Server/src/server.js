import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { authRouter, userRouter } from './routes'
import mongoose from 'mongoose'

dotenv.config()

const app = express()

// parse requests of content-type - application/json
app.use(bodyParser.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// routes
app.use('/api/auth', authRouter)

app.use('/api', userRouter)

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) {
    throw new Error(err)
  } else {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}.`)
    })
  }
})
