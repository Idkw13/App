import { Router } from 'express'
import { authController} from '../controllers'

const router = new Router()

// Add a new User
router.route('/sign-up')
.post(authController.signup)

// Sign-in
router.route('/sign-in')
.post(authController.signIn)

// Refresh token
router.route('/refresh')
.post(authController.refreshToken)

export default router
