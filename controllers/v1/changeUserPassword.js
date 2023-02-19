  /**
   * @description change-user-password endpoint
   * 
   * @process
   * handle errors
   * return errors if any
   * verify user's password
   * update password
   * 
   * @createdAt 16/02/2023 08:16pm
   * @lastModifiedAt 16/02/2023 08:40pm
   * 
   */

// VARIABLES
import bcrypt from 'bcryptjs'

import User from "../../models/User.js"

const changeUserPassword = async (req, res) => {
  const { id } = req.params
  const { oldPswd, newPswd, cNewPswd } = req.body

  if (req.user == null || id != req.user._id) return res.status(403).json({ error: 'Cannot complete request' })

  const user = await User.findById(req.user._id)

  if (!user) return res.status(404).json({ error: 'User does not exist' })


  if (!oldPswd || !newPswd || !cNewPswd) return res.status(400).json({ error: 'Empty field(s) available' })

  if (newPswd !== cNewPswd) return res.status(400).json({ error: 'Could\'t complete the request. Check your fields' })

  try {
    const verifyOldPswd = await bcrypt.compare(oldPswd, user.password)

    if (!verifyOldPswd) return res.status(401).json({ error: 'Old password is incorrect' })

    const salt = await bcrypt.genSalt(10)

    if (!salt) return res.status(500).json({ error: 'Something went wrong' })

    const hash = await bcrypt.hash(newPswd, salt)

    if (!hash) return res.status(500).json({ error: 'Something went wrong' })

    const updateUser = await user.updateOne({ password: hash })

    if (!updateUser) return res.status(500).json({ error: 'Something went wrong' })

    return res.status(201).json({ success: 'Password updated' })
  }
  catch(err) {
    throw new Error(err.message)
  }
}

export default changeUserPassword