import { Router } from "express";
import { getAllCourses,
         getCourseById,
         addCourse,
         updateCourseById,
         deleteCourseById
 } from "./course.controller.js";
 import { validateJwt } from "../../middlewares/validate.jwt.js"
 import { uploadCourseImage } from '../../middlewares/multer.uploads.js'
import { deleteFileOnError } from "../../middlewares/delete.file.on.errors.js";

 const api = Router()

 api.get('/allCourses', validateJwt , getAllCourses)
 api.get('/courseById/:id', getCourseById)
 api.post('/addCourse', uploadCourseImage.single("imageCourse"), deleteFileOnError ,addCourse)
 api.put('/updateCourse/:id', updateCourseById)
 api.delete('/deleteCourse/:id', deleteCourseById)

 export default api