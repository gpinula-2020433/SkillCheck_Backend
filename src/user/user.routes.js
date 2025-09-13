import { Router } from "express";
import { 
    getAllUsers, 
    getAuthenticatedUser,
    getAllTeachers,
    getAllStudents
} from "./user.controller.js";
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js";


const api = Router()

api.get('/getAllUsers', [validateJwt, isAdmin], getAllUsers)
api.get('/getAuthenticatedUser', [validateJwt], getAuthenticatedUser)

api.get("/allTeachers", validateJwt, getAllTeachers)
api.get('/allStudents', validateJwt, getAllStudents)

export default api