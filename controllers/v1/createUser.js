  /** 
  * @description create-user endpoint
  * 
  * @passwordHash bcryptjs
  * @authenticationType jsonwebtoken
  *
  * @process
  * handle errors
  * return errors if any
  * email & username database verification
  * hash user's password
  * save user to database
  * create jwt for the user
  * 
  * @createdAt 14/02/2023 10:46pm
  * @lastModifiedAt 16/02/2023 08:08pm
  * 
  */
 

// VARIABLES
import bcrypt from 'bcryptjs'
import { signAccessJWT, signRefreshJWT } from '../../utils/jwt.js'

import User from '../../models/User.js'

// Create-User function
const createUser = async (req, res) => {
  const { name, email, username, DOB, password } = req.body
  let errors = []

  if (!name || !email || !username || !DOB || !password) { // CHECK FOR EMPTY FIELDS
    errors.push({ error: 'Empty field(s) available' })
  }

  if (email) { // EMAIL VALIDATION
    const atpos = email.indexOf('@')
    const dotpos = email.lastIndexOf('.')

    if (atpos < 1 || dotpos < 1 || dotpos - atpos < 2 || dotpos < atpos){
      errors.push({ error: 'Invalid email' })
    }
  }

  if (DOB) { // VALIDATE DATE-OF-BIRTH{DOB}
    function validateDOB(item, splitBy, errorHolder) {
      const splitter = item.split(splitBy)
      const checkAgeLimit = new Date().getFullYear() - parseInt(splitter[0])

      if (splitter[0].length !== 4) { // CHECK YEAR, VALID IF 4 DIGITS LONG
        errorHolder.push({ error: 'Invalid date' })
      }
      else if (splitter[1].length !== 2) { // CHECK MONTH, VALID IF 2 DIGITS LONG
        errorHolder.push({ error: 'Invalid date' })
      }
      else if (splitter[2].length !== 2) { // CHECK DAY, VALID IF 2 DIGITS LONG
        errorHolder.push({ error: 'Invalid date' })
      }
      else {
        if (checkAgeLimit > 75) { // CHECK IF USER'S AGE EXCEEDS MAX AGE LIMIT = 75
          errorHolder.push({ error: 'Maximum age limit exceeded' })
        }
        else if (checkAgeLimit < 13) { // CHECK IF USER'S AGE IS BELOW MIN AGE LIMIT = 13
          errorHolder.push({ error: 'Minimum age limit not reached' })
        }
        else {
          if (splitter[1] < '01' || splitter[1] > '12') { // CHECK IF MONTH IS VALID
            errorHolder.push({ error: 'Invalid date' })
          }
          else { // CHECK IF DATE IS AVAILABLE IN SELECTED MONTH
            if (splitter[1] === '01' || splitter[1] === '03' || splitter[1] === '05' || splitter[1] === '07' || splitter[1] === '08' || splitter[1] === '10' || splitter[1] === '12'){
              if (splitter[2] > '31') {
                errorHolder.push({ error: 'Invalid date' })
              }
            }
            else if (splitter[1] === '04' || splitter[1] === '06' || splitter[1] === '09' || splitter[1] === '11') {
              if (splitter[2] > '30') {
                errorHolder.push({ error: 'Invalid date' })
              }
            }
            else if (splitter[1] === '02') {
              if (splitter[2] > '28') {
                errorHolder.push({ error: 'Invalid date' })
              }
            }
            else {
              if (splitter[2] < '01') {
                errorHolder.push({ error: 'Invalid date' })
              }
            }
          }
        }
      }
    }

    if (DOB.includes('-')) {
      validateDOB(DOB, '-', errors)
    }
    else {
      if (DOB.includes('/')) {
        validateDOB(DOB, '/', errors)
      }
      else {
        errors.push({ error: 'Invalid date' })
      }
    }
  }

  if (username.length < 8) { // CHECK USERNAME LENGTH, VALID IF >= 8 CHARACTERS LONG
    errors.push({ error: 'Username too short' })
  }

  if (password.length < 8) { // CHECK PASSWORD LENGTH, VALID IF >= 8 CHARACTERS LONG
    errors.push({ error: 'Password too short' })
  }

  // CHECK IF THERE WERE ANY ERRORS DURING ERROR-CHECK
  if (errors.length > 0) return res.status(400).json(errors)
    
  try {
    const findEmail = await User.findOne({ email })
    const findUsername = await User.findOne({ username })

    if (findEmail) { // CHECK IF THE EMAIL ALREADY EXISTS IN THE DATABASE
      errors.push({ error: 'Email already exists' })
      return res.status(400).json(errors)
    }

    if (findUsername) { // CHECK IF THE USERNAME ALREADY EXISTS IN THE DATABASE
      errors.push({ error: 'Username already exists' })
      return res.status(400).json(errors)
    }

    // Get the age of the user
    const bday = new Date(DOB).getTime()
    const today = new Date().getTime()
    const oneYear = 31536000000
    const age = Math.floor((today - bday) / oneYear)

    const salt = await bcrypt.genSalt(10) // Generate salt to create hash
    
    const hash = await bcrypt.hash(password, salt) // Generate password hash

    // Create a new user and set the user's password to the hash
    const newUser = new User({
      name,
      email,
      username,
      DOB: DOB.includes('/') ? DOB.replace(/\//g, '-') : DOB,
      age,
      password: hash,
      accessToken: '',
      refreshToken: ''
    })

    // CALL THE FUNCTION TO GENERATE JWT USING THE USER'S ID AS THE PAYLOAD
    const accessToken = await signAccessJWT(newUser._id)
    const refreshToken = await signRefreshJWT(newUser._id)

    // DELETE THE USER FROM THE DATABASE IF THE TOKEN IS NOT GENERATED
    if (!accessToken || !refreshToken) {
      User.deleteOne({ _id: newUser._id }).then(() => {
        return res.status(403).json({ error: 'Couldn\'t complete the request' })
      }).catch(err => console.error(err))
    }

    newUser.accessToken = accessToken
    newUser.refreshToken = refreshToken

    const user = await newUser.save()

    if (!user) return res.status(500).json({ error: 'Something went wrong' })

    const userInfo = {
      name: user.name,
      email: user.email,
      username: user.username,
      age: user.age,
      DOB: user.DOB,
      phone: user.phone,
      createdAt: user.createdAt,
      lastActive: user.lastActive,
      active: user.active
    }

    return res.status(201).json({ accessToken, refreshToken, user:userInfo })

  }
  catch(err) {
    throw new Error(err.message)
  }
}

export default createUser