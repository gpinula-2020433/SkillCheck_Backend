import { Router } from "express";
import { addStudentCourse, 
         assignStudentsToCourse, 
         deleteStudentCourseById, 
         getAllStudentCourses,
         getStudentCourseById,
 } from "./studentCourse.controller.js";

 const api = Router()

 api.get('/allCoursesStudent', getAllStudentCourses)
 api.get('/courseStudentById/:id', getStudentCourseById)
 api.post('/addStudentCourse', addStudentCourse)
 api.delete('/deleteStudentCourse/:id', deleteStudentCourseById)

 api.post('/assign', assignStudentsToCourse)

 export default api