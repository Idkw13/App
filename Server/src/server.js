import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { authRouter, userRouter } from './routes'
import mongoose from 'mongoose'

dotenv.config()

const app = express()

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8082');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, auth-token');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

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
