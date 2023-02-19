  /** 
  * @description  confirm-reset-code 
  * 
  * @createdAt  19/02/2023 05:55pm
  */

// VARIABLES
import crypto from 'crypto'

import ResetCode from "../../models/ResetCode.js"

const confirmPasswordReset = async (req, res) => {
  const { code, token } = req.body

  if (!code || !token) return res.status(400).json({ error: 'Code and token are required' })

  const findToken = await ResetCode.findOne({ resetToken: token })
  if (!findToken) return res.status(403).json({ error: 'Invalid request' })

  if (findToken.expDate <= Date.now()) {
    const deleteToken = await findToken.deleteOne()
    if (!deleteToken) return res.status(500).json({ error: 'Something went wrong' })

    return res.status(403).json({ error: 'Code has expired' })
  }

  const confirmToken = crypto.randomBytes(8).toString('hex')

  const updateToken = await findToken.updateOne({ confirmToken })

  if (!updateToken) return res.status(500).json({ error: 'Cannot continue, something went wrong' })

  res.status(200).json({ confirmToken })
}

export default confirmPasswordReset