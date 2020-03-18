import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  const authHeader = req.header('Authorization').replace('Bearer ', '')
  if (!authHeader) return res.status(401).send('Access Denied')
  try {
    const payload = jwt.verify(authHeader, process.env.TOKEN_SECRET)
    if (payload.type !== 'access') {
      res.status(401).send({
        message: 'Invalid Token'
      })
    }
    next()
  }
  catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(401).send({
        message: 'Token expired!'
      })
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.status(401).send({
        message: 'Invalid Token!'
      })
    }
  }
}
