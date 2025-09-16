import { Router } from "express";
import {
    login,
    register,
    logout,
    test,
    registerStudent,
    registerTeacher
} from './auth.controller.js'
import {
    isAdmin,
    isTeacher,
    isStudent,
    validateJwt
} from '../../middlewares/validate.jwt.js'
import { userLoginValidator, userRegistrationValidator } from "../../middlewares/validators.js";

const api = Router()

api.post('/register', [validateJwt, isAdmin, userRegistrationValidator], register)
api.post('/register/student', userRegistrationValidator, registerStudent)
api.post('/register/teacher', userRegistrationValidator, registerTeacher)
api.post('/login', userLoginValidator,login)
api.post('/logout', [validateJwt], logout)
api.get('/test', validateJwt, test)

export default api