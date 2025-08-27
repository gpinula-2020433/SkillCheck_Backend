import { Router } from "express";
import {
    login,
    register,
    logout,
    test
} from './auth.controller.js'
import {
    validateJwt
} from '../../middlewares/validate.jwt.js'

const api = Router()

api.post('/register', [validateJwt], register)
api.post('/login', login)
api.post('/logout', [validateJwt], logout)
api.get('/test', validateJwt, test)

export default api