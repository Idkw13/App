import { Router } from 'express'
import { userController } from '../controllers'
import auth from '../middleware/auth'
const router = new Router()

// Get one User by id
router.route('/users/:id')
.get(auth, userController.getUser)

export default router
