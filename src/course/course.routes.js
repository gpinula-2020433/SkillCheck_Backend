import { Router } from "express";
import { getAllCourses,
         getCourseById,
         addCourse,
         updateCourseById,
         deleteCourseById
 } from "./course.controller.js";
 import { validateJwt } from "../../middlewares/validate.jwt.js"
 import { uploadCourseImage } from '../../middlewares/multer.uploads.js'

 const api = Router()

 api.get('/allCourses', validateJwt , getAllCourses)
 api.get('/courseById/:id', getCourseById)
 api.post('/addCourse', uploadCourseImage.single("imageCourse") ,addCourse)
 api.put('/updateCourse/:id', updateCourseById)
 api.delete('/deleteCourse/:id', deleteCourseById)

 export default api