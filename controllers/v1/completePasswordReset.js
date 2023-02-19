  /** 
  * @description complete-password-reset endpoint
  * 
  * @createdAt  19/02/2023  06:19pm
  */

// VARIABLES
import bcrypt from 'bcryptjs'

import ResetCode from "../../models/ResetCode.js"
import User from "../../models/User.js"

const completePasswordReset = async (req, res) => {
  const { pswd, cpswd, confirmToken } = req.body

  if (!pswd || !cpswd || !confirmToken) return res.status(400).json({ error: 'Empty field(s) found' })

  if (pswd !== cpswd) return res.status(400).json({ error: 'Passwords do not match' })

  const verifyToken = await ResetCode.findOne({ confirmToken })
  if (!verifyToken) return res.status(403).json({ error: 'Invalid request' })
  
  const findUser = await User.findOne({ email: verifyToken.userMail })
  if (!findUser) return res.status(403).json({ error: 'Invalid request' })

  const salt = await bcrypt.genSalt(10)
  if (!salt) return res.status(500).json({ error: 'Something went wrong' })

  const hash = await bcrypt.hash(pswd, salt)
  if (!hash) return res.status(500).json({ error: 'Something went wrong' })

  const updateUserPassword = await findUser.updateOne({ password: hash })
  if (!updateUserPassword) return res.status(500).json({ error: 'Something went wrong' })

  const deleteResetCode = verifyToken.deleteOne()
  if (!deleteResetCode) return res.status(500).json({ error: 'Something went wrong' })

  res.status(201).json({ success: 'Password reset complete' })
}

export default completePasswordReset