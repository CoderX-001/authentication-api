  /**
   * @description update-user endpoint
   * 
   * @process
   * handle errors
   * return errors if any
   * update the user's account with the provided info
   * 
   * @createdAt 16/02/2023 07:39pm
   * @lastModifiedAt 16/02/2023 07:59pm
   * 
   */

// VARIABLES
import User from "../../models/User.js"

const updateUserAccount = async (req, res) => {
  const { id } = req.params

  if (req.user == null || id != req.user._id) return res.status(403).json({ error: 'Cannot complete request' })

  const user = await User.findById(req.user._id)

  if (!user) return res.status(404).json({ error: 'User does not exist' })

  try {
    const { name, email, username, age, DOB, phone } = req.body

    const updated = await user.updateOne({ name, email, username, age, DOB, phone })

    if (!updated) return res.status(500).json({ error: 'Something went wrong' })

    return res.status(201).json({ success: 'Update successful' })
  }
  catch(err) {
    throw new Error(err.message)
  }
}

export default updateUserAccount