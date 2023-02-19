  /**
  * @description  reset-user-password endpoint
  * 
  * @process
  * get user email
  * handle errors
  * check if user exists in database
  * handle errors
  * send reset code to user's email
  * allow user to reset password after inputting reset code
  * 
  * @createdAt  18/02/2023 09:05pm
  * @lastModifiedAt 19/02/2023 05:55pm
  * 
  */

// VARIABLES
import nodemailer from 'nodemailer'
import crypto from 'crypto'

import User from "../../models/User.js"
import ResetCode from '../../models/ResetCode.js'

const resetUserPassword = async (req, res) => {
  const { email } = req.body

  if (!email) return res.status(400).json({ error: 'Empty field found' })

  const user = await User.findOne({ email })

  if (!user) return res.status(400).json({ error: 'User with this email does not exist' })

  const resetCode = crypto.randomBytes(3).toString('hex')

  // Send verification mail to user
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.mailAccount,
      pass: process.env.mailPass
    }
  })

  const mailOptions = {
    from: 'carresio',
    to: email,
    subject: 'Reset your password',
    html: `<p>Use the code below to reset your password</p><br><br><b style="font-size:3rem;">${resetCode}</b>`,
    text: `Use the code below to reset your password
    ${resetCode}
    `
  }

  const sentMail = await transporter.sendMail(mailOptions)
  if (!sentMail) return res.status(500).json({ error: 'Something went wrong' })

  console.log('Mail sent' + sentMail.response)

  const resetToken = crypto.randomBytes(6).toString('hex')

  const newResetCode = new ResetCode({
    userMail: email,
    resetCode,
    resetToken,
    expDate: Date.now() + 300000 // Set the expiry date to 5 minutes after generating it
  })

  // Save the reset code to the database
  const savedCode = await newResetCode.save()
  if (!savedCode) return res.status(500).json({ error: 'Something went wrong' })

  res.status(200).json({ resetToken }) // Send response to the client-side
}

export default resetUserPassword