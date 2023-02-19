import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Create an access token
export async function signAccessJWT(userId) {
  const payload = {
    userid: userId
  }
  const secret = process.env.ACCESS_TOKEN_SECRET
  const options = {
    expiresIn: '1y',
    issuer: 'carresio.com',
    audience: [userId]
  }

  try {
    const token = jwt.sign(payload, secret, options)

    return token
  }
  catch (err) {
    throw err
  }

}

// Verify access token
export async function verifyAccessToken(req, res, next) {
  let token = null

  if (!req.headers['authorization']) return res.status(401).json({ error: 'Not authorized' })

  const authHeader = req.headers['authorization']
  const bearerToken = authHeader.split(' ')
  token = bearerToken[1]

  try {
    const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    req.user = await User.findById(verify.userid).select('-password')

    next()
  }
  catch(err) {
    console.log(err)
    res.sendStatus(403)
    throw new Error('Forbidden')
  }

  if (!token) throw new Error('Not authorized, no token')
}

// Create an access token
export async function signRefreshJWT(userId) {
  const payload = {
    userid: userId
  }
  const secret = process.env.REFRESH_TOKEN_SECRET
  const options = {
    expiresIn: '1y',
    issuer: 'carresio.com',
    audience: [userId]
  }

  try {
    const token = jwt.sign(payload, secret, options)

    return token
  }
  catch (err) {
    throw err
  }

}