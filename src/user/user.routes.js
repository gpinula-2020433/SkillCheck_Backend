import { Router } from "express";
import { 
    getAllUsers, 
    getAuthenticatedUser
} from "./user.controller.js";
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js";


const api = Router()

api.get('/getAllUsers', [validateJwt, isAdmin], getAllUsers)
api.get('/getAuthenticatedUser', [validateJwt], getAuthenticatedUser)

export default api