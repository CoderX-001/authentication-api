 /** 
  * @description delete-user-account endpoint
  *
  * @process
  * handle errors
  * return errors if any
  * delete user from the database
  * 
  * @createdAt 15/02/2023 12:05am
  * @lastModifiedAt 16/02/2023 07:45pm
  * 
  */

// VARIABLES
import User from "../../models/User.js"

const deleteUserAccount = async (req, res) => {
  const { id } = req.params

  if (req.user == null || id != req.user._id) return res.status(403).json({ error: 'Cannot complete request' })

  const user = await User.findById(req.user._id)

  if (!user) return res.status(400).json({ error: 'User does not exist' })

  try {
    const deleted = await user.deleteOne()

    if (!deleted) return res.status(500).json({ error: 'Something went wrong on the server' })

    return res.status(200).json({ success: 'Process completed' })
  }
  catch(err) {
    throw new Error(err.message)
  }
}

export default deleteUserAccount