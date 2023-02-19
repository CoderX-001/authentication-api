 /** 
  * @description login-user endpoint
  * 
  * @passwordVerify bcryptjs
  * @authenticationType jsonwebtoken
  *
  * @process
  * handle errors
  * return errors if any
  * email database verification
  * verify user's password
  * create jwt for the user
  * 
  * @createdAt 14/02/2023 11:25pm
  * @lastModifiedAt 16/02/2023 08:46pm
  * 
  */

// VARIABLES
import bcrypt from 'bcryptjs'

import User from '../../models/User.js'
import { signAccessJWT, signRefreshJWT } from '../../utils/jwt.js'

const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) return res.status(400).json({ error: 'Empty field(s) available' })
    
  try {
    // CHECK IF THE USER'S EMAIL EXISTS IN THE DATABASE
    const user = await User.findOne({ email })

    if (!user) return res.status(404).json({ error: 'Invalid login credentials' })

    // CHECK IF THE USER'S PASSWORD IS CORRECT
    const verifyPassword = await bcrypt.compare(password, user.password)

    if (!verifyPassword) return res.status(400).json({ error: 'Invalid login credentials' })

    // CREATE THE ACCESS TOKEN AND REFRESH TOKEN FOR THE USER
    const accessToken = await signAccessJWT(user._id)
    const refreshToken = await signRefreshJWT(user._id)

    if (!accessToken || !refreshToken) return res.status(500).json({ error: 'Couldn\'t complete the request' })

    const updateUser = await user.updateOne({ accessToken, refreshToken })

    if (!updateUser) return res.status(500).json({ error: 'Couldn\'t complete the request' })

    return res.status(201).json({ accessToken, refreshToken })

  }
  catch(err) {
    throw new Error(err.message)
  }
}

export default loginUser