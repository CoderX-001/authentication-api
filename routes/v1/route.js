  /**
  * @description authentication routes
  * 
  * @content
  * signup endpoint
  * login endpoint
  * 
  * @createdAt 13/02/2023 10:22pm
  * @lastModifiedAt 19/02/2023 05:31pm
  */

// VARIABLES
import express from 'express'
const router = express.Router()

import changeUserPassword from '../../controllers/v1/changeUserPassword.js'
import completePasswordReset from '../../controllers/v1/completePasswordReset.js'
import confirmPasswordReset from '../../controllers/v1/confirmPasswordReset.js'
import createUser from '../../controllers/v1/createUser.js'
import deleteUserAccount from '../../controllers/v1/deleteUserAccount.js'
import loginUser from '../../controllers/v1/loginUser.js'
import resetUserPassword from '../../controllers/v1/resetUserPassword.js'
import updateUserAccount from '../../controllers/v1/updateUserAccount.js'

import { verifyAccessToken } from '../../utils/jwt.js'

// routes
router.delete('/u/account/delete/:id', verifyAccessToken, deleteUserAccount)

router.patch('/u/account/edit/:id', verifyAccessToken, updateUserAccount)

router.patch('/u/account/edit/password/:id', verifyAccessToken, changeUserPassword)

router.post('/auth/signup', createUser)

router.post('/auth/login', loginUser)

router.post('/auth/password/reset', resetUserPassword)

router.post('/auth/password/reset/confirm', confirmPasswordReset)

router.post('/auth/password/reset/complete', completePasswordReset)

export default router