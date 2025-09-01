import { Router } from "express";
import { addStudentCourse, 
         deleteStudentCourseById, 
         getAllStudentCourses,
         getStudentCourseById,
 } from "./studentCourse.controller.js";

 const api = Router()

 api.get('/allCoursesStudent', getAllStudentCourses)
 api.get('/courseStudentById/:id', getStudentCourseById)
 api.post('/addStudentCourse', addStudentCourse)
 api.delete('/deleteStudentCourse/:id', deleteStudentCourseById)

 export default api